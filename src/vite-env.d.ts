/// <reference types="vite/client" />

interface Window {
  hadronTecnicoAPI?: {
    openRustDesk: (remoteId: string) => void;
    closeWindow: () => void;
  };
}
