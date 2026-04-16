import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Copy, RotateCcw, Search, Clock, Star, Link2, Users, Monitor, LayoutGrid, X } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSupportClient, type ConnectionStatus } from "@/hooks/useSupportClient";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    hadronTecnicoAPI?: {
      openRustDesk: (id: string) => void;
      closeWindow: () => void;
    };
  }
}

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
  const [isConnecting] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setRemoteId(id.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"));
    }
  }, [searchParams]);

  const handleConnect = useCallback(async () => {
    const cleanId = remoteId.replace(/\s/g, "");
    if (!cleanId) {
      toast.error("Informe o ID remoto");
      return;
    }

    // Atualiza status para "em_atendimento" no banco
    try {
      const { error } = await supabase
        .from("support_online_clients")
        .update({ 
          status: "em_atendimento", 
          updated_at: new Date().toISOString() 
        })
        .eq("rustdesk_id", cleanId)
        .in("status", ["online", "em_atendimento"]);

      if (error) {
        console.error("Erro ao atualizar status para em_atendimento:", error);
      }
    } catch (err) {
      console.error("Erro inesperado ao conectar:", err);
    }

    if (window.hadronTecnicoAPI) {
      window.hadronTecnicoAPI.openRustDesk(cleanId);
      toast.success("Abrindo conexão remota");
      navigate("/admin");
    } else {
      toast.error("Função disponível apenas no app técnico");
    }
  }, [remoteId, navigate]);

  const handleFinish = useCallback(async () => {
    try {
      const rawId = searchParams.get("id");
      if (rawId) {
        const cleanId = rawId.replace(/\s/g, "");
        
        // Finaliza o atendimento no banco de dados
        const { error } = await supabase
          .from("support_online_clients")
          .update({ 
            status: "finalizado", 
            updated_at: new Date().toISOString() 
          })
          .eq("rustdesk_id", cleanId)
          .in("status", ["online", "em_atendimento"]);

        if (error) {
          console.error("Erro ao finalizar suporte no banco:", error);
          toast.error("Erro ao finalizar no sistema");
        }
      }

      toast.success("Atendimento finalizado com sucesso");
      
      // Fecha a janela se estiver no Electron
      if (window.hadronTecnicoAPI) {
        window.hadronTecnicoAPI.closeWindow();
      }
      
      // Navega para o admin se o app continuar aberto
      navigate("/admin");
    } catch (err) {
      console.error("Erro inesperado:", err);
      toast.error("Ocorreu um erro ao finalizar");
    }
  }, [navigate, searchParams]);

  const { label, dotClass } = STATUS_CONFIG[status];

  const tabs = [
    { icon: Clock, label: "Recentes" },
    { icon: Star, label: "Favoritos" },
    { icon: Link2, label: "Descoberta" },
    { icon: Users, label: "Catálogo" },
    { icon: Monitor, label: "Dispositivos" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl">
        {/* Main window */}
        <div className="rounded-xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden relative">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30 shrink-0">
            <div className="flex items-center gap-3">
              <img src={logoSrc} alt="Hádron" className="h-7 object-contain" />
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
          <div className="flex flex-col md:flex-row h-[480px]">
            {/* Left panel - User Info (The "Technician" module) */}
            <div className="w-full md:w-[280px] border-b md:border-b-0 md:border-r border-border p-5 flex flex-col gap-5 shrink-0">
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
                  disabled={!remoteId}
                  className="flex items-center justify-center gap-2 rounded-lg bg-muted/50 border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-3.5 w-3.5" />
                  Finalizar suporte
                </button>
              </div>
            </div>

            {/* Right panel - Remote Connection Target */}
            <div className="flex-1 flex flex-col p-6 items-center justify-center text-center">
              {/* Remote connection display (Pre-filled) */}
              <div className="flex flex-col items-center gap-4 w-full max-w-md">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">Conexão com Cliente Remoto</h3>
                  <p className="text-sm text-muted-foreground">Estabeleça a conexão com o dispositivo do cliente selecionado.</p>
                </div>
                
                {/* Fixed ID display instead of input */}
                <div className="w-full p-4 rounded-xl border border-border bg-muted/40 flex items-center justify-center shadow-inner">
                  <p className="text-2xl font-bold text-secondary tracking-[0.15em] font-mono">
                    {remoteId || "--- --- ---"}
                  </p>
                </div>

                <div className="flex justify-center w-full">
                  <Button
                    onClick={handleConnect}
                    disabled={!remoteId}
                    className="px-6 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold h-9 text-xs uppercase tracking-wide transition-all shadow-sm"
                  >
                    Conectar agora
                  </Button>
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
