import { Monitor, Building2, Hash, Clock, Shield, FileText, Copy, Plug, CheckCircle2, Check } from "lucide-react";
import { STATUS_CONFIG } from "@/data/supportData";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { DbClient } from "@/hooks/useSupportClients";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ClientDetailSheetProps {
  client: DbClient | null;
  open: boolean;
  onClose: () => void;
  onUpdateClient: (id: string, status: string, tecnico?: string) => Promise<void>;
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/20 p-4 space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{title}</p>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value, mono = false }: { icon: any; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-md bg-secondary/10 p-1.5">
        <Icon className="h-3.5 w-3.5 text-secondary" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium text-muted-foreground/60">{label}</p>
        <p className={`text-sm font-medium leading-none mt-1 ${mono ? 'font-mono tracking-wider text-xs' : ''}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function ClientDetailSheet({ client, open, onClose, onUpdateClient }: ClientDetailSheetProps) {
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();
  
  if (!client) return null;

  const cfg = STATUS_CONFIG[client.status] || STATUS_CONFIG.offline;
  
  const openedAt = new Date(client.opened_at).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

  const updatedAt = new Date(client.updated_at).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });

  const handleCopyId = () => {
    navigator.clipboard.writeText(client.rustdesk_id.replace(/\s/g, ""));
    toast.success("ID copiado com sucesso");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleConnect = async () => {
    try {
      if (!client) return;
      const cleanId = client.rustdesk_id.replace(/\s/g, "");
      
      // 1. copiar rustdesk_id para a área de transferência
      await navigator.clipboard.writeText(cleanId);
      
      // 2. atualizar Supabase
      // status = "em_atendimento", tecnico_responsavel = "Técnico Atual", updated_at = new Date().toISOString()
      // updated_at é atualizado automaticamente pelo hook updateClientStatus
      await onUpdateClient(client.id, "em_atendimento", "Técnico Atual");
      
      
      toast.success("ID copiado. Atendimento iniciado");
    } catch (error) {
      console.error("Connect error:", error);
      toast.error("Erro ao iniciar atendimento");
    }
  };

  const handleFinish = async () => {
    try {
      await onUpdateClient(client.id, "finalizado");
      toast.success("Atendimento finalizado");
      onClose();
    } catch (error) {
      console.error("Finish error:", error);
      toast.error("Erro ao finalizar");
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="bg-[#0A0A0B] border-l border-border/40 w-full sm:max-w-md p-0 overflow-hidden flex flex-col">
        <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-secondary/20 to-transparent shrink-0">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--secondary)) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0A0A0B] to-transparent">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight leading-none">{client.empresa}</h2>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badgeClass}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
                    {cfg.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <DetailBlock title="Informações Técnicas">
            <div className="grid grid-cols-2 gap-4">
              <DetailItem icon={Hash} label="RustDesk ID" value={client.rustdesk_id} mono />
              <DetailItem icon={Monitor} label="Computador" value={client.hostname} />
              <DetailItem icon={Shield} label="Versão do App" value={client.app_version} />
            </div>
          </DetailBlock>

          <DetailBlock title="Controle Operacional">
            <DetailItem icon={FileText} label="Técnico Responsável" value={client.tecnico_responsavel || "Aguardando..."} />
          </DetailBlock>

          <DetailBlock title="Histórico Temporal">
            <div className="space-y-4">
              <DetailItem icon={Clock} label="Data de Abertura" value={openedAt} />
              <DetailItem icon={Clock} label="Última Atualização" value={updatedAt} />
            </div>
          </DetailBlock>
        </div>

        <div className="p-6 bg-muted/10 border-t border-border/40 grid grid-cols-2 gap-3 shrink-0">
          <Button 
            variant="outline" 
            onClick={handleCopyId} 
            className="border-border/60 hover:bg-secondary/10 transition-all gap-2 h-11 text-xs font-bold"
          >
            {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            {isCopied ? "ID COPIADO" : "COPIAR ID"}
          </Button>

          {client.status === "online" && (
            <Button 
              onClick={handleConnect} 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-11 text-xs gap-2 shadow-[0_0_15px_rgba(var(--secondary),0.3)]"
            >
              <Plug className="h-4 w-4" /> CONECTAR
            </Button>
          )}

          {client.status === "em_atendimento" && (
            <Button 
              onClick={handleFinish} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 text-xs gap-2"
            >
              <CheckCircle2 className="h-4 w-4" /> FINALIZAR
            </Button>
          )}

          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="col-span-2 text-muted-foreground hover:text-foreground h-10 text-[11px] font-bold uppercase tracking-widest"
          >
            FECHAR DRAWER
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}