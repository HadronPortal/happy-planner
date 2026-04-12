export type ClientStatus = "online" | "waiting" | "in_service" | "offline";

export const STATUS_CONFIG: Record<string, { label: string; dotClass: string; badgeClass: string }> = {
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

export const TECHNICIANS = ["Carlos Silva", "Ana Costa", "Pedro Santos", "Maria Oliveira"];
