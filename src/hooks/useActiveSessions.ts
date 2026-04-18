import { useCallback, useState } from "react";

export interface ActiveSession {
  id: string;
  clientId: string;
  clientName?: string;
  startedAt: number;
}

/**
 * Gerencia as sessões ativas do técnico durante a vida útil do app.
 * Estado in-memory: ao fechar o app, a lista é zerada.
 * Pronto para ser conectado a um sinal real de conexão/desconexão
 * vindo do Electron quando disponível.
 */
export function useActiveSessions() {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);

  const startSession = useCallback((clientId: string, clientName?: string) => {
    setSessions((prev) => {
      // evita duplicar a mesma sessão ativa
      if (prev.some((s) => s.clientId === clientId)) return prev;
      return [
        {
          id: `${clientId}-${Date.now()}`,
          clientId,
          clientName,
          startedAt: Date.now(),
        },
        ...prev,
      ];
    });
  }, []);

  const endSession = useCallback((clientId: string) => {
    setSessions((prev) => prev.filter((s) => s.clientId !== clientId));
  }, []);

  const clearSessions = useCallback(() => setSessions([]), []);

  return { sessions, startSession, endSession, clearSessions };
}

export function formatSessionTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
