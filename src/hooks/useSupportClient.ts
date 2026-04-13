import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

export type ConnectionStatus = "initializing" | "connecting" | "connected";

function generateSupportId(): string {
  return `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
}

function generatePassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export function useSupportClient() {
  const [status, setStatus] = useState<ConnectionStatus>("initializing");
  const [supportId, setSupportId] = useState(() => generateSupportId());
  const [password, setPassword] = useState(() => generatePassword());

  useEffect(() => {
    const t1 = setTimeout(() => setStatus("connecting"), 1500);
    const t2 = setTimeout(() => setStatus("connected"), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [supportId]);

  const copiarId = useCallback(() => {
    navigator.clipboard.writeText(supportId.replace(/\s/g, ""));
    toast.success("ID copiado para a área de transferência");
  }, [supportId]);

  const refreshPassword = useCallback(() => {
    setPassword(generatePassword());
    toast.info("Senha atualizada");
  }, []);

  const reiniciar = useCallback(() => {
    setStatus("initializing");
    setSupportId(generateSupportId());
    setPassword(generatePassword());
    toast.info("Finalizando suporte...");
  }, []);

  const fechar = useCallback(() => {
    // In Electron, this would call window.close() or ipcRenderer.send('close')
    // For web, we show a toast
    if (window.close) {
      window.close();
    }
    toast.info("Fechando suporte...");
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
