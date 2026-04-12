import { useState, useCallback, useEffect } from "react";
import { Copy, X, RotateCcw } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ConnectionStatus = "initializing" | "connecting" | "connected";

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; dotClass: string }> = {
  initializing: { label: "Inicializando", dotClass: "bg-muted-foreground animate-pulse-dot" },
  connecting: { label: "Conectando...", dotClass: "bg-primary animate-pulse-dot" },
  connected: { label: "Conectado", dotClass: "bg-[hsl(var(--status-connected))]" },
};

function generateSupportId(): string {
  return `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
}

export default function HadronSuporte() {
  const [status, setStatus] = useState<ConnectionStatus>("initializing");
  const [supportId, setSupportId] = useState(() => generateSupportId());

  useEffect(() => {
    const t1 = setTimeout(() => setStatus("connecting"), 1500);
    const t2 = setTimeout(() => {
      setStatus("connected");
      toast.success("Conectado com sucesso");
    }, 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [supportId]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(supportId.replace(/\s/g, ""));
    toast.success("ID copiado para a área de transferência");
  }, [supportId]);

  const handleRestart = useCallback(() => {
    setStatus("initializing");
    setSupportId(generateSupportId());
    toast.info("Reiniciando suporte...");
  }, []);

  const { label, dotClass } = STATUS_CONFIG[status];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Subtle background grid effect */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--secondary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative w-full max-w-md">
        {/* Main card */}
        <div className="relative rounded-2xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden">
          {/* Top accent line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" />

          {/* Header */}
          <div className="px-8 pt-8 pb-4 flex flex-col items-center bg-black rounded-b-xl">
            <img
              src={logoSrc}
              alt="Hádron Suporte"
              className="h-14 object-contain mb-3 animate-subtle-float"
            />
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
              Atendimento remoto
            </p>
          </div>

          {/* Status indicator */}
          <div className="px-8 py-3">
            <div className="flex items-center justify-center gap-2.5 rounded-lg bg-muted/40 px-4 py-2.5 border border-border/50">
              <span className={`h-2 w-2 rounded-full ${dotClass}`} />
              <span className="text-xs font-medium text-muted-foreground tracking-wide">
                {label}
              </span>
            </div>
          </div>

          {/* ID Section */}
          <div className="px-8 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground text-center mb-3">
              Seu ID de suporte
            </p>
            <div className="relative rounded-xl border border-secondary/30 bg-muted/30 px-6 py-6 text-center animate-glow-border">
              <span className="text-4xl font-mono font-bold tracking-[0.3em] text-foreground">
                {supportId}
              </span>
            </div>
          </div>

          {/* Main buttons */}
          <div className="px-8 py-2 space-y-3">
            <div className="flex gap-3">
              <Button
                onClick={handleCopy}
                className="flex-1 gap-2 h-12 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/85 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                <Copy className="h-4 w-4" />
                Copiar ID
              </Button>
              <Button
                onClick={() => window.close()}
                className="flex-1 gap-2 h-12 text-sm font-bold bg-destructive text-destructive-foreground hover:bg-destructive/85 shadow-lg shadow-destructive/20"
              >
                <X className="h-4 w-4" />
                Fechar
              </Button>
            </div>
          </div>

          {/* Restart button */}
          <div className="px-8 pt-1 pb-6">
            <button
              onClick={handleRestart}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/40"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reiniciar suporte
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-border/50 bg-muted/20 px-8 py-3">
            <p className="text-center text-[10px] text-muted-foreground/70 tracking-wide">
              Aguarde o atendente para iniciar o suporte
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
