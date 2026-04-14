import { useCallback } from "react";
import { Copy, RotateCcw, X, ShieldCheck, HelpCircle, Activity } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { useSupportClient, type ConnectionStatus } from "@/hooks/useSupportClient";

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; dotClass: string }> = {
  initializing: { label: "Inicializando...", dotClass: "bg-muted-foreground animate-pulse-dot" },
  connecting: { label: "Conectando...", dotClass: "bg-primary animate-pulse-dot" },
  connected: { label: "Pronto para conexão", dotClass: "bg-[hsl(var(--status-connected))]" },
};

export default function HadronSuporte() {
  const { status, supportId, password, copiarId, refreshPassword, reiniciar, fechar } = useSupportClient();

  const { label, dotClass } = STATUS_CONFIG[status];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        {/* Main window */}
        <div className="rounded-xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
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
          <div className="flex flex-col md:flex-row h-[480px]">
            {/* Left panel */}
            <div className="w-full md:w-[280px] border-b md:border-b-0 md:border-r border-border p-5 flex flex-col gap-5">
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-0.5">Seu Computador</h2>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Seu computador pode ser acessado com este ID e senha.
                </p>
              </div>

              {/* ID */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground border-l-2 border-secondary pl-2">ID</span>
                  <button onClick={copiarId} className="text-muted-foreground hover:text-foreground transition-colors">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-2xl font-bold tracking-[0.2em] text-foreground font-mono pl-2">
                  {supportId}
                </p>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground border-l-2 border-secondary pl-2">Senha de uso único</span>
                <div className="flex items-center gap-2 pl-2">
                  <span className="text-base font-mono font-semibold text-foreground tracking-wider">{password}</span>
                  <button onClick={refreshPassword} className="text-muted-foreground hover:text-foreground transition-colors">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-auto flex justify-center pb-2">
                <img src={logoSrc} alt="Hádron" className="h-6 object-contain opacity-40 grayscale hover:opacity-80 transition-opacity" />
              </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/5">
              <div className="max-w-sm w-full text-center space-y-8">
                <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                  <div className="relative rounded-full bg-card border border-border p-6 shadow-xl">
                    <ShieldCheck className="h-12 w-12 text-primary" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-foreground">Aguardando Técnico</h3>
                  <p className="text-sm text-muted-foreground px-4">
                    Informe o ID e a Senha para que o técnico possa iniciar o atendimento remoto com segurança.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-4">
                  <button
                    onClick={fechar}
                    className="flex items-center justify-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-xs font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                    Finalizar Suporte
                  </button>
                  
                  <button
                    onClick={reiniciar}
                    className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 border border-border px-4 py-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reiniciar Conexão
                  </button>
                </div>
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
