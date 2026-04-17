import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    procionAPI?: {
      startSupport: () => Promise<{ ok: boolean }>;
      stopSupport?: () => void;
      getSupportId: () => Promise<string>;
      getHostname?: () => string;
    };
  }
}

export type ConnectionStatus = "initializing" | "connecting" | "connected";

function generatePassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result.toUpperCase();
}

function formatSupportId(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }
  return value || "--";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useSupportClient() {
  const [status, setStatus] = useState<ConnectionStatus>("initializing");
  const [supportId, setSupportId] = useState("--");
  const [password, setPassword] = useState(() => generatePassword());
  const [hostname, setHostname] = useState("Seu Computador");

  const resolveCurrentSupportId = useCallback(async () => {
    const currentId = supportId.replace(/\s/g, "");

    if (currentId && currentId !== "--") {
      return currentId;
    }

    if (window.procionAPI?.getSupportId) {
      const fallback = await window.procionAPI.getSupportId();
      const fallbackId = typeof fallback === "string" ? fallback : (fallback?.id ?? "");
      return fallbackId?.replace(/\D/g, "") || "";
    }

    return "";
  }, [supportId]);

  function parseSupportResponse(value: unknown): { id: string; password: string } {
    if (!value) return { id: "", password: "" };
    if (typeof value === "string") return { id: value, password: "" };
    if (typeof value === "object") {
      const obj = value as { id?: string; password?: string };
      return { id: obj.id ?? "", password: obj.password ?? "" };
    }
    return { id: "", password: "" };
  }

  useEffect(() => {
    let mounted = true;

    async function tryStartSupport() {
      const maxAttempts = 3;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          console.log(`Tentativa de iniciar suporte ${attempt}/${maxAttempts}`);
          if (window.procionAPI) {
            await window.procionAPI.startSupport();
            console.log("Support iniciado com sucesso.");
            return true;
          }
          return false;
        } catch (error) {
          console.error(`Falha ao iniciar suporte na tentativa ${attempt}`, error);
          if (attempt < maxAttempts) {
            await sleep(1500);
          }
        }
      }
      return false;
    }

    async function tryGetSupportId() {
      const maxAttempts = 5;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          console.log(`Tentativa de obter ID ${attempt}/${maxAttempts}`);
          if (window.procionAPI) {
            const id = await window.procionAPI.getSupportId();
            if (id) {
              return id;
            }
          }
        } catch (error) {
          console.error(`Falha ao obter ID na tentativa ${attempt}`, error);
        }
        await sleep(1200);
      }
      return "--";
    }

    async function iniciar() {
      try {
        if (!window.procionAPI) {
          console.log("Electron não detectado.");
          if (mounted) {
            setStatus("connected");
            setSupportId("--");
          }
          return;
        }

        // Get hostname
        if (window.procionAPI.getHostname) {
          try {
            const name = window.procionAPI.getHostname();
            if (name && mounted) {
              setHostname(name);
            }
          } catch (e) {
            console.error("Erro ao obter hostname:", e);
          }
        }

        if (mounted) {
          setStatus("initializing");
        }

        await sleep(1200);

        if (mounted) {
          setStatus("connecting");
        }

        const started = await tryStartSupport();

        if (!started) {
          throw new Error("Não foi possível iniciar o suporte.");
        }

        await sleep(1500);

        const id = await tryGetSupportId();

        if (!mounted) return;

        setSupportId(formatSupportId(id));
        setStatus("connected");
      } catch (error) {
        console.error("Erro ao iniciar suporte:", error);
        if (mounted) {
          setStatus("connected");
          setSupportId("--");
        }
      }
    }

    iniciar();

    return () => {
      mounted = false;
    };
  }, []);

  const copiarId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(supportId.replace(/\s/g, ""));
      toast.success("ID copiado");
    } catch (error) {
      console.error("Erro ao copiar ID:", error);
      toast.error("Erro ao copiar ID");
    }
  }, [supportId]);

  const fechar = useCallback(async () => {
    try {
      // 1. Resolve ID FIRST (before stopping support which may kill the process)
      const cleanId = await resolveCurrentSupportId();
      console.log("Finalizando suporte para ID:", cleanId);

      // 2. Update Supabase status to offline BEFORE stopping support
      if (cleanId) {
        const { error, data } = await supabase
          .from("support_online_clients")
          .update({ status: "offline", updated_at: new Date().toISOString() })
          .eq("rustdesk_id", cleanId)
          .select();

        if (error) {
          console.error("Erro ao atualizar Supabase:", error);
          throw error;
        }
        console.log("Status atualizado para offline:", data);
      } else {
        console.warn("Nenhum ID disponível para atualizar status");
      }

      // 3. Stop RustDesk locally
      if (window.procionAPI?.stopSupport) {
        await window.procionAPI.stopSupport();
      }

      toast.info("Suporte finalizado");

      // 4. Close window after a brief delay to ensure toast/update completes
      setTimeout(() => {
        if (window.close) {
          window.close();
        }
      }, 500);
    } catch (error) {
      console.error("Erro ao finalizar suporte:", error);
      toast.error("Erro ao finalizar suporte");
    }
  }, [resolveCurrentSupportId]);

  const reiniciar = useCallback(async () => {
    try {
      if (!window.procionAPI) {
        toast.error("API do Electron não disponível");
        return;
      }

      setStatus("initializing");
      setSupportId("--");
      setPassword(generatePassword());

      await sleep(800);
      await window.procionAPI.startSupport();
      await sleep(1200);

      const id = await window.procionAPI.getSupportId();

      setSupportId(formatSupportId(id || "--"));
      setStatus("connected");
      toast.info("Suporte reiniciado");
    } catch (error) {
      console.error("Erro ao reiniciar suporte:", error);
      setStatus("connected");
      toast.error("Erro ao reiniciar suporte");
    }
  }, []);

  const refreshPassword = useCallback(() => {
    setPassword(generatePassword());
    toast.info("Senha atualizada");
  }, []);

  return {
    status,
    supportId,
    password,
    hostname,
    copiarId,
    fechar,
    reiniciar,
    refreshPassword,
  };
}
