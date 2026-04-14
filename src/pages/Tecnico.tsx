import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Copy, Play, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
// PageHeader removed to use layout header
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Tecnico = () => {
  const [searchParams] = useSearchParams();
  const [remoteId, setRemoteId] = useState("");

  useEffect(() => {
    const idParam = searchParams.get("id");
    if (idParam) {
      setRemoteId(idParam);
    }
  }, [searchParams]);

  const handlePasteId = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setRemoteId(text.trim());
        toast.success("ID colado com sucesso");
      }
    } catch (err) {
      toast.error("Erro ao acessar área de transferência");
    }
  }, []);

  const handleConnect = useCallback(() => {
    if (!remoteId.trim()) {
      toast.error("Informe o ID Remoto antes de conectar");
      return;
    }
    toast.info("Abrindo conexão remota");
  }, [remoteId]);

  const handleFinish = useCallback(() => {
    toast.error("Atendimento finalizado", {
      style: {
        background: "rgba(239, 68, 68, 0.1)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        color: "#ef4444"
      }
    });
  }, []);

  // fechar removed since it was in PageHeader which is now in layout

  return (
    <div className="h-full flex flex-col p-8 lg:p-12">
      <div className="flex-1 flex flex-col items-center justify-center text-center gap-12 py-4 max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-secondary/20 blur-2xl rounded-full scale-125" />
            <h2 className="relative text-4xl font-black tracking-tight text-foreground uppercase">Conexão Remota</h2>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Insira o ID remoto do cliente para iniciar o atendimento técnico assistido com controle de tela seguro.
          </p>
        </div>

        <div className="w-full max-w-md space-y-10">
          {/* ID Remoto Section */}
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Identificador Remoto</span>
              <button 
                onClick={handlePasteId}
                className="flex items-center gap-2 text-xs text-secondary hover:text-secondary/80 transition-all font-bold px-3 py-1.5 rounded-lg hover:bg-secondary/10"
              >
                <Copy className="h-4 w-4" />
                COLAR ID
              </button>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary/20 to-secondary/5 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <Input
                value={remoteId}
                onChange={(e) => setRemoteId(e.target.value)}
                placeholder="000 000 000"
                className="relative h-24 text-4xl font-black text-center tracking-[0.2em] bg-card border-border/50 border-2 focus-visible:ring-secondary focus-visible:border-secondary transition-all font-mono rounded-2xl shadow-xl"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4 pt-4">
            <Button
              onClick={handleConnect}
              size="lg"
              className="h-16 text-xl font-black bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-2xl shadow-secondary/20 group transition-all rounded-2xl uppercase tracking-widest"
            >
              <Play className="mr-3 h-6 w-6 fill-current transition-transform group-hover:scale-125" />
              Iniciar Conexão
            </Button>
            
            <Button
              onClick={handleFinish}
              variant="outline"
              size="lg"
              className="h-12 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive transition-all font-bold uppercase tracking-widest text-[10px] rounded-xl"
            >
              <Power className="mr-2 h-4 w-4" />
              Finalizar Atendimento
            </Button>
          </div>
        </div>

        {/* Hint */}
        <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest pt-10">
          Hádron Suporte Corporativo • Versão 2.5.0
        </p>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border/30 bg-muted/10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--status-connected))] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[hsl(var(--status-connected))]" />
          </div>
          <span className="text-xs font-bold text-muted-foreground tracking-wide uppercase">
            SISTEMA: TÉCNICO ONLINE
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-40">
          Ready for session
        </div>
      </div>
    </div>
  );
};

export default Tecnico;
