import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Copy, Plug, XCircle, ArrowLeft, Shield } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Tecnico() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [remoteId, setRemoteId] = useState("");

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setRemoteId(id);
      toast.success("ID remoto carregado automaticamente");
    }
  }, [searchParams]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setRemoteId(text.replace(/\s/g, ""));
        toast.success("ID colado com sucesso");
      }
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível colar o ID");
    }
  };

  const handleConnect = () => {
    if (!remoteId.trim()) {
      toast.error("Informe o ID remoto");
      return;
    }

    toast.success(`Abrindo conexão para o ID ${remoteId}`);
  };

  const handleFinish = () => {
    toast.success("Atendimento finalizado");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="rounded-xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-border bg-muted/30 gap-4">
            <div className="flex items-center gap-4">
              <img src={logoSrc} alt="Hádron" className="h-8 object-contain" />
              <div className="h-6 w-px bg-border hidden sm:block" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm font-bold tracking-[0.2em] uppercase text-foreground">
                  HÁDRON SUPORTE TÉCNICO
                </span>
                <Badge variant="outline" className="w-fit border-primary/50 text-primary bg-primary/10 font-bold uppercase tracking-wider text-[10px]">
                  Ambiente Técnico
                </Badge>
              </div>
            </div>

            <Button
              onClick={() => navigate("/admin")}
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao painel
            </Button>
          </div>

          <div className="flex flex-col md:flex-row min-h-[550px]">
            {/* Sidebar Controls */}
            <div className="w-full md:w-[350px] border-b md:border-b-0 md:border-r border-border p-8 flex flex-col gap-8 bg-muted/10">
              <div>
                <h2 className="text-xl font-bold text-foreground">Conexão Remota</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Atendimento remoto da equipe técnica
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  ID Remoto
                  <Shield className="h-3 w-3 text-primary/70" />
                </label>
                <Input
                  value={remoteId}
                  onChange={(e) => setRemoteId(e.target.value)}
                  placeholder="000 000 000"
                  className="h-14 text-center text-2xl font-mono tracking-[0.2em] bg-background border-border focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-3 mt-auto pt-8">
                <Button
                  onClick={handlePaste}
                  variant="secondary"
                  className="h-12 gap-2 font-medium"
                >
                  <Copy className="h-4 w-4" />
                  Colar ID
                </Button>

                <Button
                  onClick={handleConnect}
                  className="h-12 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                >
                  <Plug className="h-4 w-4" />
                  Conectar
                </Button>

                <div className="h-px bg-border my-2" />

                <Button
                  onClick={handleFinish}
                  variant="outline"
                  className="h-12 gap-2 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <XCircle className="h-4 w-4" />
                  Finalizar suporte
                </Button>
              </div>
            </div>

            {/* Main Display Area */}
            <div className="flex-1 p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Background decorative element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-8 mb-8 ring-1 ring-primary/20">
                  <Plug className="h-12 w-12 text-primary animate-pulse" />
                </div>

                <h3 className="text-3xl font-bold mb-3 tracking-tight">Console de Suporte</h3>
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-12 flex items-center justify-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Sessão Protegida de Alta Disponibilidade
                </p>

                {remoteId ? (
                  <div className="space-y-4 p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm max-w-md mx-auto">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Status do Cliente</p>
                      <p className="text-3xl font-mono font-bold text-primary">
                        {remoteId.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")}
                      </p>
                    </div>
                    <div className="h-px bg-border w-1/2 mx-auto" />
                    <p className="text-muted-foreground text-sm">
                      Pronto para estabelecer controle remoto seguro via infraestrutura HÁDRON.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-sm mx-auto">
                    <p className="text-2xl font-semibold text-foreground/80">
                      Aguardando Parâmetros
                    </p>
                    <p className="text-muted-foreground">
                      Insira o ID de suporte fornecido pelo cliente para iniciar o procedimento de assistência técnica.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Status */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Módulo Técnico Online
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground/50 font-mono">
              H3-SEC-SRV-01
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
