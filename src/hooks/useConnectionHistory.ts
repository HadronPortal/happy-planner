import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "hadron:tecnico:recent-ids";
const MAX_ITEMS = 20;

export interface RecentConnection {
  id: string;
  name?: string;
  password?: string;
  lastUsedAt: number;
}

function readStorage(): RecentConnection[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.id === "string")
      .map((item) => ({
        id: item.id.replace(/\D/g, ""),
        name: typeof item.name === "string" ? item.name : undefined,
        password: typeof item.password === "string" ? item.password : undefined,
        lastUsedAt: typeof item.lastUsedAt === "number" ? item.lastUsedAt : Date.now(),
      }))
      .filter((item) => item.id.length > 0)
      .slice(0, MAX_ITEMS);
  } catch {
    return [];
  }
}

function writeStorage(items: RecentConnection[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota / privacy errors
  }
}

export function useConnectionHistory() {
  const [history, setHistory] = useState<RecentConnection[]>([]);

  useEffect(() => {
    setHistory(readStorage());
  }, []);

  const addConnection = useCallback((rawId: string, name?: string, password?: string) => {
    const cleanId = rawId.replace(/\D/g, "");
    if (!cleanId) return;
    setHistory((prev) => {
      const existing = prev.find((item) => item.id === cleanId);
      const filtered = prev.filter((item) => item.id !== cleanId);
      const next = [
        {
          id: cleanId,
          name: name ?? existing?.name,
          password: password ?? existing?.password,
          lastUsedAt: Date.now(),
        },
        ...filtered,
      ].slice(0, MAX_ITEMS);
      writeStorage(next);
      return next;
    });
  }, []);

  const renameConnection = useCallback((id: string, name: string) => {
    setHistory((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, name: name.trim() || undefined } : item,
      );
      writeStorage(next);
      return next;
    });
  }, []);

  const removeConnection = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((item) => item.id !== id);
      writeStorage(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    writeStorage([]);
    setHistory([]);
  }, []);

  return { history, addConnection, renameConnection, removeConnection, clearHistory };
}

export function formatRustDeskId(rawId: string): string {
  const digits = rawId.replace(/\D/g, "").slice(0, 9);
  return digits.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) =>
    [a, b, c].filter(Boolean).join(" "),
  );
}
