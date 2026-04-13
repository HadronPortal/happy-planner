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
  ShieldCheck
} from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

/**
 * Módulo Técnico - Página de Acesso Remoto
 * Esta página é uma rota real (/tecnico) e não depende do estado do Admin.
 * Lê o parâmetro 'id' da URL para preenchimento automático.
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
    
    // Simulate connection / Call RustDesk API
    setTimeout(() => {
      // @ts-ignore - Check for Electron API
      if (window.hadronTecnicoAPI) {
        // @ts-ignore
        window.hadronTecnicoAPI.openRustDesk(targetId);
      }
      setStatus("connected");
      toast.success("Conexão estabelecida via RustDesk");
    }, 1500);
  }, [remoteId]);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setRemoteId(id);
      // Opcional: auto-conectar se vier um ID via URL
      // handleConnect(id); 
    }
  }, [searchParams]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        // Limpa o ID (remove espaços)
        const cleanText = text.replace(/\s/g, "");
        setRemoteId(cleanText);
        toast.success("ID colado com sucesso");
      }
    } catch (err) {
      toast.error("Não foi possível acessar a área de transferência");
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Decorativo */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `linear-gradient(hsl(var(--secondary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={logoSrc} alt="Hádron" className="h-10 object-contain" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">Módulo Técnico Premium</h1>
              <p className="text-xs text-muted-foreground">Controle remoto e gerenciamento de sessões</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin")}
              className="h-8 gap-2 text-[10px] font-bold uppercase tracking-wider border-border/40 hover:bg-muted/50 transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Painel Admin
            </Button>
            <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${
              status === "connected" 
                ? "border-[hsl(var(--status-connected))]/30 bg-[hsl(var(--status-connected))]/10 text-[hsl(var(--status-connected))]" 
                : "border-border/30 bg-muted/30 text-muted-foreground"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                status === "connected" ? "bg-[hsl(var(--status-connected))]" : "bg-muted-foreground/50"
              }`} />
              {status === "connected" ? "Sessão Ativa" : "Sistema Pronto"}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Control Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 shadow-sm space-y-8">
              <div className="space-y-2">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-secondary" /> Controle Remoto
                </h2>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Gerencie conexões seguras de alta performance com clientes Hádron.
                </p>
              </div>

              {/* ID Input Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-0.5 bg-secondary rounded-full" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">ID do Dispositivo</span>
                  </div>
                  <button 
                    onClick={handlePaste} 
                    className="text-[10px] flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all font-bold uppercase"
                  >
                    <Clipboard className="h-3 w-3" /> Colar
                  </button>
                </div>

                <div className="relative group">
                  <Input
                    value={remoteId}
                    onChange={(e) => setRemoteId(e.target.value)}
                    placeholder="000 000 000"
                    className="bg-background/50 border-border/50 font-mono text-xl h-14 text-center focus-visible:ring-secondary/30 rounded-xl transition-all group-hover:border-secondary/30"
                  />
                  {remoteId && (
                    <button 
                      onClick={() => setRemoteId("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground/40 hover:text-foreground transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button 
                  onClick={() => handleConnect()}
                  disabled={status === "connecting" || !remoteId}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-12 gap-3 shadow-xl shadow-secondary/20 rounded-xl transition-all active:scale-[0.98]"
                >
                  {status === "connecting" ? (
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4 animate-spin" />
                      <span>CONECTANDO...</span>
                    </div>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4" /> 
                      <span>CONECTAR</span>
                    </>
                  )}
                </Button>
                
                <button
                  onClick={handleFinish}
                  disabled={status === "ready"}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-muted/40 border border-border/40 px-4 py-3 text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  FINALIZAR SESSÃO
                </button>
              </div>
            </div>

            {/* Connection Info Card */}
            <div className="rounded-xl border border-border/40 bg-muted/10 p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider">Conexão Segura</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Criptografia ponta-a-ponta ativa para todas as sessões.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Workspace */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl p-6 shadow-sm min-h-[500px] flex flex-col">
              
              {/* Header Info */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Sessões Recentes</h3>
                  <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest mt-1">Histórico de acessos do técnico</p>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex items-center justify-between border-b border-border/40 mb-6 overflow-x-auto">
                <div className="flex gap-2 min-w-max">
                  {tabs.map((tab, i) => (
                    <button
                      key={tab.label}
                      onClick={() => setActiveTab(i)}
                      className={`pb-3 px-3 relative transition-all text-xs font-bold uppercase tracking-wider ${
                        activeTab === i
                          ? "text-secondary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <tab.icon className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </div>
                      {activeTab === i && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-secondary rounded-full shadow-[0_-2px_8px_hsl(var(--secondary))]" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pb-3 ml-4">
                  <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all">
                    <Search className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all">
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-10 rounded-2xl border border-dashed border-border/40 bg-muted/5">
                {status === "connected" ? (
                  <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="relative mx-auto">
                      <div className="absolute inset-0 bg-secondary/20 blur-2xl rounded-full animate-pulse" />
                      <div className="relative h-20 w-20 rounded-3xl bg-secondary/20 border-2 border-secondary/30 flex items-center justify-center">
                        <Monitor className="h-10 w-10 text-secondary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground">Sessão em Curso</h4>
                      <p className="text-sm text-secondary font-mono mt-1">{remoteId}</p>
                      <p className="text-xs text-muted-foreground mt-2 max-w-[200px] mx-auto">Você está controlando este dispositivo remotamente.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 opacity-40">
                    <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <Frown className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-muted-foreground">Sem conexões ativas</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Aguardando inserção de ID remoto</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40 pt-4">
          © {new Date().getFullYear()} Hádron Suporte — Painel do Técnico v2.0
        </p>
      </div>
    </div>
  );
}