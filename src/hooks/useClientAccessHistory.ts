import { useEffect, useRef, useState } from "react";
import { useSupportClient } from "./useSupportClient";

const STORAGE_KEY = "hadron:cliente:access-history";
const MAX_ITEMS = 10;

export interface ClientAccessEntry {
  hostname: string;
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
  const { status, hostname } = useSupportClient();
  const [history, setHistory] = useState<ClientAccessEntry[]>([]);
  const lastStatusRef = useRef<string | null>(null);

  useEffect(() => {
    setHistory(readStorage());
  }, []);

  useEffect(() => {
    if (status === "connecting" && lastStatusRef.current !== "connecting") {
      const entry: ClientAccessEntry = {
        hostname: hostname || "Computador",
        accessedAt: Date.now(),
      };
      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, MAX_ITEMS);
        writeStorage(next);
        return next;
      });
    }
    lastStatusRef.current = status;
  }, [status, hostname]);

  return { history };
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
