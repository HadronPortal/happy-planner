import { X, Monitor, Building2, Hash, Clock, Shield, FileText } from "lucide-react";
import { SupportClient, STATUS_CONFIG } from "@/data/supportData";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface ClientDetailSheetProps {
  client: SupportClient | null;
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
  const cfg = STATUS_CONFIG[client.status];

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="bg-card border-border w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-lg font-bold">Detalhes do cliente</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-1">
          <DetailRow icon={Building2} label="Empresa" value={client.company} />
          <DetailRow icon={Monitor} label="Computador" value={client.computerName} />
          <DetailRow icon={Hash} label="ID de suporte" value={client.supportId} />
          <DetailRow icon={Shield} label="Sistema operacional" value={client.os || "Não informado"} />
          <DetailRow icon={Clock} label="Horário de abertura" value={client.openedAt} />

          <div className="flex items-start gap-3 py-2.5 border-b border-border/30">
            <div className={`h-4 w-4 flex items-center justify-center mt-0.5`}>
              <span className={`h-2 w-2 rounded-full ${cfg.dotClass}`} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-0.5">Status</p>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cfg.badgeClass}`}>
                {cfg.label}
              </span>
            </div>
          </div>

          <DetailRow icon={FileText} label="Técnico responsável" value={client.technician || "Nenhum"} />
          <DetailRow icon={FileText} label="Observações" value={client.notes || "Sem observações"} />
        </div>

        <div className="mt-6 rounded-lg bg-muted/20 border border-border/50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-1">Histórico de atendimento</p>
          <p className="text-xs text-muted-foreground/60">Disponível em breve com integração ao backend</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
