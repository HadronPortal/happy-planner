import { useState, useMemo } from "react";
import logoSrc from "@/assets/logo.png";
import StatsBar from "@/components/admin/StatsBar";
import ClientFilters from "@/components/admin/ClientFilters";
import ClientTable from "@/components/admin/ClientTable";
import ClientDetailSheet from "@/components/admin/ClientDetailSheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupportClients, type DbClient } from "@/hooks/useSupportClients";

export default function AdminPanel() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [techFilter, setTechFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState<DbClient | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { clients, loading, updateClientStatus } = useSupportClients();

  const { activeClients, finishedClients } = useMemo(() => {
    const baseList = clients.filter((c) => {
      const matchSearch =
        !search ||
        c.empresa.toLowerCase().includes(search.toLowerCase()) ||
        c.rustdesk_id.replace(/\s/g, "").includes(search.replace(/\s/g, ""));
      const matchTech = techFilter === "all" || c.tecnico_responsavel === techFilter;
      return matchSearch && matchTech;
    });

    const active = baseList
      .filter((c) => c.status === "online" || c.status === "em_atendimento")
      .sort((a, b) => {
        // 1. em_atendimento primeiro
        if (a.status === "em_atendimento" && b.status !== "em_atendimento") return -1;
        if (a.status !== "em_atendimento" && b.status === "em_atendimento") return 1;
        // 2. mais recentes primeiro (opened_at)
        return new Date(b.opened_at).getTime() - new Date(a.opened_at).getTime();
      });

    const finished = baseList
      .filter((c) => c.status === "finalizado")
      .sort((a, b) => new Date(b.opened_at).getTime() - new Date(a.opened_at).getTime());

    return { activeClients: active, finishedClients: finished };
  }, [clients, search, techFilter]);

  const stats = useMemo(() => ({
    online: clients.filter((c) => c.status === "online").length,
    inService: clients.filter((c) => c.status === "em_atendimento").length,
    totalToday: clients.filter((c) => c.status !== "offline").length,
    waiting: clients.filter((c) => c.status === "online" && !c.tecnico_responsavel).length,
  }), [clients]);

  const handleViewDetails = (client: DbClient) => {
    setSelectedClient(client);
    setDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--secondary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={logoSrc} alt="Hádron" className="h-10 object-contain" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">Painel de suporte técnico</h1>
              <p className="text-xs text-muted-foreground">Clientes online e atendimentos remotos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--status-connected))]/30 bg-[hsl(var(--status-connected))]/10 px-3 py-1 text-[11px] font-medium text-[hsl(var(--status-connected))]">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--status-connected))]" />
              Sistema ativo
            </span>
          </div>
        </div>

        <StatsBar {...stats} />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto shrink-0">
            <TabsList className="bg-muted/30 border border-border/50 h-9 p-1">
              <TabsTrigger value="active" className="text-xs px-4 h-7">Ativos</TabsTrigger>
              <TabsTrigger value="finalizado" className="text-xs px-4 h-7">Finalizados</TabsTrigger>
              <TabsTrigger value="all" className="text-xs px-4 h-7">Todos</TabsTrigger>
            </TabsList>
          </Tabs>

          <ClientFilters
            search={search}
            onSearchChange={setSearch}
            techFilter={techFilter}
            onTechFilterChange={setTechFilter}
          />
        </div>

        <div className="space-y-8">
          {(statusFilter === "all" || statusFilter === "active") && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Atendimentos Ativos</h2>
              </div>
              <ClientTable 
                clients={activeClients} 
                loading={loading} 
                onViewDetails={handleViewDetails} 
                onUpdateClient={updateClientStatus} 
              />
            </div>
          )}

          {(statusFilter === "all" || statusFilter === "finalizado") && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="h-2 w-2 rounded-full bg-blue-500/50" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground/80">Atendimentos Finalizados</h2>
              </div>
              <ClientTable 
                clients={finishedClients} 
                loading={loading} 
                onViewDetails={handleViewDetails} 
                onUpdateClient={updateClientStatus} 
              />
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-muted-foreground/40 pt-4">
          © {new Date().getFullYear()} Hádron Suporte — Painel administrativo
        </p>
      </div>

      <ClientDetailSheet
        client={selectedClient}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
