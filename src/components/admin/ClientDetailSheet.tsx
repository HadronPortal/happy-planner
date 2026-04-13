import { Monitor, Building2, Hash, Clock, Shield, FileText } from "lucide-react";
import { STATUS_CONFIG } from "@/data/supportData";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { DbClient } from "@/hooks/useSupportClients";

interface ClientDetailSheetProps {
  client: DbClient | null;
  open: boolean;
  onClose: () => void;
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border/30">
      <Icon className="h-4 w-4 text-secondary mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-0.5">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}

export default function ClientDetailSheet({ client, open, onClose }: ClientDetailSheetProps) {
  if (!client) return null;
  const cfg = STATUS_CONFIG[client.status] || STATUS_CONFIG.offline;
  const openedAt = new Date(client.opened_at).toLocaleString("pt-BR");
  const updatedAt = new Date(client.updated_at).toLocaleString("pt-BR");

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="bg-card border-border w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold">Detalhes do cliente</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-1">
          <DetailRow icon={Building2} label="Empresa" value={client.empresa} />
          <DetailRow icon={Monitor} label="Computador" value={client.hostname} />
          <DetailRow icon={Hash} label="RustDesk ID" value={client.rustdesk_id} />
          <DetailRow icon={Shield} label="Versão do app" value={client.app_version} />
          <DetailRow icon={Clock} label="Horário de abertura" value={openedAt} />
          <DetailRow icon={Clock} label="Última atualização" value={updatedAt} />

          <div className="flex items-start gap-3 py-2.5 border-b border-border/30">
            <div className="h-4 w-4 flex items-center justify-center mt-0.5">
              <span className={`h-2 w-2 rounded-full ${cfg.dotClass}`} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Status</p>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cfg.badgeClass}`}>
                {cfg.label}
              </span>
            </div>
          </div>

          <DetailRow icon={FileText} label="Técnico responsável" value={client.tecnico_responsavel || "Nenhum"} />
        </div>

        <div className="mt-6 rounded-lg bg-muted/20 border border-border/50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-1">Histórico de atendimento</p>
          <p className="text-xs text-muted-foreground/60">Disponível em breve com integração ao backend</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
