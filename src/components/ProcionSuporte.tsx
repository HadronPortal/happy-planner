import { useState, useCallback, useEffect } from "react";
import { Copy, RotateCcw, Search, Clock, Star, Link2, Users, Monitor, LayoutGrid, Frown } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type ConnectionStatus = "initializing" | "connecting" | "connected";

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; dotClass: string }> = {
  initializing: { label: "Inicializando...", dotClass: "bg-muted-foreground animate-pulse-dot" },
  connecting: { label: "Conectando...", dotClass: "bg-primary animate-pulse-dot" },
  connected: { label: "Pronto", dotClass: "bg-[hsl(var(--status-connected))]" },
};

function generateSupportId(): string {
  return `${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`;
}

function generatePassword(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

export default function HadronSuporte() {
  const [status, setStatus] = useState<ConnectionStatus>("initializing");
  const [supportId, setSupportId] = useState(() => generateSupportId());
  const [password, setPassword] = useState(() => generatePassword());
  const [remoteId, setRemoteId] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStatus("connecting"), 1500);
    const t2 = setTimeout(() => setStatus("connected"), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [supportId]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(supportId.replace(/\s/g, ""));
    toast.success("ID copiado para a área de transferência");
  }, [supportId]);

  const handleRestart = useCallback(() => {
    setStatus("initializing");
    setSupportId(generateSupportId());
    setPassword(generatePassword());
    toast.info("Reiniciando suporte...");
  }, []);

  const handleRefreshPassword = useCallback(() => {
    setPassword(generatePassword());
    toast.info("Senha atualizada");
  }, []);

  const handleConnect = useCallback(() => {
    if (!remoteId.trim()) {
      toast.error("Informe o ID Remoto");
      return;
    }
    toast.info(`Conectando ao ID ${remoteId}...`);
  }, [remoteId]);

  const { label, dotClass } = STATUS_CONFIG[status];

  const tabs = [
    { icon: Clock, label: "Recentes" },
    { icon: Star, label: "Favoritos" },
    { icon: Link2, label: "Descoberta" },
    { icon: Users, label: "Catálogo" },
    { icon: Monitor, label: "Dispositivos" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-3xl">
        {/* Main window */}
        <div className="rounded-xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <img src={logoSrc} alt="Hádron" className="h-5 object-contain" />
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <span className="text-xs">☰</span>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col md:flex-row min-h-[420px]">
            {/* Left panel */}
            <div className="w-full md:w-[260px] border-b md:border-b-0 md:border-r border-border p-5 flex flex-col gap-5">
              <div>
                <h2 className="text-sm font-semibold text-foreground mb-0.5">Seu Computador</h2>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Seu computador pode ser acessado com este ID e senha.
                </p>
              </div>

              {/* ID */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground border-l-2 border-secondary pl-2">ID</span>
                  <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-2xl font-bold tracking-[0.2em] text-foreground font-mono pl-2">
                  {supportId}
                </p>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <span className="text-[11px] text-muted-foreground border-l-2 border-secondary pl-2">Senha de uso único</span>
                <div className="flex items-center gap-2 pl-2">
                  <span className="text-base font-mono font-semibold text-foreground tracking-wider">{password}</span>
                  <button onClick={handleRefreshPassword} className="text-muted-foreground hover:text-foreground transition-colors">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Restart */}
              <button
                onClick={handleRestart}
                className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-muted/50 border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reiniciar suporte
              </button>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col p-5">
              {/* Remote connect */}
              <div className="flex flex-col items-center gap-3 mb-6">
                <h3 className="text-sm font-semibold text-foreground">Controle um Computador Remoto</h3>
                <Input
                  placeholder="Informe o ID Remoto"
                  value={remoteId}
                  onChange={(e) => setRemoteId(e.target.value)}
                  className="max-w-xs text-center bg-muted/40 border-border"
                />
                <Button
                  onClick={handleConnect}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/85 font-semibold px-8 transition-colors"
                >
                  Conectar
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-border mb-4">
                <div className="flex gap-1">
                  {tabs.map((tab, i) => (
                    <button
                      key={tab.label}
                      onClick={() => setActiveTab(i)}
                      className={`p-2.5 rounded-t transition-colors ${
                        activeTab === i
                          ? "text-foreground border-b-2 border-secondary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title={tab.label}
                    >
                      <tab.icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Search className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Empty state */}
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-8">
                <div className="rounded-full bg-muted/50 p-4">
                  <Frown className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ops, não há sessões recentes!</p>
                  <p className="text-xs text-muted-foreground/70">Hora de planejar uma nova.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-t border-border bg-muted/20">
            <span className={`h-2 w-2 rounded-full ${dotClass}`} />
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
