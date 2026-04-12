export type ClientStatus = "online" | "waiting" | "in_service" | "offline";

export interface SupportClient {
  id: string;
  company: string;
  computerName: string;
  supportId: string;
  status: ClientStatus;
  openedAt: string;
  technician: string | null;
  os?: string;
  notes?: string;
}

export const STATUS_CONFIG: Record<ClientStatus, { label: string; dotClass: string; badgeClass: string }> = {
  online: {
    label: "Online",
    dotClass: "bg-[hsl(var(--status-connected))]",
    badgeClass: "bg-[hsl(var(--status-connected))]/15 text-[hsl(var(--status-connected))] border-[hsl(var(--status-connected))]/30",
  },
  waiting: {
    label: "Aguardando",
    dotClass: "bg-primary animate-pulse-dot",
    badgeClass: "bg-primary/15 text-primary border-primary/30",
  },
  in_service: {
    label: "Em atendimento",
    dotClass: "bg-secondary",
    badgeClass: "bg-secondary/15 text-secondary border-secondary/30",
  },
  offline: {
    label: "Offline",
    dotClass: "bg-muted-foreground/50",
    badgeClass: "bg-muted/30 text-muted-foreground border-border",
  },
};

export const MOCK_CLIENTS: SupportClient[] = [
  { id: "1", company: "Tech Solutions Ltda", computerName: "PC-RECEPCAO-01", supportId: "482 917 305", status: "waiting", openedAt: "09:12", technician: null, os: "Windows 11 Pro", notes: "Problema com impressora" },
  { id: "2", company: "Contábil Express", computerName: "NOTE-FINANCEIRO", supportId: "731 204 568", status: "in_service", openedAt: "08:45", technician: "Carlos Silva", os: "Windows 10 Pro", notes: "Atualização de sistema ERP" },
  { id: "3", company: "Auto Peças Central", computerName: "CAIXA-LOJA-02", supportId: "195 683 042", status: "online", openedAt: "09:30", technician: null, os: "Windows 10", notes: "" },
  { id: "4", company: "Clínica Saúde Total", computerName: "PC-CONSULTORIO-03", supportId: "847 312 659", status: "in_service", openedAt: "08:20", technician: "Ana Costa", os: "Windows 11", notes: "Configuração de rede" },
  { id: "5", company: "Restaurante Sabor & Arte", computerName: "PDV-PRINCIPAL", supportId: "563 290 718", status: "offline", openedAt: "07:55", technician: "Carlos Silva", os: "Windows 10", notes: "Atendimento encerrado" },
  { id: "6", company: "Escritório Advocacia JR", computerName: "NOTE-DR-JUNIOR", supportId: "329 871 046", status: "waiting", openedAt: "09:42", technician: null, os: "Windows 11 Pro", notes: "Problema com VPN" },
  { id: "7", company: "Farmácia Popular Plus", computerName: "PC-BALCAO-01", supportId: "614 058 293", status: "online", openedAt: "09:50", technician: null, os: "Windows 10", notes: "" },
];

export const TECHNICIANS = ["Carlos Silva", "Ana Costa", "Pedro Santos", "Maria Oliveira"];
