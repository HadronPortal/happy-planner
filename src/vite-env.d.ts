/// <reference types="vite/client" />

interface ElectronActiveSession {
  id: string;
  clientId?: string;
  hostname?: string;
  clientName?: string;
  startedAt: string | number;
  status?: string;
}

interface Window {
  hadronTecnicoAPI?: {
    openRustDesk: (remoteId: string) => void;
    closeWindow: () => void;
    getActiveSessions?: () => Promise<ElectronActiveSession[]> | ElectronActiveSession[];
    onActiveSessionsUpdated?: (
      cb: (sessions: ElectronActiveSession[]) => void,
    ) => (() => void) | void;
    closeSession?: (id: string) => Promise<void> | void;
  };
}
