import { useCallback, useState } from "react";
import { X, Copy, RotateCcw, Monitor, Shield, Lock, Users, MessageSquare, Download, UserCog, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import logoSrc from "@/assets/logo.png";
import { useSupportClient, type ConnectionStatus } from "@/hooks/useSupportClient";

const NAV_ITEMS = [
  { title: "Suporte", url: "/suporte", icon: MessageSquare },
  { title: "Download", url: "/download", icon: Download },
  { title: "Técnico", url: "/tecnico", icon: UserCog },
  { title: "Admin", url: "/admin", icon: ShieldCheck },
];

const STATUS_CONFIG: Record<ConnectionStatus, { label: string; dotClass: string }> = {
  initializing: { label: "Inicializando...", dotClass: "bg-muted-foreground animate-pulse-dot" },
  connecting: { label: "Conectando...", dotClass: "bg-primary animate-pulse-dot" },
  connected: { label: "Pronto", dotClass: "bg-[hsl(var(--status-connected))]" },
};

export default function HadronSuporte() {
  
  const { status, supportId, password, copiarId, refreshPassword, reiniciar: originalReiniciar, fechar } = useSupportClient();
  const [attendingTechnician, setAttendingTechnician] = useState<string | null>(null);

  const reiniciar = useCallback(() => {
    setAttendingTechnician(null);
    originalReiniciar();
  }, [originalReiniciar]);

  const { label, dotClass } = STATUS_CONFIG[status];

  return (
    <div className="flex h-full items-start justify-center p-2 md:p-4">
      <div className="w-full max-w-3xl">
        {/* Main window */}
        <div className="rounded-xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <img src={logoSrc} alt="Hádron" className="h-5 object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <span className="text-xs">☰</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                  {NAV_ITEMS.map((item) => (
                    <DropdownMenuItem key={item.title} asChild>
                      <Link to={item.url} className="flex items-center gap-2 cursor-pointer w-full">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                onClick={fechar}
                className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                title="Fechar"
              >
                <X className="h-3.5 w-3.5" />
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
                  <button onClick={copiarId} className="text-muted-foreground hover:text-foreground transition-colors">
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
                  <button onClick={refreshPassword} className="text-muted-foreground hover:text-foreground transition-colors">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Restart */}
              <button
                onClick={reiniciar}
                className="mt-auto flex items-center justify-center gap-2 rounded-lg bg-muted/50 border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Finalizar suporte
              </button>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col p-5 bg-muted/10">
              {/* Client only message */}
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-8">
                <div className="rounded-full bg-secondary/10 p-6 text-secondary animate-pulse">
                  <Monitor className="h-12 w-12" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-foreground">Aguardando Suporte Técnico</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Por favor, informe seu <span className="text-foreground font-semibold">ID</span> e <span className="text-foreground font-semibold">Senha</span> para o técnico responsável iniciar a conexão.
                  </p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-[240px]">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border shadow-sm">
                    <Shield className="h-4 w-4 text-secondary" />
                    <span className="text-xs font-medium">Sessão Criptografada</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border shadow-sm">
                    <Lock className="h-4 w-4 text-secondary" />
                    <span className="text-xs font-medium">Conexão Segura</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${attendingTechnician ? "bg-[hsl(var(--status-connected))]" : dotClass}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {attendingTechnician ? "Em atendimento" : label}
              </span>
            </div>
            {attendingTechnician && (
              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5">
                <Users className="h-3 w-3" />
                Técnico: {attendingTechnician}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
