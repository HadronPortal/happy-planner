import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupportClient } from "./useSupportClient";

const MAX_ITEMS = 10;
const HIDDEN_KEY = "hadron:client-access-history:hidden";

export interface ClientAccessEntry {
  id: string;
  technicianHostname: string | null;
  createdAt: string;
}

function loadHidden(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveHidden(set: Set<string>) {
  try {
    localStorage.setItem(HIDDEN_KEY, JSON.stringify(Array.from(set)));
  } catch {
    /* ignore */
  }
}

/**
 * Carrega o histórico real de acessos do técnico a este cliente,
 * a partir da tabela support_access_history no Supabase.
 * Itens ocultados pelo usuário ficam apenas escondidos localmente —
 * o registro permanece no banco.
 */
export function useClientAccessHistory() {
  const { supportId, status } = useSupportClient();
  const [allHistory, setAllHistory] = useState<ClientAccessEntry[]>([]);
  const [hidden, setHidden] = useState<Set<string>>(() => loadHidden());

  useEffect(() => {
    let cancelled = false;
    const cleanId = supportId.replace(/\D/g, "");
    if (!cleanId || cleanId === "--" || status !== "connected") {
      setAllHistory([]);
      return;
    }

    async function fetchHistory() {
      const { data, error } = await supabase
        .from("support_access_history")
        .select("id, technician_hostname, created_at")
        .eq("client_rustdesk_id", cleanId)
        .order("created_at", { ascending: false })
        .limit(MAX_ITEMS);

      if (cancelled) return;
      if (error) {
        console.error("Erro ao carregar histórico de acessos:", error);
        setAllHistory([]);
        return;
      }

      setAllHistory(
        (data ?? []).map((row) => ({
          id: row.id,
          technicianHostname: row.technician_hostname,
          createdAt: row.created_at ?? new Date().toISOString(),
        })),
      );
    }

    fetchHistory();

    const channel = supabase
      .channel(`access-history-${cleanId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_access_history",
          filter: `client_rustdesk_id=eq.${cleanId}`,
        },
        () => fetchHistory(),
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [supportId, status]);

  const hideEntry = useCallback((id: string) => {
    setHidden((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveHidden(next);
      return next;
    });
  }, []);

  const history = allHistory.filter((item) => !hidden.has(item.id));

  return { history, hideEntry };
}

export function getAccessTitle(item: ClientAccessEntry): string {
  if (item.technicianHostname && item.technicianHostname.trim()) {
    return item.technicianHostname;
  }
  return "Técnico";
}

export function formatAccessDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  if (sameDay) return `hoje às ${time}`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `ontem às ${time}`;

  const date = d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return `${date} às ${time}`;
}
