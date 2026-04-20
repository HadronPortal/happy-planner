const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

app.setPath('userData', path.join(os.homedir(), 'AppData', 'Roaming', 'HadronElectronCliente'));

let mainWindow = null;
let hideWatcher = null;
let heartbeatInterval = null;
let currentRustdeskId = null;
let currentPassword = null;
let isStoppingSupport = false;

const BASE_DIR = app.isPackaged
  ? path.join(process.resourcesPath, 'app')
  : process.cwd();

const RUSTDESK_EXE = path.join(BASE_DIR, 'rustdesk', 'rustdesk.exe');
const FRONTEND_URL = 'https://hadronsuporte.lovable.app/suporte';
const MINIMIZE_SCRIPT = path.join(BASE_DIR, 'minimize-rustdesk.ps1');

const SUPABASE_URL = 'https://nmyhaunuptqokwxzldlh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5teWhhdW51cHRxb2t3eHpsZGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NDQ2MDAsImV4cCI6MjA5MTUyMDYwMH0.8gHMk6j_QSi7OD0Ax3AJFGAatX9k0h-NzFgcLz94sbk';

const EMPRESA_FIXA = 'Nome da Empresa do Cliente';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const LOG_FILE = path.join(app.getPath('desktop'), 'hadron-cliente-log.txt');

function writeLog(msg) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  try {
    fs.appendFileSync(LOG_FILE, line);
  } catch (error) {
    console.error('Falha ao gravar log:', error.message);
  }
  console.log(msg);
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function killOldProcesses() {
  writeLog('Matando processos antigos do RustDesk...');
  exec('taskkill /F /T /IM rustdesk.exe', () => {});
  exec('taskkill /F /T /IM RuntimeBroker_rustdesk.exe', () => {});
}

async function forceStopRustDesk() {
  writeLog('Iniciando encerramento forçado do RustDesk...');

  for (let i = 0; i < 8; i++) {
    killOldProcesses();
    await delay(250);
  }

  writeLog('Encerramento forçado do RustDesk concluído.');
}

function bringMainWindowToFront() {
  try {
    if (!mainWindow || mainWindow.isDestroyed()) return;

    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }

    mainWindow.show();
    mainWindow.focus();
    mainWindow.moveTop();
  } catch (error) {
    writeLog(`Erro ao trazer janela principal para frente: ${error.message}`);
  }
}

function generateSupportPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let password = '';

  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}

async function startRustDesk() {
  const dir = path.dirname(RUSTDESK_EXE);
  writeLog(`Abrindo RustDesk em: ${RUSTDESK_EXE}`);
  await execPromise(`powershell -ExecutionPolicy Bypass -Command "Start-Process -FilePath '${RUSTDESK_EXE}' -WorkingDirectory '${dir}'"`);
}

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (stdout) writeLog(`stdout: ${stdout}`);
      if (stderr) writeLog(`stderr: ${stderr}`);
      if (err) return reject(err);
      resolve({ stdout, stderr });
    });
  });
}

function minimizeRustDesk() {
  if (!fs.existsSync(MINIMIZE_SCRIPT)) {
    writeLog(`Script de minimizar não encontrado: ${MINIMIZE_SCRIPT}`);
    return;
  }

  exec(`powershell -ExecutionPolicy Bypass -File "${MINIMIZE_SCRIPT}"`, (err, stdout, stderr) => {
    if (stdout) writeLog(`stdout minimizar: ${stdout}`);
    if (stderr) writeLog(`stderr minimizar: ${stderr}`);
    if (err) {
      writeLog(`Erro ao minimizar RustDesk: ${err.message}`);
      return;
    }
    writeLog('Comando PowerShell executado para minimizar/esconder o RustDesk.');
  });
}

function startHideWatcher() {
  stopHideWatcher();

  const started = Date.now();

  hideWatcher = setInterval(() => {
    minimizeRustDesk();

    if (Date.now() - started > 5000) {
      stopHideWatcher();
      writeLog('Hide watcher encerrado.');
    }
  }, 300);
}

