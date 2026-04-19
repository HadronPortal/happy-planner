import { Copy, RotateCcw, X, Pencil, History, Trash2 } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import securityLogo from "@/assets/procion-logo.png";
import { useSupportClient, type ConnectionStatus } from "@/hooks/useSupportClient";
import { useClientAccessHistory, formatAccessDate, getAccessTitle } from "@/hooks/useClientAccessHistory";

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; dotClass: string }> = {
  initializing: { label: "Inicializando...", dotClass: "bg-muted-foreground animate-pulse-dot" },
  connecting: { label: "Conectando...", dotClass: "bg-primary animate-pulse-dot" },
  connected: { label: "Pronto", dotClass: "bg-[hsl(var(--status-connected))]" },
};

function formatId(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }
  return digits;
}

export default function HadronSuporte() {
  const { status, supportId, password, hostname, copiarId, refreshPassword, reiniciar, fechar } = useSupportClient();
  const { history, hideEntry } = useClientAccessHistory();

  const { label, dotClass } = STATUS_CONFIG[status];
  const displayId = formatId(supportId);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl">
        {/* Main window */}
        <div className="rounded-xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden relative">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30 shrink-0">
            <div className="flex items-center gap-2">
              <img src={logoSrc} alt="Hádron Suporte" className="h-7 object-contain" />
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
          <div className="flex flex-col md:flex-row min-h-[480px] max-h-[480px]">
            {/* Left panel */}
            <aside className="w-full md:w-[280px] border-b md:border-b-0 md:border-r border-border p-5 flex flex-col gap-5 shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-0.5">Seu Computador</h2>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Seu computador pode ser acessado com este ID e senha.
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground border-l-2 border-primary pl-2 uppercase tracking-wider block">
                  Senha de uso único
                </span>
                <div className="flex items-center gap-2 pl-2">
                  <span className="text-base font-mono font-semibold text-foreground tracking-wider">{password}</span>
                  <button
                    onClick={refreshPassword}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Gerar nova senha"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    title="Editar senha"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 items-center">
                <img src={logoSrc} alt="Hádron Suporte" className="h-10 object-contain opacity-90" />
              </div>
            </aside>

            {/* Right panel */}
            <div className="flex-1 flex flex-col p-6 gap-5">
              <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-semibold text-foreground">Informe este código ao técnico</h3>
                  <p className="text-xs text-muted-foreground">Envie este ID ao suporte para iniciar o atendimento remoto.</p>
                </div>

                <div className="w-full px-4 py-3 rounded-xl border border-primary/30 bg-gradient-to-b from-primary/10 to-primary/5 text-center shadow-inner">
                  <p className="text-xl font-bold tracking-[0.2em] text-foreground font-mono leading-none min-h-[1.25rem]">
                    {displayId}
                  </p>
                </div>

                <div className="w-full grid grid-cols-2 gap-2">
                  <button
                    onClick={copiarId}
                    disabled={!displayId}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-2.5 text-sm font-semibold shadow-md shadow-primary/20 disabled:opacity-50"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar ID
                  </button>
                  <button
                    onClick={reiniciar}
                    className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 border border-border px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reiniciar
                  </button>
                </div>
              </div>

              {/* Últimos acessos - informativo, sem ações */}
              <div className="w-full mt-2 flex flex-col min-h-0">
                <div className="flex items-center gap-2 mb-2">
                  <History className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Últimos acessos
                  </span>
                  {history.length > 0 && (
                    <span className="text-[10px] text-muted-foreground/60">({history.length})</span>
                  )}
                </div>

                {history.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground/60 italic px-1 py-2">
                    Nenhum acesso recente
                  </p>
                ) : (
                  <div className="overflow-y-auto max-h-[180px] pr-1 scrollbar-themed">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {history.map((item) => (
                        <div
                          key={item.id}
                          className="group relative rounded-xl border border-border bg-muted/20 p-3 flex flex-col gap-1.5 select-none"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="h-2 w-2 rounded-full bg-primary/60 shrink-0" />
                            <span className="text-xs font-semibold text-foreground truncate flex-1">
                              {getAccessTitle(item)}
                            </span>
                            <button
                              onClick={() => hideEntry(item.id)}
                              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                              title="Ocultar este acesso"
                              aria-label="Ocultar este acesso"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="text-[11px] font-mono text-muted-foreground tracking-wide">
                            {formatAccessDate(item.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${dotClass}`} />
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
