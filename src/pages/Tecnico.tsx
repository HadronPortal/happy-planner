import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Monitor, ExternalLink, ShieldCheck } from "lucide-react";
import logoSrc from "@/assets/logo.png";

export default function TecnicoPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-foreground flex flex-col">
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--secondary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <header className="relative z-10 border-b border-border/40 bg-card/30 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logoSrc} alt="Hádron" className="h-8 object-contain" />
            <div className="h-4 w-px bg-border/40" />
            <h1 className="text-sm font-bold tracking-tight uppercase">Atendimento Técnico</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/admin")}
            className="text-xs text-muted-foreground hover:text-foreground gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar ao Painel
          </Button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="relative inline-flex mb-4">
            <div className="absolute inset-0 bg-secondary/20 blur-2xl rounded-full" />
            <div className="relative h-20 w-20 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center">
              <Monitor className="h-10 w-10 text-secondary" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Conexão Iniciada</h2>
            <p className="text-muted-foreground text-sm">O ID do cliente foi copiado para sua área de transferência.</p>
          </div>

          <div className="bg-card/40 border border-border/50 rounded-2xl p-8 space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">ID do RustDesk</p>
              <p className="text-4xl font-mono font-bold tracking-tighter text-secondary">{id || "--- --- ---"}</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-12 gap-2">
                <ExternalLink className="h-4 w-4" /> Abrir RustDesk Local
              </Button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/60 uppercase font-bold tracking-widest">
                <ShieldCheck className="h-3 w-3" /> Conexão Criptografada
              </div>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
            Hádron Suporte — Módulo do Técnico
          </p>
        </div>
      </main>
    </div>
  );
}