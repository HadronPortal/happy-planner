export type ClientStatus = "online" | "em_atendimento" | "offline" | "finalizado";

export const STATUS_CONFIG: Record<string, { label: string; dotClass: string; badgeClass: string }> = {
  online: {
    label: "Online",
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  em_atendimento: {
    label: "Em atendimento",
    dotClass: "bg-blue-500",
    badgeClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  finalizado: {
    label: "Finalizado",
    dotClass: "bg-emerald-500/50",
    badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/10",
  },
  offline: {
    label: "Offline",
    dotClass: "bg-muted-foreground/50",
    badgeClass: "bg-muted/10 text-muted-foreground border-border",
  },
};

export const TECHNICIANS = ["Carlos Silva", "Ana Costa", "Pedro Santos", "Maria Oliveira"];
