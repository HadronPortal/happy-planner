import { useState, useMemo } from "react";
import logoSrc from "@/assets/logo.png";
import StatsBar from "@/components/admin/StatsBar";
import ClientFilters from "@/components/admin/ClientFilters";
import ClientTable from "@/components/admin/ClientTable";
import ClientDetailSheet from "@/components/admin/ClientDetailSheet";
import { useSupportClients, type DbClient } from "@/hooks/useSupportClients";

export default function AdminPanel() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [techFilter, setTechFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState<DbClient | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { clients, loading, updateClientStatus } = useSupportClients();

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        !search ||
        c.empresa.toLowerCase().includes(search.toLowerCase()) ||
        c.rustdesk_id.replace(/\s/g, "").includes(search.replace(/\s/g, ""));
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchTech = techFilter === "all" || c.tecnico_responsavel === techFilter;
      return matchSearch && matchStatus && matchTech;
    });
  }, [clients, search, statusFilter, techFilter]);

  const stats = useMemo(() => ({
    online: clients.filter((c) => c.status === "online" || c.status === "waiting" || c.status === "in_service").length,
    inService: clients.filter((c) => c.status === "in_service").length,
    totalToday: clients.length,
    waiting: clients.filter((c) => c.status === "waiting").length,
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

        <ClientFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          techFilter={techFilter}
          onTechFilterChange={setTechFilter}
        />

        <ClientTable clients={filtered} loading={loading} onViewDetails={handleViewDetails} />

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
