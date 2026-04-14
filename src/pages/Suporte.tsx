import { useCallback, useState } from "react";
import { Copy, RotateCcw, Monitor, Shield, Lock, Users } from "lucide-react";
import { useSupportClient, type ConnectionStatus } from "@/hooks/useSupportClient";

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; dotClass: string }> = {
  initializing: { label: "Inicializando...", dotClass: "bg-muted-foreground animate-pulse-dot" },
  connecting: { label: "Conectando...", dotClass: "bg-primary animate-pulse-dot" },
  connected: { label: "Pronto", dotClass: "bg-[hsl(var(--status-connected))]" },
};

export default function Suporte() {
  const { status, supportId, password, copiarId, refreshPassword, reiniciar: originalReiniciar } = useSupportClient();
  const [attendingTechnician, setAttendingTechnician] = useState<string | null>(null);

  const reiniciar = useCallback(() => {
    setAttendingTechnician(null);
    originalReiniciar();
  }, [originalReiniciar]);

  const { label, dotClass } = STATUS_CONFIG[status];

  return (
    <div className="flex h-full items-start justify-center p-2 md:p-4">
      <div className="w-full max-w-3xl">
        {/* Main window */}
        <div className="rounded-xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden">
          {/* Body */}
          <div className="flex flex-col min-h-[420px]">
            {/* Top Bar (ID and Password) */}
            <div className="w-full border-b border-border p-4 bg-muted/20 flex flex-wrap items-center justify-between gap-6">
              <div className="flex flex-wrap items-center gap-8">
                <div>
                  <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Seu ID</h2>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-bold tracking-[0.2em] text-foreground font-mono">
                      {supportId}
                    </p>
                    <button onClick={copiarId} className="text-muted-foreground hover:text-foreground transition-colors" title="Copiar ID">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Senha de uso único</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-mono font-semibold text-foreground tracking-wider">{password}</span>
                    <button onClick={refreshPassword} className="text-muted-foreground hover:text-foreground transition-colors" title="Nova senha">
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={reiniciar}
                className="flex items-center justify-center gap-2 rounded-lg bg-background border border-border px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-sm"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Finalizar suporte
              </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col p-8 bg-muted/5">
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-8 py-4">
                <div className="rounded-full bg-secondary/10 p-8 text-secondary animate-pulse-subtle">
                  <Monitor className="h-16 w-16" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Aguardando Suporte Técnico</h3>
                  <p className="text-base text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Por favor, informe seu <span className="text-foreground font-semibold">ID</span> e <span className="text-foreground font-semibold">Senha</span> para o técnico responsável iniciar a conexão.
                  </p>
                </div>
                <div className="flex flex-row gap-4 w-full max-w-md justify-center">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-sm">
                    <Shield className="h-4 w-4 text-secondary" />
                    <span className="text-[11px] font-medium uppercase tracking-wider">Sessão Criptografada</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-sm">
                    <Lock className="h-4 w-4 text-secondary" />
                    <span className="text-[11px] font-medium uppercase tracking-wider">Conexão Segura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${attendingTechnician ? "bg-[hsl(var(--status-connected))]" : dotClass}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {attendingTechnician ? "Em atendimento" : label}
              </span>
            </div>
            {attendingTechnician && (
              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                <Users className="h-3 w-3" />
                Técnico: {attendingTechnician}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
