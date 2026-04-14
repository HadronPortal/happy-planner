const { contextBridge } = require("electron");
const os = require("os");

contextBridge.exposeInMainWorld("procionAPI", {
  getHostname: () => os.hostname(),
  startSupport: async () => ({ ok: true }),
  getSupportId: async () => "",
});
