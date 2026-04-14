<<<<<<< HEAD
import { useCallback, useEffect, useState } from "react";
=======
import { useState, useCallback, useEffect } from "react";
>>>>>>> 85ef68b (Ajusta conexao tecnica e prepara beta)
import { toast } from "sonner";

declare global {
  interface Window {
    procionAPI?: {
      startSupport: () => Promise<{ ok: boolean }>;
      getSupportId: () => Promise<string>;
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
<<<<<<< HEAD
  return result.toUpperCase();
=======
  return result;
>>>>>>> 85ef68b (Ajusta conexao tecnica e prepara beta)
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

  useEffect(() => {
    let mounted = true;

    async function tryStartSupport() {
      const maxAttempts = 3;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          console.log(`Tentativa de iniciar suporte ${attempt}/${maxAttempts}`);
<<<<<<< HEAD
          if (window.procionAPI) {
            await window.procionAPI.startSupport();
            console.log("Support iniciado com sucesso.");
            return true;
          }
          return false;
=======
          await window.procionAPI!.startSupport();
          console.log("Support iniciado com sucesso.");
          return true;
>>>>>>> 85ef68b (Ajusta conexao tecnica e prepara beta)
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
<<<<<<< HEAD
          if (window.procionAPI) {
            const id = await window.procionAPI.getSupportId();
            if (id) {
              return id;
            }
=======
          const id = await window.procionAPI!.getSupportId();

          if (id) {
            return id;
>>>>>>> 85ef68b (Ajusta conexao tecnica e prepara beta)
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

<<<<<<< HEAD
  const copiarId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(supportId.replace(/\s/g, ""));
      toast.success("ID copiado");
    } catch (error) {
      console.error("Erro ao copiar ID:", error);
      toast.error("Erro ao copiar ID");
    }
  }, [supportId]);

  const fechar = useCallback(() => {
    if (window.close) {
      window.close();
    }
    toast.info("Fechando suporte...");
=======
  const copiarId = useCallback(() => {
    navigator.clipboard.writeText(supportId.replace(/\s/g, ""));
    toast.success("ID copiado para a área de transferência");
  }, [supportId]);

  const refreshPassword = useCallback(() => {
    setPassword(generatePassword());
    toast.info("Senha atualizada");
>>>>>>> 85ef68b (Ajusta conexao tecnica e prepara beta)
  }, []);

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

<<<<<<< HEAD
  const refreshPassword = useCallback(() => {
    setPassword(generatePassword());
    toast.info("Senha atualizada");
=======
  const fechar = useCallback(() => {
    if (window.close) {
      window.close();
    }
    toast.info("Fechando suporte...");
>>>>>>> 85ef68b (Ajusta conexao tecnica e prepara beta)
  }, []);

  return {
    status,
    supportId,
    password,
    copiarId,
    refreshPassword,
    reiniciar,
    fechar,
  };
}
