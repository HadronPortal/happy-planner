import { useCallback, useEffect, useState } from "react";

declare global {
  interface Window {
    procionAPI?: {
      startSupport: () => Promise<{ ok: boolean }>;
      getSupportId: () => Promise<string>;
    };
  }
}

<<<<<<< Updated upstream
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
  return result;
=======
export type ConnectionStatus = "initializing" | "connecting" | "connected";

function formatSupportId(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }
  return value || "--";
}

function generatePassword() {
  return Math.random().toString(36).slice(-6).toUpperCase();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  const [password, setPassword] = useState(() => generatePassword());
=======
  const [password, setPassword] = useState(generatePassword());
>>>>>>> Stashed changes

  useEffect(() => {
    let mounted = true;

    async function tryStartSupport() {
      const maxAttempts = 3;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          console.log(`Tentativa de iniciar suporte ${attempt}/${maxAttempts}`);
<<<<<<< Updated upstream
          await window.procionAPI!.startSupport();
=======

          await window.procionAPI!.startSupport();

>>>>>>> Stashed changes
          console.log("Support iniciado com sucesso.");
          return true;
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
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
          const id = await window.procionAPI!.getSupportId();

          if (id) {
            return id;
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
<<<<<<< Updated upstream
=======

  const copiarId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(supportId.replace(/\s/g, ""));
    } catch (error) {
      console.error("Erro ao copiar ID:", error);
    }
  }, [supportId]);
>>>>>>> Stashed changes

  const fechar = useCallback(() => {
    window.close();
  }, []);

  const reiniciar = useCallback(async () => {
    try {
      if (!window.procionAPI) return;

      setStatus("connecting");
      setSupportId("--");

      await sleep(800);
      await window.procionAPI.startSupport();
      await sleep(1200);

      const id = await window.procionAPI.getSupportId();

      setSupportId(formatSupportId(id || "--"));
      setStatus("connected");
    } catch (error) {
      console.error("Erro ao reiniciar suporte:", error);
      setStatus("connected");
    }
  }, []);

  const refreshPassword = useCallback(() => {
    setPassword(generatePassword());
<<<<<<< Updated upstream
    toast.info("Senha atualizada");
  }, []);

  const reiniciar = useCallback(async () => {
    try {
      if (!window.procionAPI) return;

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

  const fechar = useCallback(() => {
    if (window.close) {
      window.close();
    }
    toast.info("Fechando suporte...");
=======
>>>>>>> Stashed changes
  }, []);

  return {
    status,
    supportId,
    password,
    copiarId,
    fechar,
    reiniciar,
    refreshPassword,
  };
}