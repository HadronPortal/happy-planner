const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('procionAPI', {
  startSupport: () => ipcRenderer.invoke('support:start'),
  getSupportId: () => ipcRenderer.invoke('support:get-id'),
  stopSupport: () => ipcRenderer.invoke('support:stop')
});