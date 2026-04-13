import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  Copy, 
  RotateCcw, 
  Search, 
  Clock, 
  Star, 
  Link2, 
  Users, 
  Monitor, 
  LayoutGrid, 
  Frown, 
  X, 
  Clipboard, 
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  Power
} from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/**
 * Módulo Técnico - Página Real
 * Esta é uma página física (src/pages/Tecnico.tsx) com rota própria (/tecnico).
 * Identidade visual premium, fundo escuro e visual tecnológico.
 */
export default function Tecnico() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [remoteId, setRemoteId] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [status, setStatus] = useState<"ready" | "connecting" | "connected">("ready");

  const handleConnect = useCallback((idToConnect?: string) => {
    const targetId = idToConnect || remoteId;
    if (!targetId.trim()) {
      toast.error("Informe o ID Remoto");
      return;
    }
    
    setStatus("connecting");
    toast.info(`Iniciando conexão com ${targetId}...`);
    
    // Simulação de conexão / Integração com RustDesk
    setTimeout(() => {
      // No ambiente Electron, isso chamaria a API nativa
      // @ts-ignore
      if (window.hadronTecnicoAPI) {
        // @ts-ignore
        window.hadronTecnicoAPI.openRustDesk(targetId);
      }
      setStatus("connected");
      toast.success("Conexão estabelecida com sucesso");
    }, 1500);
  }, [remoteId]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      // Remove espaços se existirem
      setRemoteId(id.replace(/\s/g, ""));
    }
  }, [searchParams]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const cleanText = text.replace(/\s/g, "");
        setRemoteId(cleanText);
        toast.success("ID colado");
      }
    } catch (err) {
      toast.error("Erro ao acessar área de transferência");
    }
  };

  const handleFinish = () => {
    setStatus("ready");
    toast.info("Atendimento finalizado");
  };

  const tabs = [
    { icon: Clock, label: "Recentes" },
    { icon: Star, label: "Favoritos" },
    { icon: Link2, label: "Descoberta" },
    { icon: Users, label: "Catálogo" },
    { icon: Monitor, label: "Dispositivos" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-foreground flex items-center justify-center p-4">
      {/* Background Decorativo Premium */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `linear-gradient(hsl(var(--secondary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 w-full max-w-5xl space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Hádron" className="h-8 object-contain" />
            <div className="h-4 w-px bg-border/40 mx-1" />
            <h1 className="text-sm font-bold tracking-wider uppercase text-muted-foreground/80">Módulo Técnico</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin")}
            className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground gap-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao Admin
          </Button>
        </div>

        {/* Main Interface Window */}
        <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Header/Title Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_hsl(var(--secondary))]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Console de Suporte Hádron</span>
            </div>
            <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
              status === "connected" ? "bg-secondary/20 text-secondary" : "bg-muted/30 text-muted-foreground"
            }`}>
              {status === "connected" ? "Sessão Ativa" : "Pronto para Conexão"}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-border/40">
            {/* Control Panel (Left) */}
            <div className="w-full lg:w-[320px] p-6 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ID do Cliente</label>
                  <button onClick={handlePaste} className="text-[9px] font-bold uppercase text-secondary hover:underline transition-all">
                    Colar da área de transferência
                  </button>
                </div>
                <div className="relative">
                  <Input
                    value={remoteId}
                    onChange={(e) => setRemoteId(e.target.value)}
                    placeholder="000 000 000"
                    className="h-14 bg-background/50 border-border/50 font-mono text-xl text-center focus:ring-secondary/30 rounded-xl"
                  />
                  {remoteId && (
                    <button onClick={() => setRemoteId("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/40 hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => handleConnect()}
                  disabled={status === "connecting" || !remoteId}
                  className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold rounded-xl gap-2 shadow-lg shadow-secondary/10"
                >
                  {status === "connecting" ? (
                    <RotateCcw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                  {status === "connecting" ? "CONECTANDO..." : "INICIAR CONEXÃO"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleFinish}
                  disabled={status === "ready"}
                  className="w-full h-12 border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 font-bold rounded-xl transition-all"
                >
                  FINALIZAR SESSÃO
                </Button>
              </div>

              <div className="pt-4 border-t border-border/30">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/30">
                  <ShieldCheck className="h-5 w-5 text-secondary shrink-0" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-foreground/80">Segurança Ativa</p>
                    <p className="text-[9px] text-muted-foreground leading-relaxed">Conexão criptografada ponta-a-ponta via RustDesk Engine.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Area (Right) */}
            <div className="flex-1 p-6 flex flex-col min-h-[450px]">
              {/* Tabs Navigation */}
              <div className="flex items-center justify-between border-b border-border/40 mb-6">
                <div className="flex gap-4">
                  {tabs.map((tab, i) => (
                    <button
                      key={tab.label}
                      onClick={() => setActiveTab(i)}
                      className={`pb-3 relative text-[10px] font-bold uppercase tracking-wider transition-all ${
                        activeTab === i ? "text-secondary" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <tab.icon className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </div>
                      {activeTab === i && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary shadow-[0_0_8px_hsl(var(--secondary))]" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pb-3">
                  <button className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground transition-all">
                    <Search className="h-4 w-4" />
                  </button>
                  <button className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground transition-all">
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Main Content View */}
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border/20 rounded-2xl bg-muted/5">
                {status === "connected" ? (
                  <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-secondary/20 blur-2xl rounded-full animate-pulse" />
                      <div className="relative h-20 w-20 rounded-3xl bg-secondary/10 border border-secondary/30 flex items-center justify-center">
                        <Monitor className="h-10 w-10 text-secondary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Conectado ao Dispositivo</h3>
                      <p className="text-secondary font-mono text-xl mt-1">{remoteId}</p>
                      <p className="text-xs text-muted-foreground mt-4 max-w-[240px] mx-auto">
                        O controle remoto está ativo. Todas as ações realizadas refletirão no terminal do cliente.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 opacity-40">
                    <div className="mx-auto h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
                      <Frown className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest">Sem conexões ativas</p>
                      <p className="text-[10px] mt-1">Insira um ID remoto para iniciar o atendimento</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/30 font-medium uppercase tracking-[0.3em]">
          Hádron Suporte Técnico — Powered by Procion v2.5.0
        </p>
      </div>
    </div>
  );
}
