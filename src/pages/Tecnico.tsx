import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Copy, RotateCcw, X, History, Plug, Trash2, Pencil, Check } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import procionLogoSrc from "@/assets/procion-logo.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSupportClient, type ConnectionStatus } from "@/hooks/useSupportClient";
import { supabase } from "@/integrations/supabase/client";
import { useConnectionHistory, formatRustDeskId } from "@/hooks/useConnectionHistory";

// hadronTecnicoAPI typed in src/vite-env.d.ts

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; dotClass: string }> = {
  initializing: { label: "Inicializando...", dotClass: "bg-muted-foreground animate-pulse-dot" },
  connecting: { label: "Conectando...", dotClass: "bg-secondary animate-pulse-dot" },
  connected: { label: "Pronto", dotClass: "bg-[hsl(var(--status-connected))]" },
};

export default function Tecnico() {
  const { status, supportId, password, copiarId, refreshPassword } = useSupportClient();
  const [searchParams] = useSearchParams();
  const [remoteId, setRemoteId] = useState("");
  const [isConnecting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const { history, addConnection, renameConnection, removeConnection, clearHistory } =
    useConnectionHistory();

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setRemoteId(id.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"));
    }
  }, [searchParams]);

  const lookupClientName = useCallback(async (cleanId: string): Promise<string | undefined> => {
    try {
      const { data } = await supabase
        .from("support_online_clients")
        .select("hostname, empresa")
        .eq("rustdesk_id", cleanId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data) {
        return data.hostname || data.empresa || undefined;
      }
    } catch (err) {
      console.error("Erro ao buscar nome do cliente:", err);
    }
    return undefined;
  }, []);

  const handleConnect = useCallback(async () => {
    const cleanId = remoteId.replace(/\D/g, "");
    if (!cleanId) {
      toast.error("Informe um ID válido");
      return;
    }

    let clientName: string | undefined;
    try {
      const { error } = await supabase
        .from("support_online_clients")
        .update({
          status: "em_atendimento",
          updated_at: new Date().toISOString(),
        })
        .eq("rustdesk_id", cleanId)
        .in("status", ["online", "em_atendimento"]);

      if (error) console.error("Erro ao atualizar status:", error);
      clientName = await lookupClientName(cleanId);
    } catch (err) {
      console.error("Erro inesperado ao conectar:", err);
    }

    try {
      if (window.hadronTecnicoAPI) {
        window.hadronTecnicoAPI.openRustDesk(cleanId);
        addConnection(cleanId, clientName);
        toast.success("Abrindo conexão remota");
      } else {
        addConnection(cleanId, clientName);
        toast.error("Função disponível apenas no app técnico");
      }
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível iniciar a conexão");
    }
  }, [remoteId, addConnection, lookupClientName]);

  const handleSelectHistory = useCallback((id: string) => {
    setRemoteId(formatRustDeskId(id));
  }, []);

  const handleQuickConnect = useCallback(
    async (id: string, existingName?: string) => {
      setRemoteId(formatRustDeskId(id));
      let clientName = existingName;
      try {
        await supabase
          .from("support_online_clients")
          .update({ status: "em_atendimento", updated_at: new Date().toISOString() })
          .eq("rustdesk_id", id)
          .in("status", ["online", "em_atendimento"]);
        if (!clientName) {
          clientName = await lookupClientName(id);
        }
      } catch (err) {
        console.error(err);
      }
      if (window.hadronTecnicoAPI) {
        window.hadronTecnicoAPI.openRustDesk(id);
        addConnection(id, clientName);
        toast.success("Abrindo conexão remota");
      } else {
        toast.error("Função disponível apenas no app técnico");
      }
    },
    [addConnection, lookupClientName],
  );

  const handleCopyHistory = useCallback(async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("ID copiado");
    } catch {
      toast.error("Não foi possível copiar");
    }
  }, []);

  const startEditing = useCallback((id: string, currentName?: string) => {
    setEditingId(id);
    setEditingName(currentName ?? "");
  }, []);

  const commitEditing = useCallback(() => {
    if (editingId) {
      renameConnection(editingId, editingName);
      toast.success("Nome atualizado");
    }
    setEditingId(null);
    setEditingName("");
  }, [editingId, editingName, renameConnection]);

  const handleFinish = useCallback(async () => {
    try {
      const rawId = searchParams.get("id");
      if (rawId) {
        const cleanId = rawId.replace(/\s/g, "");
        const { error } = await supabase
          .from("support_online_clients")
          .update({
            status: "offline",
            updated_at: new Date().toISOString(),
          })
          .eq("rustdesk_id", cleanId)
          .in("status", ["online", "em_atendimento"]);

        if (error) {
          console.error("Erro ao finalizar suporte no banco:", error);
          toast.error("Erro ao finalizar no sistema");
        }
      }

      toast.success("Atendimento finalizado com sucesso");

      if (window.hadronTecnicoAPI) {
        window.hadronTecnicoAPI.closeWindow();
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      toast.error("Ocorreu um erro ao finalizar");
    }
  }, [searchParams]);

  const { label, dotClass } = STATUS_CONFIG[status];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/50">
          <div className="shrink-0 border-b border-border bg-muted/30 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={procionLogoSrc} alt="Procion" className="h-7 object-contain" />
                <div className="mx-1 h-4 w-px bg-border" />
                <Badge
                  variant="outline"
                  className="h-5 border-secondary/50 bg-secondary/10 px-2 py-0 text-[10px] font-bold uppercase tracking-wider text-secondary"
                >
                  AMBIENTE TÉCNICO
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <button className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <span className="text-xs">☰</span>
                </button>
                <button
                  onClick={() => {
                    if (window.hadronTecnicoAPI) {
                      window.hadronTecnicoAPI.closeWindow();
                    } else {
                      window.close();
                    }
                  }}
                  className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive"
                  title="Fechar"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex min-h-[480px] flex-col md:flex-row">
            <div className="w-full shrink-0 border-b border-border p-5 md:w-[280px] md:border-b-0 md:border-r">
              <div className="flex h-full flex-col gap-5">
                <div>
                  <h2 className="mb-0.5 text-sm font-semibold text-foreground">Modulo tecnico</h2>
                  <p className="text-[11px] leading-snug text-muted-foreground">
                    Identificação da sua estação técnica para este atendimento.
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="border-l-2 border-secondary pl-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                      Seu ID
                    </span>
                    <button
                      onClick={copiarId}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="pl-2 font-mono text-2xl font-bold tracking-[0.2em] text-foreground">
                    {supportId}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="border-l-2 border-secondary pl-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                    Token de Acesso
                  </span>
                  <div className="flex items-center gap-2 pl-2">
                    <span className="font-mono text-base font-semibold tracking-wider text-foreground">
                      {password}
                    </span>
                    <button
                      onClick={refreshPassword}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-auto flex flex-col items-center gap-3">
                  <img src={logoSrc} alt="Hádron Suporte" className="h-10 object-contain opacity-90" />
                  <button
                    onClick={handleFinish}
                    disabled={!remoteId}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" />
                    Finalizar suporte
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-5 p-6">
              <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4">
                <div className="space-y-1 text-center">
                  <h3 className="text-lg font-semibold text-foreground">Conectar a um cliente</h3>
                  <p className="text-xs text-muted-foreground">
                    Digite ou cole o ID do RustDesk do cliente.
                  </p>
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  maxLength={15}
                  value={remoteId}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                    const formatted = digits.replace(
                      /(\d{3})(\d{0,3})(\d{0,3})/,
                      (_, a, b, c) => [a, b, c].filter(Boolean).join(" "),
                    );
                    setRemoteId(formatted);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleConnect();
                  }}
                  placeholder=""
                  className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-center font-mono text-xl font-bold tracking-[0.15em] text-foreground shadow-inner placeholder:text-muted-foreground/40 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/60"
                />

                <Button
                  onClick={handleConnect}
                  disabled={!remoteId.replace(/\D/g, "")}
                  className="h-10 w-full bg-secondary text-sm font-bold uppercase tracking-wide text-secondary-foreground shadow-sm transition-all hover:bg-secondary/90"
                >
                  Conectar
                </Button>
              </div>

              <div className="mt-1 flex min-h-0 flex-1 flex-col">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Conexões recentes
                    </span>
                    {history.length > 0 && (
                      <span className="text-[10px] text-muted-foreground/60">({history.length})</span>
                    )}
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={clearHistory}
                      className="text-[10px] uppercase tracking-wider text-muted-foreground/70 transition-colors hover:text-destructive"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center">
                    <p className="text-xs text-muted-foreground/70">
                      Nenhuma conexão recente. IDs conectados aparecerão aqui.
                    </p>
                  </div>
                ) : (
                  <div className="scrollbar-themed max-h-[260px] flex-1 overflow-y-auto pr-1">
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {history.map((item) => {
                        const isRecent = Date.now() - item.lastUsedAt < 1000 * 60 * 60 * 24;
                        const isEditing = editingId === item.id;
                        return (
                          <div
                            key={item.id}
                            className="group relative flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-3 transition-all hover:-translate-y-0.5 hover:border-secondary/40 hover:bg-muted/40 hover:shadow-lg hover:shadow-black/30"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex min-w-0 flex-1 items-center gap-2">
                                <span
                                  className={`h-2 w-2 shrink-0 rounded-full ${
                                    isRecent ? "bg-[hsl(var(--status-connected))]" : "bg-muted-foreground/40"
                                  }`}
                                  title={isRecent ? "Recente" : "Antigo"}
                                />
                                {isEditing ? (
                                  <input
                                    autoFocus
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={commitEditing}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") commitEditing();
                                      if (e.key === "Escape") {
                                        setEditingId(null);
                                        setEditingName("");
                                      }
                                    }}
                                    placeholder="Nome do cliente"
                                    className="min-w-0 flex-1 rounded border border-border bg-background px-1.5 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-secondary"
                                  />
                                ) : (
                                  <button
                                    onClick={() => handleSelectHistory(item.id)}
                                    className="truncate text-left text-xs font-semibold text-foreground transition-colors hover:text-secondary"
                                    title="Preencher campo com este ID"
                                  >
                                    {item.name || formatRustDeskId(item.id) || "Sem nome"}
                                  </button>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  isEditing ? commitEditing() : startEditing(item.id, item.name)
                                }
                                className="rounded p-1 text-muted-foreground opacity-0 transition-colors group-hover:opacity-100 hover:bg-muted hover:text-foreground"
                                title={isEditing ? "Salvar nome" : "Editar nome"}
                              >
                                {isEditing ? <Check className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
                              </button>
                            </div>

                            <button
                              onClick={() => handleSelectHistory(item.id)}
                              className="text-left font-mono text-sm font-bold tracking-wider text-foreground transition-colors hover:text-secondary"
                              title="Preencher campo com este ID"
                            >
                              {formatRustDeskId(item.id)}
                            </button>

                            <div className="mt-auto flex items-center gap-1.5">
                              <button
                                onClick={() => handleQuickConnect(item.id, item.name)}
                                className="flex flex-1 items-center justify-center gap-1 rounded-md bg-secondary/15 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground"
                                title="Conectar novamente"
                              >
                                <Plug className="h-3 w-3" />
                                Conectar
                              </button>
                              <button
                                onClick={() => handleCopyHistory(item.id)}
                                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                title="Copiar ID"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => removeConnection(item.id)}
                                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                title="Remover do histórico"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-2">
            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${isConnecting ? "bg-secondary animate-pulse-dot" : dotClass}`}
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {isConnecting ? "Negociando conexão..." : label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-[9px] uppercase tracking-widest text-muted-foreground/40 sm:inline">
                H3-TEC-SEC-V2
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
