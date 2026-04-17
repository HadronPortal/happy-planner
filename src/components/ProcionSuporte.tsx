import { useCallback } from "react";
import { Copy, RotateCcw, X, HelpCircle, Activity } from "lucide-react";
import techAvatarSrc from "@/assets/technician-avatar.png";
import logoSrc from "@/assets/logo.png";
import securityLogo from "@/assets/procion-logo.png";
import { useSupportClient, type ConnectionStatus } from "@/hooks/useSupportClient";

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; dotClass: string }> = {
  initializing: { label: "Inicializando...", dotClass: "bg-muted-foreground animate-pulse-dot" },
  connecting: { label: "Conectando...", dotClass: "bg-primary animate-pulse-dot" },
  connected: { label: "Pronto para conexão", dotClass: "bg-[hsl(var(--status-connected))]" },
};

export default function HadronSuporte() {
  const { status, supportId, password, hostname, copiarId, refreshPassword, reiniciar, fechar } = useSupportClient();

  const { label, dotClass } = STATUS_CONFIG[status];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        {/* Main window */}
        <div className="rounded-xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <img src={securityLogo} alt="Procion" className="h-7 object-contain" />
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <span className="text-xs">☰</span>
              </button>
              <button
                onClick={fechar}
                className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                title="Fechar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col items-center justify-center px-6 py-12 md:py-16 min-h-[480px]">
            <div className="w-full max-w-xl flex flex-col items-center text-center space-y-8">
              {/* Hostname */}
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                  {hostname}
                </p>
              </div>

              {/* ID em destaque */}
              <div className="w-full space-y-5">
                <p className="text-sm text-muted-foreground">
                  Informe este código ao técnico
                </p>

                <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/10 to-primary/5 px-8 py-8 shadow-lg shadow-primary/10">
                  <p className="text-5xl md:text-6xl font-extrabold tracking-[0.18em] text-foreground font-mono leading-none">
                    {supportId}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Envie este código ao suporte para iniciar o atendimento remoto.
                </p>
              </div>

              {/* Senha discreta */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="uppercase tracking-wider">Senha</span>
                <span className="font-mono font-semibold text-foreground tracking-wider text-sm">{password}</span>
                <button
                  onClick={refreshPassword}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  title="Gerar nova senha"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>

              {/* Ações */}
              <div className="w-full max-w-xs flex flex-col gap-2 pt-2">
                <button
                  onClick={copiarId}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-3 text-sm font-semibold shadow-md shadow-primary/20"
                >
                  <Copy className="h-4 w-4" />
                  Copiar ID
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={reiniciar}
                    className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reiniciar
                  </button>
                  <button
                    onClick={fechar}
                    className="flex items-center justify-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                  >
                    <X className="h-3.5 w-3.5" />
                    Finalizar
                  </button>
                </div>
              </div>

              {/* Logo */}
              <div className="pt-4">
                <img src={logoSrc} alt="Hádron" className="h-10 object-contain opacity-80" />
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${dotClass}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