function stopHideWatcher() {
  if (hideWatcher) {
    clearInterval(hideWatcher);
    hideWatcher = null;
    writeLog('Hide watcher parado.');
  }
}

async function getSupportId() {
  try {
    const { stdout } = await execPromise(`"${RUSTDESK_EXE}" --get-id`);
    const id = (stdout || '').match(/\d+/)?.[0];

    if (!id) throw new Error('ID inválido');

    writeLog(`ID obtido com sucesso: ${id}`);
    return id;
  } catch (error) {
    writeLog(`Erro ao obter ID: ${error.message}`);
    return '--';
  }
}

async function sendOnline(id) {
  const payload = {
    empresa: EMPRESA_FIXA,
    rustdesk_id: id,
    hostname: os.hostname(),
    status: 'online',
    updated_at: new Date().toISOString()
  };

  try {
    const { error } = await supabase
      .from('support_online_clients')
      .upsert(payload);

    if (error) throw error;

    writeLog(`Cliente enviado via supabase-js com sucesso: ${id}`);
  } catch (error) {
    writeLog(`Falha supabase-js: ${error.message}. Tentando fallback axios...`);

    await axios.post(
      `${SUPABASE_URL}/rest/v1/support_online_clients`,
      payload,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    writeLog(`Cliente enviado via axios com sucesso: ${id}`);
  }
}

function startHeartbeat() {
  stopHeartbeat();

  heartbeatInterval = setInterval(async () => {
    if (!currentRustdeskId) return;

    try {
      const { error } = await supabase
        .from('support_online_clients')
        .update({ updated_at: new Date().toISOString() })
        .eq('rustdesk_id', currentRustdeskId);

      if (error) {
        writeLog(`Falha no heartbeat: ${error.message}`);
      } else {
        writeLog(`Heartbeat enviado para ${currentRustdeskId}`);
      }
    } catch (error) {
      writeLog(`Erro no heartbeat: ${error.message}`);
    }
  }, 10000);
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
    writeLog('Heartbeat parado.');
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(BASE_DIR, 'preload.js'),
      contextIsolation: true
    }
  });

  mainWindow.loadURL(FRONTEND_URL);
  mainWindow.setTitle('Procion Suporte Cliente');

  mainWindow.on('close', async (event) => {
    if (!isStoppingSupport) {
      event.preventDefault();

      try {
        isStoppingSupport = true;

        stopHideWatcher();
        stopHeartbeat();

        await forceStopRustDesk();

        mainWindow.destroy();
      } catch (error) {
        writeLog(`Erro ao fechar janela do cliente: ${error.message}`);
        mainWindow.destroy();
      }
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  writeLog('Aplicação iniciada.');
  createWindow();
});

app.on('before-quit', async () => {
  stopHideWatcher();
  stopHeartbeat();
  await forceStopRustDesk();
});

app.on('window-all-closed', async () => {
  stopHideWatcher();
  stopHeartbeat();
  await forceStopRustDesk();

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('support:start', async () => {
  isStoppingSupport = false;

  currentRustdeskId = null;
  currentPassword = generateSupportPassword();

  writeLog(`Senha gerada: ${currentPassword}`);

  killOldProcesses();
  await startRustDesk();

  return {
    ok: true,
    password: currentPassword
  };
});

ipcMain.handle('support:get-id', async () => {
  if (isStoppingSupport) {
    return {
      id: '--',
      password: currentPassword || '--'
    };
  }

  const id = await getSupportId();
  currentRustdeskId = id;

  try {
    await sendOnline(id);
  } catch (error) {
    writeLog(`Erro ao enviar cliente online: ${error.message}`);
  }

  // esconde só uma vez depois que o ID já existe
  minimizeRustDesk();

  // traz o Hádron de volta pra frente
  setTimeout(() => {
    bringMainWindowToFront();
  }, 300);

  startHeartbeat();

  return {
    id: id || '--',
    password: currentPassword || '--'
  };
});

ipcMain.handle('support:stop', async () => {
  isStoppingSupport = true;

  stopHideWatcher();
  stopHeartbeat();

  await forceStopRustDesk();

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }

  return { ok: true };
});