import { Copy, Eye, Plug, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SupportClient, STATUS_CONFIG } from "@/data/supportData";

interface ClientTableProps {
  clients: SupportClient[];
  onViewDetails: (client: SupportClient) => void;
}

export default function ClientTable({ clients, onViewDetails }: ClientTableProps) {
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id.replace(/\s/g, ""));
    toast.success("ID copiado");
  };

  const handleConnect = (client: SupportClient) => {
    toast.info(`Conectando a ${client.company}...`);
  };

  const handleEnd = (client: SupportClient) => {
    toast.info(`Atendimento encerrado: ${client.company}`);
  };

  if (clients.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card/60 px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground">Nenhum cliente encontrado</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card/60 overflow-hidden">
      {/* Desktop table */}
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
              const cfg = STATUS_CONFIG[client.status];
              return (
                <tr key={client.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-medium">{client.company}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{client.computerName}</td>
                  <td className="px-4 py-3 font-mono text-xs tracking-wider">{client.supportId}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cfg.badgeClass}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{client.openedAt}</td>
                  <td className="px-4 py-3 text-xs">{client.technician || <span className="text-muted-foreground/50">—</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {client.status !== "offline" && client.status !== "in_service" && (
                        <Button size="sm" onClick={() => handleConnect(client)} className="h-7 px-2.5 text-[11px] font-bold bg-primary text-primary-foreground hover:bg-primary/85 gap-1">
                          <Plug className="h-3 w-3" /> Conectar
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => handleCopyId(client.supportId)} className="h-7 px-2 text-[11px] text-secondary hover:text-secondary hover:bg-secondary/10 gap-1">
                        <Copy className="h-3 w-3" /> ID
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onViewDetails(client)} className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1">
                        <Eye className="h-3 w-3" /> Detalhes
                      </Button>
                      {client.status === "in_service" && (
                        <Button size="sm" variant="ghost" onClick={() => handleEnd(client)} className="h-7 px-2 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/10 gap-1">
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

      {/* Mobile cards */}
      <div className="lg:hidden divide-y divide-border/30">
        {clients.map((client) => {
          const cfg = STATUS_CONFIG[client.status];
          return (
            <div key={client.id} className="px-4 py-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{client.company}</p>
                  <p className="text-xs text-muted-foreground font-mono">{client.computerName}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cfg.badgeClass}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
                  {cfg.label}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono tracking-wider">{client.supportId}</span>
                <span className="text-muted-foreground">{client.openedAt}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {client.status !== "offline" && client.status !== "in_service" && (
                  <Button size="sm" onClick={() => handleConnect(client)} className="h-7 px-2.5 text-[11px] font-bold bg-primary text-primary-foreground hover:bg-primary/85 gap-1">
                    <Plug className="h-3 w-3" /> Conectar
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => handleCopyId(client.supportId)} className="h-7 px-2 text-[11px] text-secondary hover:bg-secondary/10 gap-1">
                  <Copy className="h-3 w-3" /> ID
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onViewDetails(client)} className="h-7 px-2 text-[11px] text-muted-foreground gap-1">
                  <Eye className="h-3 w-3" /> Detalhes
                </Button>
                {client.status === "in_service" && (
                  <Button size="sm" variant="ghost" onClick={() => handleEnd(client)} className="h-7 px-2 text-[11px] text-destructive hover:bg-destructive/10 gap-1">
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
