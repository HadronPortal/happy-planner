const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { exec, execFile } = require('child_process');

app.setPath('userData', path.join(os.homedir(), 'AppData', 'Roaming', 'HadronElectronTecnico'));

let mainWindow = null;
const clientStatusWatchers = new Map();
const activeSessions = new Map();

const FRONTEND_URL = 'https://hadronsuporte.lovable.app/tecnico';

const BASE_DIR = app.isPackaged
  ? path.join(process.resourcesPath, 'app')
  : process.cwd();

const RUSTDESK_EXE = path.join(BASE_DIR, 'rustdesk', 'rustdesk.exe');
const TOML_SOURCE = path.join(BASE_DIR, 'RustDesk2.toml');

const SUPABASE_URL = 'https://nmyhaunuptqokwxzldlh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5teWhhdW51cHRxb2t3eHpsZGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NDQ2MDAsImV4cCI6MjA5MTUyMDYwMH0.8gHMk6j_QSi7OD0Ax3AJFGAatX9k0h-NzFgcLz94sbk';

const LOG_FILE = path.join(app.getPath('desktop'), 'hadron-tecnico-log.txt');

function writeLog(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  try {
    fs.appendFileSync(LOG_FILE, line, 'utf8');
  } catch (err) {
    console.error('Falha ao gravar log:', err.message);
  }
  console.log(message);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAppDataRustDesk() {
  return path.join(process.env.APPDATA, 'RustDesk');
}

function getAppDataConfig() {
  return path.join(process.env.APPDATA, 'RustDesk', 'config');
}

function ensureDirs() {
  fs.mkdirSync(getAppDataRustDesk(), { recursive: true });
  fs.mkdirSync(getAppDataConfig(), { recursive: true });
}

function copyToml() {
  const dest1 = path.join(getAppDataRustDesk(), 'RustDesk2.toml');
  const dest2 = path.join(getAppDataConfig(), 'RustDesk2.toml');

  writeLog(`BASE_DIR: ${BASE_DIR}`);
  writeLog(`RUSTDESK_EXE: ${RUSTDESK_EXE}`);
  writeLog(`TOML origem: ${TOML_SOURCE}`);
  writeLog(`TOML destino 1: ${dest1}`);
  writeLog(`TOML destino 2: ${dest2}`);

  if (!fs.existsSync(TOML_SOURCE)) {
    throw new Error(`RustDesk2.toml não encontrado em: ${TOML_SOURCE}`);
  }

  ensureDirs();
  fs.copyFileSync(TOML_SOURCE, dest1);
  fs.copyFileSync(TOML_SOURCE, dest2);

  writeLog('RustDesk2.toml copiado com sucesso no técnico.');
}

async function fetchClientStatus(remoteId) {
  try {
    const cleanId = String(remoteId || '').replace(/\s/g, '');

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/support_online_clients?rustdesk_id=eq.${cleanId}&select=id,status,updated_at`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Supabase ${response.status}: ${text}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    writeLog(`Erro ao consultar status do cliente ${remoteId}: ${error.message}`);
    return null;
  }
}

async function saveAccessHistory(remoteId) {
  try {
    const cleanId = String(remoteId || '').replace(/\s/g, '');

    const payload = {
      client_rustdesk_id: cleanId,
      client_hostname: null,
      technician_hostname: os.hostname(),
      created_at: new Date().toISOString()
    };

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/support_access_history`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Supabase ${response.status}: ${text}`);
    }

    const data = await response.text();
    writeLog(`Histórico salvo com sucesso para ${cleanId}: ${data}`);
  } catch (error) {
    writeLog(`Erro ao salvar histórico para ${remoteId}: ${error.message}`);
  }
}

function getActiveSessionsList() {
  return Array.from(activeSessions.values())
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

function broadcastActiveSessions() {
  try {
    if (!mainWindow || mainWindow.isDestroyed()) return;
    const sessions = getActiveSessionsList();
    mainWindow.webContents.send('tecnico:active-sessions-updated', sessions);
    writeLog(`Sessões ativas enviadas ao frontend: ${sessions.length}`);
  } catch (error) {
    writeLog(`Erro ao enviar sessões ativas ao frontend: ${error.message}`);
  }
}

function stopClientStatusWatcher(remoteId) {
  const cleanId = String(remoteId || '').replace(/\s/g, '');
  const watcher = clientStatusWatchers.get(cleanId);

  if (watcher) {
    clearInterval(watcher);
    clientStatusWatchers.delete(cleanId);
    writeLog(`Watcher parado para o cliente ${cleanId}.`);
  }
}

function stopAllClientStatusWatchers() {
  for (const [remoteId, watcher] of clientStatusWatchers.entries()) {
    clearInterval(watcher);
    writeLog(`Watcher parado para o cliente ${remoteId}.`);
  }
  clientStatusWatchers.clear();
}

function startClientStatusWatcher(remoteId) {
  const cleanId = String(remoteId || '').replace(/\s/g, '');
  if (!cleanId) return;

  stopClientStatusWatcher(cleanId);

  writeLog(`Iniciando watcher de status para o cliente ${cleanId}.`);

  const startedAt = Date.now();
  const gracePeriodMs = 15000;
  let misses = 0;

  const watcher = setInterval(async () => {
    const elapsed = Date.now() - startedAt;

    if (elapsed < gracePeriodMs) {
      writeLog(`Watcher ${cleanId} em tolerância inicial (${Math.floor(elapsed / 1000)}s/${gracePeriodMs / 1000}s).`);
      return;
    }

    const client = await fetchClientStatus(cleanId);

    if (!client) {
      misses += 1;
      writeLog(`Cliente ${cleanId} não encontrado no painel (${misses}/3).`);

      if (misses >= 3) {
        writeLog(`Cliente ${cleanId} ausente após tolerância. Parando watcher.`);
        stopClientStatusWatcher(cleanId);

        if (activeSessions.has(cleanId)) {
          activeSessions.delete(cleanId);
          broadcastActiveSessions();
        }
      }

      return;
    }

    misses = 0;

    const status = String(client.status || '').toLowerCase();
    const inactiveStatuses = ['offline', 'finalizado', 'closed', 'encerrado', 'finished'];

    if (inactiveStatuses.includes(status)) {
      writeLog(`Cliente ${cleanId} saiu do estado ativo (${status}). Parando watcher.`);
      stopClientStatusWatcher(cleanId);

      if (activeSessions.has(cleanId)) {
        activeSessions.delete(cleanId);
        broadcastActiveSessions();
      }
    }
  }, 1500);

  clientStatusWatchers.set(cleanId, watcher);
}

async function connectRustDeskByCli(remoteId) {
  if (!fs.existsSync(RUSTDESK_EXE)) {
    throw new Error(`RustDesk.exe não encontrado em: ${RUSTDESK_EXE}`);
  }

  const cleanId = String(remoteId || '').replace(/\D/g, '');

  if (!cleanId) {
    throw new Error('ID remoto vazio.');
  }

  copyToml();

  clipboard.writeText(cleanId);
  writeLog(`ID remoto gravado no clipboard: ${cleanId}`);

  await delay(300);

  // nova instância por conexão
  exec(`start "" "${RUSTDESK_EXE}" --connect ${cleanId}`);

  writeLog(`Nova instância RustDesk iniciada para ${cleanId}.`);

  activeSessions.set(cleanId, {
    id: cleanId,
    hostname: cleanId,
    startedAt: new Date().toISOString(),
    status: 'ativa'
  });

  broadcastActiveSessions();

  saveAccessHistory(cleanId);
  startClientStatusWatcher(cleanId);
}

async function closeSessionById(remoteId) {
  const cleanId = String(remoteId || '').replace(/\D/g, '');
  if (!cleanId) return { ok: false, error: 'ID inválido' };

  writeLog(`Solicitação para encerrar sessão específica: ${cleanId}`);

  try {
    // tentativa leve: remover da lista e parar watcher
    stopClientStatusWatcher(cleanId);

    if (activeSessions.has(cleanId)) {
      activeSessions.delete(cleanId);
    }

    broadcastActiveSessions();

    // observação: aqui não estamos matando rustdesk.exe global,
    // porque isso derrubaria todas as conexões.
    // esta ação remove a sessão do seu painel e prepara a UI.

    return { ok: true };
  } catch (error) {
    writeLog(`Erro ao encerrar sessão ${cleanId}: ${error.message}`);
    return { ok: false, error: error.message };
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 850,
    minWidth: 1100,
    minHeight: 700,
    resizable: true,
    autoHideMenuBar: true,
    backgroundColor: '#0D47A1',
    webPreferences: {
      preload: path.join(BASE_DIR, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
    writeLog(`Erro ao carregar frontend técnico: ${errorCode} - ${errorDescription}`);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    writeLog('Frontend técnico carregado com sucesso no Electron.');
    broadcastActiveSessions();
  });

  writeLog(`Carregando URL: ${FRONTEND_URL}`);
  mainWindow.loadURL(FRONTEND_URL);
  mainWindow.setTitle('Hádron Suporte Técnico');

  mainWindow.on('closed', () => {
    stopAllClientStatusWatchers();
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  writeLog('Aplicação técnica iniciada.');
  createWindow();
});

app.on('before-quit', () => {
  stopAllClientStatusWatchers();
});

app.on('window-all-closed', () => {
  stopAllClientStatusWatchers();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('tecnico:open-rustdesk', async (_event, remoteId) => {
  writeLog(`Solicitação para abrir RustDesk técnico. ID recebido: ${remoteId}`);
  await connectRustDeskByCli(remoteId);
  return { ok: true };
});

ipcMain.handle('tecnico:get-active-sessions', async () => {
  return getActiveSessionsList();
});

ipcMain.handle('tecnico:close-session', async (_event, remoteId) => {
  return await closeSessionById(remoteId);
});

ipcMain.handle('tecnico:close-window', async () => {
  if (mainWindow) {
    mainWindow.close();
  }
  return { ok: true };
});