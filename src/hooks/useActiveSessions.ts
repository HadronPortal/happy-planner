import { useCallback, useEffect, useState } from "react";

export interface ActiveSession {
  id: string;
  clientId: string;
  clientName?: string;
  hostname?: string;
  startedAt: number;
  status?: string;
}

type ElectronSession = {
  id?: string;
  clientId?: string;
  hostname?: string;
  clientName?: string;
  startedAt?: string | number;
  status?: string;
};

function normalize(s: ElectronSession): ActiveSession {
  const clientId = String(s.clientId ?? s.id ?? "").replace(/\D/g, "");
  const startedAt =
    typeof s.startedAt === "string"
      ? new Date(s.startedAt).getTime()
      : typeof s.startedAt === "number"
        ? s.startedAt
        : Date.now();
  return {
    id: String(s.id ?? `${clientId}-${startedAt}`),
    clientId,
    clientName: s.clientName ?? s.hostname,
    hostname: s.hostname,
    startedAt,
    status: s.status ?? "Ativa",
  };
}

/**
 * Gerencia as sessões ativas do técnico.
 * - Se o Electron expuser a API hadronTecnicoAPI, usa eventos reais.
 * - Caso contrário, opera com estado in-memory (fallback web/dev).
 */
export function useActiveSessions() {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);

  // Bridge com Electron: carga inicial + atualizações em tempo real
  useEffect(() => {
    const api = typeof window !== "undefined" ? window.hadronTecnicoAPI : undefined;
    if (!api) return;

    let cancelled = false;

    if (typeof api.getActiveSessions === "function") {
      Promise.resolve(api.getActiveSessions())
        .then((list) => {
          if (cancelled || !Array.isArray(list)) return;
          setSessions(list.map(normalize));
        })
        .catch((err) => console.error("Erro ao obter sessões ativas:", err));
    }

    let unsubscribe: (() => void) | undefined;
    if (typeof api.onActiveSessionsUpdated === "function") {
      const handler = (list: ElectronSession[]) => {
        if (!Array.isArray(list)) return;
        setSessions(list.map(normalize));
      };
      const result = api.onActiveSessionsUpdated(handler);
      if (typeof result === "function") unsubscribe = result;
    }

    return () => {
      cancelled = true;
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (err) {
          console.error("Erro ao remover listener de sessões:", err);
        }
      }
    };
  }, []);

  const startSession = useCallback((clientId: string, clientName?: string) => {
    setSessions((prev) => {
      if (prev.some((s) => s.clientId === clientId)) return prev;
      return [
        {
          id: `${clientId}-${Date.now()}`,
          clientId,
          clientName,
          hostname: clientName,
          startedAt: Date.now(),
          status: "Ativa",
        },
        ...prev,
      ];
    });
  }, []);

  const endSession = useCallback(async (sessionOrClientId: string) => {
    const api = typeof window !== "undefined" ? window.hadronTecnicoAPI : undefined;
    if (api && typeof api.closeSession === "function") {
      try {
        await api.closeSession(sessionOrClientId);
      } catch (err) {
        console.error("Erro ao encerrar sessão via Electron:", err);
      }
    }
    setSessions((prev) =>
      prev.filter((s) => s.id !== sessionOrClientId && s.clientId !== sessionOrClientId),
    );
  }, []);

  const clearSessions = useCallback(() => setSessions([]), []);

  return { sessions, startSession, endSession, clearSessions };
}

export function formatSessionTime(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
