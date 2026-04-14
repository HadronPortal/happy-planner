import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Copy, RotateCcw, Search, Clock, Star, Link2, Users, Monitor, LayoutGrid, X, Shield, Plug, ArrowLeft } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSupportClient, type ConnectionStatus } from "@/hooks/useSupportClient";

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; dotClass: string }> = {
  initializing: { label: "Inicializando...", dotClass: "bg-muted-foreground animate-pulse-dot" },
  connecting: { label: "Conectando...", dotClass: "bg-secondary animate-pulse-dot" },
  connected: { label: "Pronto", dotClass: "bg-[hsl(var(--status-connected))]" },
};

export default function Tecnico() {
  const { status, supportId, password, copiarId, refreshPassword } = useSupportClient();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [remoteId, setRemoteId] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setRemoteId(id.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"));
    }
  }, [searchParams]);

  const handleConnect = useCallback(() => {
    if (!remoteId.trim()) {
      toast.error("Nenhum ID remoto detectado");
      return;
    }
    setIsConnecting(true);
    toast.info(`Iniciando conexão com ID ${remoteId}...`);
    setTimeout(() => {
      setIsConnecting(false);
      toast.success("Conexão estabelecida!");
    }, 1500);
  }, [remoteId]);

  const handleFinish = useCallback(() => {
    toast.success("Atendimento finalizado com sucesso");
    navigate("/admin");
  }, [navigate]);

  const { label, dotClass } = STATUS_CONFIG[status];

  const tabs = [
    { icon: Clock, label: "Recentes" },
    { icon: Star, label: "Favoritos" },
    { icon: Link2, label: "Descoberta" },
    { icon: Users, label: "Catálogo" },
    { icon: Monitor, label: "Dispositivos" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 font-sans selection:bg-primary/20">
      <div className="w-full max-w-xl">
        {/* Main window */}
        <div className="rounded-xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden relative">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <img src={logoSrc} alt="Hádron" className="h-5 object-contain" />
              <div className="h-4 w-px bg-border mx-1" />
              <Badge variant="outline" className="border-secondary/50 text-secondary bg-secondary/10 font-bold uppercase tracking-wider text-[10px] px-2 py-0 h-5">
                AMBIENTE TÉCNICO
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <span className="text-xs">☰</span>
              </button>
              <button
                onClick={() => navigate("/admin")}
                className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                title="Voltar ao painel"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col md:flex-row min-h-[420px]">
            {/* Left panel - User Info (The "Technician" module) */}
            <div className="w-full md:w-[260px] border-b md:border-b-0 md:border-r border-border p-5 flex flex-col gap-5 bg-muted/5">
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-0.5">Modulo tecnico</h2>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Identificação da sua estação técnica para este atendimento.
                </p>
              </div>

              {/* Your Technical ID */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground border-l-2 border-secondary pl-2 uppercase tracking-wider">Seu ID</span>
                  <button onClick={copiarId} className="text-muted-foreground hover:text-foreground transition-colors">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-2xl font-bold tracking-[0.2em] text-foreground font-mono pl-2">
                  {supportId}
                </p>
              </div>

              {/* Session Password */}
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground border-l-2 border-secondary pl-2 uppercase tracking-wider">Token de Acesso</span>
                <div className="flex items-center gap-2 pl-2">
                  <span className="text-base font-mono font-semibold text-foreground tracking-wider">{password}</span>
                  <button onClick={refreshPassword} className="text-muted-foreground hover:text-foreground transition-colors">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons - Bottom of panel */}
              <div className="mt-auto flex flex-col gap-2">
                <button
                  onClick={handleFinish}
                  className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Voltar ao painel
                </button>
              </div>
            </div>

            {/* Right panel - Remote Connection Target */}
            <div className="flex-1 flex flex-col p-5 bg-background/50">
              {/* Remote connection display (Pre-filled) */}
              <div className="flex flex-col items-center gap-3 mb-6 pt-0">
                <div className="p-4 rounded-2xl bg-secondary/5 ring-1 ring-secondary/10 mb-2">
                  <Monitor className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">Conexão com Cliente Remoto</h3>
                
                {/* Fixed ID display instead of input */}
                <div className="w-full max-w-[280px] p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col items-center justify-center gap-1 group transition-all hover:border-secondary/30">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ID do Cliente Carregado</span>
                  <p className="text-2xl font-extrabold text-secondary tracking-[0.15em] font-mono">
                    {remoteId || "--- --- ---"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Shield className="h-3 w-3 text-emerald-500/70" />
                    <span className="text-[9px] font-medium text-muted-foreground/70 uppercase">Conexão Criptografada</span>
                  </div>
                </div>

                <Button
                  onClick={handleConnect}
                  disabled={!remoteId}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/85 font-semibold px-8 py-2.5 text-sm rounded-xl transition-all shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plug className="mr-2 h-5 w-5" />
                  Conectar Agora
                </Button>
              </div>

              {/* Tabs UI - Matches Index/Home exactly */}
              <div className="flex items-center justify-between border-b border-border mb-4 px-2">
                <div className="flex gap-1">
                  {tabs.map((tab, i) => (
                    <button
                      key={tab.label}
                      onClick={() => setActiveTab(i)}
                      className={`p-2.5 rounded-t transition-colors ${
                        activeTab === i
                          ? "text-foreground border-b-2 border-secondary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title={tab.label}
                    >
                      <tab.icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Search className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Empty state or Logs */}
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-6 px-4">
                <div className="rounded-full bg-muted/50 p-4">
                  <Clock className="h-8 w-8 text-muted-foreground/60" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Histórico de Sessões</p>
                  <p className="text-[11px] text-muted-foreground/60">As sessões recentes com este cliente aparecerão aqui.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${isConnecting ? "bg-secondary animate-pulse-dot" : dotClass}`} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {isConnecting ? "Negociando conexão..." : label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] text-muted-foreground/40 font-mono uppercase tracking-widest hidden sm:inline">
                H3-TEC-SEC-V2
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
