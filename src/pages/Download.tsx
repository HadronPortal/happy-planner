import { Shield, Lock, UserCheck, Monitor, Apple, Cpu, Smartphone, AlertTriangle } from "lucide-react";
// PageHeader removed to use layout header
import logoSrc from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const APP_VERSION = "1.0.0";
const RELEASE_DATE = "15.05.2024";

const platforms = [
  { icon: Monitor, label: "Windows", version: "x64", active: true },
  { icon: Apple, label: "macOS", version: "Intel/M1", active: false },
  { icon: Cpu, label: "Linux", version: "Deb/AppImage", active: false },
  { icon: Smartphone, label: "Android", version: "APK", active: false },
  { icon: Smartphone, label: "iOS", version: "App Store", active: false },
];

export default function DownloadPage() {
  return (
    <div className="h-full flex flex-col bg-background text-foreground font-sans overflow-auto custom-scrollbar">
      <div className="relative">
        {/* Hero Section */}
        <section className="px-8 py-16 text-center bg-gradient-to-b from-muted/20 to-transparent">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full scale-150 animate-pulse-subtle" />
              <h1 className="relative text-5xl md:text-6xl font-black tracking-tight text-foreground uppercase">
                Downloads <span className="text-secondary tracking-widest block text-2xl mt-2 drop-shadow-[0_0_10px_hsl(var(--secondary)/0.3)]">Hádron Suporte</span>
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground/80 font-medium leading-relaxed max-w-2xl mx-auto">
              Baixe a versão mais recente da nossa ferramenta de acesso remoto seguro para o seu sistema operacional.
            </p>

            {/* Warning Banner */}
            <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-6 max-w-2xl mx-auto flex gap-4 text-left shadow-2xl shadow-destructive/5 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-destructive/10 p-2 rounded-xl h-fit">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-destructive uppercase tracking-widest">Aviso de Segurança</h4>
                <p className="text-sm text-muted-foreground/90 leading-relaxed">
                  Forneça acesso apenas a técnicos autorizados da <span className="text-foreground font-bold">Hádron</span>. 
                  Nunca compartilhe seu ID e senha com estranhos ou ligações não solicitadas.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-3 bg-muted/30 border border-border/50 rounded-full px-6 py-2.5 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Versão Estável: <span className="text-secondary font-black">{APP_VERSION}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-border" />
              Build: {RELEASE_DATE}
            </div>
          </div>
        </section>

        {/* Platform Grid */}
        <section className="px-8 pb-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {platforms.map((platform) => (
                <div 
                  key={platform.label}
                  className={`group relative rounded-3xl border-2 transition-all duration-300 p-8 text-center flex flex-col items-center gap-6 overflow-hidden ${
                    platform.active 
                    ? "border-secondary/30 bg-card hover:border-secondary hover:shadow-2xl hover:shadow-secondary/10 cursor-pointer" 
                    : "border-border/30 bg-muted/5 opacity-40 grayscale cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (platform.active) {
                      console.log(`Downloading for ${platform.label}`);
                    }
                  }}
                >
                  {platform.active && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 blur-2xl -mr-12 -mt-12 group-hover:bg-secondary/10 transition-all" />
                  )}
                  
                  <div className={`p-5 rounded-2xl transition-all duration-300 ${platform.active ? "bg-secondary/10 text-secondary group-hover:scale-110 group-hover:bg-secondary/20" : "bg-muted/20 text-muted-foreground"}`}>
                    <platform.icon className="h-10 w-10" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-black text-xl text-foreground uppercase tracking-tight">{platform.label}</h3>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">{platform.version}</p>
                  </div>
                  
                  {platform.active ? (
                    <Button className="mt-4 w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-secondary/20">
                      Baixar Agora
                    </Button>
                  ) : (
                    <div className="mt-4 w-full h-12 flex items-center justify-center border border-border/50 rounded-xl">
                       <span className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/30">Em Breve</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20 px-8 border-t border-border/20 bg-muted/5">
          <div className="mx-auto max-w-5xl text-center space-y-12">
            <h3 className="text-2xl font-black uppercase tracking-tight">Segurança Hádron</h3>
            <div className="flex flex-wrap justify-center gap-10">
              <div className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-card border border-border/50 w-full md:w-64">
                <Shield className="h-8 w-8 text-secondary" />
                <span className="font-black uppercase tracking-widest text-[10px]">Criptografia Militar</span>
              </div>
              <div className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-card border border-border/50 w-full md:w-64">
                <Lock className="h-8 w-8 text-secondary" />
                <span className="font-black uppercase tracking-widest text-[10px]">Controle de Acesso</span>
              </div>
              <div className="flex flex-col items-center gap-4 p-6 rounded-3xl bg-card border border-border/50 w-full md:w-64">
                <UserCheck className="h-8 w-8 text-secondary" />
                <span className="font-black uppercase tracking-widest text-[10px]">Autorização Local</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer info */}
        <div className="p-8 flex items-center justify-center border-t border-border/20 text-[10px] font-black text-muted-foreground/30 uppercase tracking-widest">
          © {new Date().getFullYear()} Hádron Suporte — Corporativo
        </div>
      </div>
    </div>
  );
}

