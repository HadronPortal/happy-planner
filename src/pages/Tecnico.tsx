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

export default function TecnicoPage() {
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
    
    // Simulate connection
    setTimeout(() => {
      if (window.hadronTecnicoAPI) {
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
      // Se vier com ID via URL (ex: do Admin ou do Suporte), 
      // iniciamos a conexão automaticamente chamando com o ID da URL
      handleConnect(id);
    }
  }, [searchParams, handleConnect]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        // Clean the ID (remove spaces)
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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `linear-gradient(hsl(var(--secondary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="w-full max-w-3xl relative z-10">
        {/* Main window */}
        <div className="rounded-xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-4">
              <img src={logoSrc} alt="Hádron" className="h-5 object-contain" />
              <div className="h-3 w-px bg-border/40" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Módulo Técnico</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/admin")}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Voltar ao Painel"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
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
          <div className="flex flex-col md:flex-row min-h-[420px]">
            {/* Left panel */}
            <div className="w-full md:w-[260px] border-b md:border-b-0 md:border-r border-border p-5 flex flex-col gap-6">
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                   <Monitor className="h-3.5 w-3.5 text-secondary" /> Módulo Técnico
                </h2>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Insira o ID do cliente abaixo para iniciar o acesso remoto seguro.
                </p>
              </div>

              {/* ID Input Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 border-l-2 border-secondary pl-2">ID Remoto</span>
                  <button onClick={handlePaste} className="text-muted-foreground hover:text-secondary transition-colors" title="Colar ID">
                    <Clipboard className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="relative group">
                   <Input
                    value={remoteId}
                    onChange={(e) => setRemoteId(e.target.value)}
                    placeholder="000 000 000"
                    className="bg-muted/30 border-border/50 font-mono text-lg h-12 text-center focus-visible:ring-secondary/30"
                  />
                  {remoteId && (
                    <button 
                      onClick={() => setRemoteId("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/40 hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 mt-auto">
                <Button 
                  onClick={() => handleConnect()}
                  disabled={status === "connecting" || !remoteId}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-11 gap-2 shadow-lg shadow-secondary/10"
                >
                  <ExternalLink className="h-4 w-4" /> 
                  {status === "connecting" ? "Conectando..." : "Conectar"}
                </Button>
                
                <button
                  onClick={handleFinish}
                  disabled={status === "ready"}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-muted/50 border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 disabled:hover:bg-muted/50 disabled:hover:text-muted-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Finalizar suporte
                </button>
              </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col p-5 bg-card/20">
              {/* Header Right */}
              <div className="flex flex-col items-center gap-1 mb-6 text-center">
                <h3 className="text-sm font-semibold text-foreground">Controle Remoto</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                   <ShieldCheck className="h-3 w-3 text-secondary" /> Conexão Criptografada ponta-a-ponta
                </p>
              </div>

              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-border mb-4">
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

              {/* Empty state / Content Area */}
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-8">
                {status === "connected" ? (
                  <div className="space-y-4">
                    <div className="relative mx-auto h-16 w-16 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center animate-pulse">
                      <Monitor className="h-8 w-8 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Conectado ao ID {remoteId}</p>
                      <p className="text-xs text-muted-foreground">O acesso remoto está ativo.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-full bg-muted/50 p-4">
                      <Frown className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ops, não há sessões recentes!</p>
                      <p className="text-xs text-muted-foreground/70">Hora de planejar uma nova.</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${
                status === "connected" ? "bg-[hsl(var(--status-connected))] shadow-[0_0_8px_hsl(var(--status-connected))]" : 
                status === "connecting" ? "bg-primary animate-pulse" : 
                "bg-muted-foreground/30"
              }`} />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-tight">
                {status === "connected" ? "Sessão Ativa" : 
                 status === "connecting" ? "Estabelecendo conexão..." : 
                 "Aguardando ID"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[9px] text-muted-foreground/40 uppercase font-bold tracking-[0.2em]">
                Hádron Suporte Técnico
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
