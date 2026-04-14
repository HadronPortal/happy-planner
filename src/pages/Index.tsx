import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Download, ShieldCheck } from "lucide-react";
import logoSrc from "@/assets/logo.png";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 space-y-12">
      <div className="space-y-6">
        <img src={logoSrc} alt="Hádron" className="h-16 mx-auto object-contain" />
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Bem-vindo ao <span className="text-secondary">Hádron Suporte</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Sua solução completa de suporte técnico remoto seguro e eficiente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link to="/suporte" className="group p-8 rounded-2xl bg-card border border-border hover:border-secondary transition-all hover:shadow-xl hover:shadow-secondary/10 flex flex-col items-center gap-4">
          <div className="p-4 rounded-xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform">
            <MessageSquare className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Solicitar Suporte</h2>
          <p className="text-sm text-muted-foreground">Abra uma conexão remota para receber assistência técnica.</p>
        </Link>

        <Link to="/download" className="group p-8 rounded-2xl bg-card border border-border hover:border-secondary transition-all hover:shadow-xl hover:shadow-secondary/10 flex flex-col items-center gap-4">
          <div className="p-4 rounded-xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform">
            <Download className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Download</h2>
          <p className="text-sm text-muted-foreground">Baixe nosso aplicativo para começar a usar o suporte.</p>
        </Link>

        <Link to="/admin" className="group p-8 rounded-2xl bg-card border border-border hover:border-secondary transition-all hover:shadow-xl hover:shadow-secondary/10 flex flex-col items-center gap-4">
          <div className="p-4 rounded-xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Painel Admin</h2>
          <p className="text-sm text-muted-foreground">Área restrita para gestão de atendimentos e técnicos.</p>
        </Link>
      </div>
      
      <div className="flex gap-4">
        <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold">
          <Link to="/suporte">Começar Agora</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;
