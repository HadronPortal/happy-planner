const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('hadronTecnicoAPI', {
  openRustDesk: (remoteId) => ipcRenderer.invoke('tecnico:open-rustdesk', remoteId),
  getActiveSessions: () => ipcRenderer.invoke('tecnico:get-active-sessions'),
  closeSession: (remoteId) => ipcRenderer.invoke('tecnico:close-session', remoteId),
  closeWindow: () => ipcRenderer.invoke('tecnico:close-window'),
  onActiveSessionsUpdated: (callback) => {
    ipcRenderer.removeAllListeners('tecnico:active-sessions-updated');
    ipcRenderer.on('tecnico:active-sessions-updated', (_event, sessions) => callback(sessions));
  }
});