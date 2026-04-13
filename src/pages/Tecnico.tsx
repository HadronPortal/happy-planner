import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Copy, Play, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
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

  const fechar = () => {
    window.close();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-xl">
        {/* Main window */}
        <div className="rounded-xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <img src={logoSrc} alt="Hádron" className="h-5 object-contain" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-2 py-0.5 rounded bg-muted border border-border">
                Painel do Técnico
              </span>
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
          <div className="p-8 flex flex-col items-center gap-8 min-h-[400px] justify-center text-center">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Conexão de Suporte</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Insira o ID remoto do cliente para iniciar o atendimento técnico assistido.
              </p>
            </div>

            <div className="w-full max-w-sm space-y-6">
              {/* ID Remoto Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID Remoto</span>
                  <button 
                    onClick={handlePasteId}
                    className="flex items-center gap-1.5 text-xs text-secondary hover:text-secondary/80 transition-colors font-semibold"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Colar ID
                  </button>
                </div>
                
                <div className="relative group">
                  <Input
                    value={remoteId}
                    onChange={(e) => setRemoteId(e.target.value)}
                    placeholder="000 000 000"
                    className="h-20 text-3xl font-bold text-center tracking-[0.15em] bg-muted/40 border-border border-2 focus-visible:ring-secondary focus-visible:border-secondary transition-all font-mono"
                  />
                  <div className="absolute inset-0 rounded-md bg-secondary/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-3 pt-4">
                <Button
                  onClick={handleConnect}
                  size="lg"
                  className="h-14 text-lg font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-lg shadow-secondary/20 group transition-all"
                >
                  <Play className="mr-2 h-5 w-5 fill-current transition-transform group-hover:scale-110" />
                  Conectar
                </Button>
                
                <Button
                  onClick={handleFinish}
                  variant="outline"
                  size="lg"
                  className="h-12 border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-colors font-bold uppercase tracking-wider text-xs"
                >
                  <Power className="mr-2 h-4 w-4" />
                  Finalizar Atendimento
                </Button>
              </div>
            </div>

            {/* Hint */}
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-tighter">
              Sistema de Suporte Técnico Hádron • Versão Premium
            </p>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[hsl(var(--status-connected))] animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground">
                Técnico Online
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground font-mono">
              Ready for session
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tecnico;
