import { Copy, Eye, Plug, XCircle, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { STATUS_CONFIG } from "@/data/supportData";
import type { DbClient } from "@/hooks/useSupportClients";
import { useNavigate } from "react-router-dom";

interface ClientTableProps {
  clients: DbClient[];
  loading: boolean;
  onViewDetails: (client: DbClient) => void;
  onUpdateClient: (id: string, status: string, tecnico?: string) => Promise<boolean>;
  emptyMessage?: string;
}

export default function ClientTable({ 
  clients, 
  loading, 
  onViewDetails, 
  onUpdateClient,
  emptyMessage = "Nenhum cliente online no momento"
}: ClientTableProps) {
  const navigate = useNavigate();

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id.replace(/\s/g, ""));
    toast.success("ID copiado");
  };

  const handleConnect = async (client: DbClient) => {
    try {
      const cleanId = client.rustdesk_id.replace(/\s/g, "");

      await navigator.clipboard.writeText(cleanId);

      toast.success(`ID copiado. Atendimento iniciado para ${client.empresa}`);

      navigate(`/tecnico?id=${cleanId}`);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao iniciar conexão");
    }
  };

  const handleEnd = (client: DbClient) => {
    toast.info(`Atendimento encerrado: ${client.empresa}`);
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card/60 px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground animate-pulse">Carregando clientes...</p>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/60 px-6 py-16 text-center space-y-3">
        <WifiOff className="mx-auto h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm font-medium text-muted-foreground">{emptyMessage}</p>
        <p className="text-xs text-muted-foreground/50">Os clientes aparecerão aqui automaticamente ao se conectarem</p>
      </div>
    );
  }

  const getConfig = (status: string) => STATUS_CONFIG[status] || STATUS_CONFIG.offline;

  return (
    <div className="rounded-xl border border-border bg-card/60 overflow-hidden">
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Empresa</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Computador</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">ID</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Hora</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Técnico</th>
              <th className="text-right px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => {
              const cfg = getConfig(client.status);
              const time = new Date(client.opened_at).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <tr key={client.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-medium">{client.empresa}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{client.hostname}</td>
                  <td className="px-4 py-3 font-mono text-xs tracking-wider">{client.rustdesk_id}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cfg.badgeClass}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{time}</td>
                  <td className="px-4 py-3 text-xs">
                    {client.tecnico_responsavel || <span className="text-muted-foreground/50">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        onClick={() => handleConnect(client)}
                        className="h-7 px-2.5 text-[11px] font-bold bg-primary text-primary-foreground hover:bg-primary/85 gap-1"
                      >
                        <Plug className="h-3 w-3" /> Conectar
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyId(client.rustdesk_id)}
                        className="h-7 px-2 text-[11px] text-secondary hover:text-secondary hover:bg-secondary/10 gap-1"
                      >
                        <Copy className="h-3 w-3" /> ID
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onViewDetails(client)}
                        className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1"
                      >
                        <Eye className="h-3 w-3" /> Detalhes
                      </Button>

                      {(client.status === "in_service" || client.status === "em_atendimento") && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEnd(client)}
                          className="h-7 px-2 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                        >
                          <XCircle className="h-3 w-3" /> Encerrar
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-border/30">
        {clients.map((client) => {
          const cfg = getConfig(client.status);
          const time = new Date(client.opened_at).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={client.id} className="px-4 py-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{client.empresa}</p>
                  <p className="text-xs text-muted-foreground font-mono">{client.hostname}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cfg.badgeClass}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
                  {cfg.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-mono tracking-wider">{client.rustdesk_id}</span>
                <span className="text-muted-foreground">{time}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <Button
                  size="sm"
                  onClick={() => handleConnect(client)}
                  className="h-7 px-2.5 text-[11px] font-bold bg-primary text-primary-foreground hover:bg-primary/85 gap-1"
                >
                  <Plug className="h-3 w-3" /> Conectar
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopyId(client.rustdesk_id)}
                  className="h-7 px-2 text-[11px] text-secondary hover:bg-secondary/10 gap-1"
                >
                  <Copy className="h-3 w-3" /> ID
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewDetails(client)}
                  className="h-7 px-2 text-[11px] text-muted-foreground gap-1"
                >
                  <Eye className="h-3 w-3" /> Detalhes
                </Button>

                {(client.status === "in_service" || client.status === "em_atendimento") && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEnd(client)}
                    className="h-7 px-2 text-[11px] text-destructive hover:bg-destructive/10 gap-1"
                  >
                    <XCircle className="h-3 w-3" /> Encerrar
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}