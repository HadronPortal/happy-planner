import { useEffect, useRef, useState } from "react";
import { useSupportClient } from "./useSupportClient";

const STORAGE_KEY = "hadron:cliente:access-history";
const MAX_ITEMS = 10;

export interface ClientAccessEntry {
  hostname: string;
  supportId?: string;
  accessedAt: number;
}

function readStorage(): ClientAccessEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => i && typeof i.hostname === "string" && typeof i.accessedAt === "number")
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

function writeStorage(items: ClientAccessEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

/**
 * Tracks every transition into "connecting" status as a remote access event,
 * keeping a small visual log of the most recent attendances on this machine.
 */
export function useClientAccessHistory() {
  const { status, hostname, supportId } = useSupportClient();
  const [history, setHistory] = useState<ClientAccessEntry[]>([]);
  const lastStatusRef = useRef<string | null>(null);

  useEffect(() => {
    const stored = readStorage();
    const cleaned = stored.filter(
      (i) => (i.hostname && i.hostname !== "Seu Computador") || (i.supportId && i.supportId !== "--")
    );
    if (cleaned.length !== stored.length) writeStorage(cleaned);
    setHistory(cleaned);
  }, []);

  // Histórico só é gravado por gatilho explícito (ex: copiarId/atendimento real).
  // Abrir a tela, inicializar o app ou carregar o ID NÃO devem criar registros.
  useEffect(() => {
    lastStatusRef.current = status;
  }, [status]);

  const removeEntry = (accessedAt: number) => {
    setHistory((prev) => {
      const next = prev.filter((i) => i.accessedAt !== accessedAt);
      writeStorage(next);
      return next;
    });
  };

  return { history, removeEntry };
}

function formatSupportId(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }
  return digits || value;
}

export function getAccessTitle(item: ClientAccessEntry): string {
  if (item.hostname && item.hostname.trim() && item.hostname !== "Seu Computador") {
    return item.hostname;
  }
  if (item.supportId && item.supportId !== "--") {
    return formatSupportId(item.supportId);
  }
  return "Acesso recente";
}

export function formatAccessDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
