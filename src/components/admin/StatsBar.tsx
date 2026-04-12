import { Users, Headphones, Wifi, Clock } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  accentClass?: string;
}

function StatCard({ icon: Icon, label, value, accentClass = "text-secondary" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
        <Icon className={`h-4 w-4 ${accentClass}`} />
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

interface StatsBarProps {
  online: number;
  inService: number;
  totalToday: number;
  waiting: number;
}

export default function StatsBar({ online, inService, totalToday, waiting }: StatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard icon={Wifi} label="Clientes online" value={online} accentClass="text-[hsl(var(--status-connected))]" />
      <StatCard icon={Headphones} label="Em atendimento" value={inService} accentClass="text-secondary" />
      <StatCard icon={Users} label="Conexões hoje" value={totalToday} accentClass="text-muted-foreground" />
      <StatCard icon={Clock} label="Aguardando" value={waiting} accentClass="text-primary" />
    </div>
  );
}
