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
    <div className="h-full flex flex-col">
      {/* Body */}
      <div className="flex flex-col flex-1">
        {/* Top Bar (ID and Password) */}
        <div className="w-full border-b border-border/50 p-6 bg-muted/5 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-10">
            <div>
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 opacity-70">Seu ID de Acesso</h2>
              <div className="flex items-center gap-4">
                <p className="text-3xl font-black tracking-[0.15em] text-foreground font-mono">
                  {supportId}
                </p>
                <button onClick={copiarId} className="text-muted-foreground hover:text-secondary transition-all p-2 hover:bg-secondary/10 rounded-lg" title="Copiar ID">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 opacity-70">Senha de Uso Único</h2>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-mono font-bold text-foreground tracking-widest">{password}</span>
                <button onClick={refreshPassword} className="text-muted-foreground hover:text-secondary transition-all p-2 hover:bg-secondary/10 rounded-lg" title="Nova senha">
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={reiniciar}
            className="flex items-center justify-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 px-5 py-3 text-xs font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all shadow-lg shadow-destructive/10"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            FINALIZAR SUPORTE
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-8 lg:p-12">
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-10 py-4 max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full scale-150 animate-pulse-subtle" />
              <div className="relative rounded-3xl bg-card border border-border/50 p-10 text-secondary shadow-2xl">
                <Monitor className="h-20 w-20" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-foreground tracking-tight">Aguardando Técnico</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Informe o seu <span className="text-secondary font-bold">ID</span> e <span className="text-secondary font-bold">Senha</span> acima para que o suporte técnico possa iniciar a conexão remota com segurança.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm">
                <Shield className="h-5 w-5 text-secondary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Criptografia de Ponta a Ponta</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm">
                <Lock className="h-5 w-5 text-secondary" />
                <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Sessão Restrita e Segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border/30 bg-muted/10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${attendingTechnician ? "bg-[hsl(var(--status-connected))]" : dotClass}`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${attendingTechnician ? "bg-[hsl(var(--status-connected))]" : dotClass}`} />
          </div>
          <span className="text-xs font-bold text-muted-foreground tracking-wide uppercase">
            STATUS: {attendingTechnician ? "EM ATENDIMENTO" : label.toUpperCase()}
          </span>
        </div>
        {attendingTechnician && (
          <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20">
            <Users className="h-3.5 w-3.5 text-secondary" />
            <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">
              Técnico: {attendingTechnician}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
