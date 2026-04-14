import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Copy, Plug, XCircle, ArrowLeft } from "lucide-react";
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
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao painel
            </Button>
          </div>

          <div className="flex flex-col md:flex-row min-h-[520px]">
            <div className="w-full md:w-[320px] border-b md:border-b-0 md:border-r border-border p-6 flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">Módulo Técnico</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Insira o ID do cliente abaixo para iniciar o acesso remoto seguro.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  ID Remoto
                </label>
                <Input
                  value={remoteId}
                  onChange={(e) => setRemoteId(e.target.value)}
                  placeholder="Digite ou cole o ID remoto"
                  className="h-14 text-center text-2xl font-mono tracking-[0.2em] bg-muted/30 border-border"
                />
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                <Button
                  onClick={handlePaste}
                  variant="outline"
                  className="h-12 gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Colar ID
                </Button>

                <Button
                  onClick={handleConnect}
                  className="h-12 gap-2 bg-primary text-primary-foreground hover:bg-primary/85"
                >
                  <Plug className="h-4 w-4" />
                  Conectar
                </Button>

                <Button
                  onClick={handleFinish}
                  variant="outline"
                  className="h-12 gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <XCircle className="h-4 w-4" />
                  Finalizar suporte
                </Button>
              </div>
            </div>

            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-primary/10 p-6 mb-6">
                <Plug className="h-10 w-10 text-primary" />
              </div>

              <h3 className="text-3xl font-bold mb-2">Controle Remoto</h3>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-10">
                Conexão criptografada ponta-a-ponta
              </p>

              {remoteId ? (
                <div className="space-y-2">
                  <p className="text-2xl font-semibold">
                    Conectado ao ID {remoteId}
                  </p>
                  <p className="text-muted-foreground">
                    O acesso remoto está ativo.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-2xl font-semibold">
                    Aguardando ID remoto
                  </p>
                  <p className="text-muted-foreground">
                    Cole ou digite o ID para iniciar o atendimento.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-3 border-t border-border bg-muted/20">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--status-connected))]" />
            <span className="text-xs font-medium text-muted-foreground">
              Sessão ativa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}