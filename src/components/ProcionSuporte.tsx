import { useState, useEffect, useCallback } from "react";
import { Copy, X, Wifi, WifiOff } from "lucide-react";
import iconeSrc from "@/assets/icone.png";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ConnectionStatus = "initializing" | "connecting" | "connected";

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; colorClass: string; icon: typeof Wifi }> = {
  initializing: { label: "Inicializando", colorClass: "bg-status-idle", icon: WifiOff },
  connecting: { label: "Conectando...", colorClass: "bg-status-connecting", icon: Wifi },
  connected: { label: "Conectado", colorClass: "bg-status-connected", icon: Wifi },
};

function generateSupportId(): string {
  return `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
}

export default function ProcionSuporte() {
  const [status, setStatus] = useState<ConnectionStatus>("initializing");
  const [supportId] = useState(() => generateSupportId());

  useEffect(() => {
    const t1 = setTimeout(() => setStatus("connecting"), 1500);
    const t2 = setTimeout(() => setStatus("connected"), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(supportId.replace(/\s/g, ""));
    toast.success("ID copiado para a área de transferência");
  }, [supportId]);

  const { label, colorClass, icon: StatusIcon } = STATUS_CONFIG[status];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-foreground/10 backdrop-blur-sm">
            <Monitor className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary-foreground">
            PROCION SUPORTE
          </h1>
          <p className="mt-1 text-sm font-medium text-primary-foreground/70">
            Atendimento remoto
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-center gap-2.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${colorClass} ${status !== "connected" ? "animate-pulse-dot" : ""}`} />
            <StatusIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
          </div>

          {/* ID Display */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
              Seu ID de suporte
            </label>
            <div className="rounded-xl border-2 border-border bg-muted/50 px-6 py-5 text-center">
              <span className="text-3xl font-mono font-bold tracking-[0.25em] text-foreground">
                {supportId}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleCopy}
              className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 h-11"
            >
              <Copy className="h-4 w-4" />
              Copiar ID
            </Button>
            <Button
              variant="outline"
              onClick={() => window.close()}
              className="flex-1 gap-2 h-11"
            >
              <X className="h-4 w-4" />
              Fechar
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 px-6 py-4">
          <p className="text-center text-xs text-muted-foreground">
            Aguarde o atendente para iniciar o suporte
          </p>
        </div>
      </div>
    </div>
  );
}
