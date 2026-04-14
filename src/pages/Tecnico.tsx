import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Plug, XCircle, ArrowLeft, Shield, Monitor, X } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Tecnico() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [remoteId, setRemoteId] = useState("");

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      // Remove any non-digits if present to ensure clean state
      setRemoteId(id.replace(/\D/g, ""));
    }
  }, [searchParams]);

  const handleConnect = () => {
    if (!remoteId.trim()) {
      toast.error("Nenhum ID remoto detectado");
      return;
    }
    toast.success(`Iniciando conexão segura com ID ${remoteId}...`);
  };

  const handleFinish = () => {
    toast.success("Atendimento finalizado com sucesso");
    navigate("/admin");
  };

  // Format ID for display (e.g., 000 000 000)
  const formattedId = remoteId.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl">
        {/* Main window - matches Index layout structure */}
        <div className="rounded-xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden relative">
          
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <img src={logoSrc} alt="Hádron" className="h-5 object-contain" />
              <div className="h-4 w-px bg-border mx-1" />
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 font-bold uppercase tracking-wider text-[10px] px-2 py-0 h-5">
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
                title="Fechar"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col md:flex-row min-h-[420px] relative z-10">
            
            {/* Left panel - Info & Fixed ID */}
            <div className="w-full md:w-[280px] border-b md:border-b-0 md:border-r border-border p-6 flex flex-col gap-6 bg-muted/5">
              <div>
                <h2 className="text-sm font-bold text-foreground mb-1 uppercase tracking-tight">
                  HÁDRON SUPORTE TÉCNICO
                </h2>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
                  Conexão remota da equipe técnica para assistência especializada.
                </p>
              </div>

              {/* ID Section - Premium display as requested */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-primary/70" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">ID Remoto Carregado</span>
                </div>
                <div className="p-4 rounded-lg bg-background border border-border/50 shadow-inner group">
                  <p className="text-2xl font-bold tracking-[0.2em] text-primary font-mono text-center">
                    {formattedId || "--- --- ---"}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Sessão Ativa</span>
                </div>
              </div>

              {/* Action Buttons - Bottom of panel */}
              <div className="mt-auto space-y-3">
                <Button
                  onClick={() => navigate("/admin")}
                  variant="outline"
                  className="w-full justify-center gap-2 rounded-lg bg-muted/30 border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Voltar ao painel
                </Button>
              </div>
            </div>

            {/* Right panel - Action Center */}
            <div className="flex-1 flex flex-col p-8 items-center justify-center text-center">
              <div className="mb-8 flex flex-col items-center">
                <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-6 mb-6 ring-1 ring-primary/20 shadow-xl shadow-primary/5 animate-subtle-float">
                  <Monitor className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Conexão Remota</h3>
                <p className="text-xs text-muted-foreground mt-2 max-w-[240px] leading-relaxed">
                  Pronto para estabelecer controle remoto seguro via infraestrutura HÁDRON.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-[280px]">
                <Button
                  onClick={handleConnect}
                  className="h-14 gap-3 bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Plug className="h-5 w-5" />
                  Conectar
                </Button>
                
                <Button
                  onClick={handleFinish}
                  variant="ghost"
                  className="h-12 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive font-semibold text-sm transition-all"
                >
                  <XCircle className="h-4 w-4" />
                  Finalizar suporte
                </Button>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Conexão Segura Ativa
              </span>
            </div>
            <span className="text-[9px] text-muted-foreground/30 font-mono uppercase tracking-tighter">
              H3-SEC-NODE-T1
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
