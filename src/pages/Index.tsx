import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Download, ShieldCheck } from "lucide-react";
import logoSrc from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 space-y-16 py-12">
        <div className="space-y-8 max-w-3xl">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-secondary/30 blur-[100px] rounded-full scale-150 animate-pulse-slow" />
            <img src={logoSrc} alt="Hádron" className="h-24 mx-auto object-contain relative transition-transform hover:scale-110 duration-500" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground uppercase">
              Bem-vindo ao <span className="text-secondary drop-shadow-[0_0_15px_hsl(var(--secondary)/0.3)]">Hádron</span>
            </h1>
            <p className="text-xl text-muted-foreground/80 font-medium max-w-xl mx-auto leading-relaxed">
              Plataforma de suporte técnico remoto corporativo. Gerencie suas conexões e atendimentos em um só lugar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-10 hover:border-secondary transition-all hover:shadow-2xl hover:shadow-secondary/10 flex flex-col items-start text-left gap-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-secondary/10 transition-all" />
            <div className="p-4 rounded-2xl bg-secondary/10 text-secondary group-hover:scale-110 transition-all duration-300">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-black uppercase tracking-tight">Solicitar Suporte</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">Abra uma nova conexão remota para receber assistência técnica imediata.</p>
            </div>
            <Link to="/suporte" className="text-xs font-black text-secondary uppercase tracking-widest hover:underline mt-4">Acessar Agora →</Link>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-10 hover:border-secondary transition-all hover:shadow-2xl hover:shadow-secondary/10 flex flex-col items-start text-left gap-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-secondary/10 transition-all" />
            <div className="p-4 rounded-2xl bg-secondary/10 text-secondary group-hover:scale-110 transition-all duration-300">
              <Download className="h-8 w-8" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-black uppercase tracking-tight">Downloads</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">Acesse os instaladores e utilitários necessários para o seu computador.</p>
            </div>
            <Link to="/download" className="text-xs font-black text-secondary uppercase tracking-widest hover:underline mt-4">Ver Arquivos →</Link>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-10 hover:border-secondary transition-all hover:shadow-2xl hover:shadow-secondary/10 flex flex-col items-start text-left gap-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-secondary/10 transition-all" />
            <div className="p-4 rounded-2xl bg-secondary/10 text-secondary group-hover:scale-110 transition-all duration-300">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-black uppercase tracking-tight">Painel Admin</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">Gestão centralizada de atendimentos, técnicos e relatórios de acesso.</p>
            </div>
            <Link to="/admin" className="text-xs font-black text-secondary uppercase tracking-widest hover:underline mt-4">Área Restrita →</Link>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t border-border/20 bg-muted/5 flex items-center justify-between px-10">
        <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
          <span>HADRON SUPPORT SYSTEM</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
          <span>V 2.5.0</span>
        </div>
        <div className="text-[10px] font-black text-secondary/40 uppercase tracking-widest">
          ESTÁVEL • ONLINE
        </div>
      </div>
    </div>
  );
};

export default Index;
