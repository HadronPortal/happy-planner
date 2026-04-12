import { Download, Shield, Lock, UserCheck, Headphones, Monitor, ArrowDown, CheckCircle2 } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const APP_VERSION = "1.0.0";

const steps = [
  {
    number: "01",
    icon: ArrowDown,
    title: "Baixe o aplicativo",
    description: "Faça o download do executável direto para o seu computador",
  },
  {
    number: "02",
    icon: Monitor,
    title: "Abra o HÁDRON SUPORTE",
    description: "O sistema gera automaticamente seu ID de atendimento",
  },
  {
    number: "03",
    icon: Headphones,
    title: "Informe o ID ao técnico",
    description: "Nossa equipe acessa seu computador com total segurança",
  },
];

const securityItems = [
  { icon: Shield, label: "Conexão segura" },
  { icon: Lock, label: "Criptografia de ponta" },
  { icon: UserCheck, label: "Acesso autorizado" },
  { icon: Headphones, label: "Suporte especializado" },
];

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background grid */}
      <div className="fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--secondary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10">
        {/* Hero */}
        <section className="px-4 pt-12 pb-6 sm:pt-16 sm:pb-10">
          <div className="mx-auto max-w-2xl text-center">
            <img src={logoSrc} alt="Hádron Suporte" className="mx-auto h-16 sm:h-20 object-contain mb-6" />
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
              Download do suporte remoto
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto">
              Baixe o aplicativo e informe o ID ao nosso técnico para iniciar o atendimento
            </p>
          </div>
        </section>

        {/* Main download card */}
        <section className="px-4 pb-10 sm:pb-14">
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-black/40 overflow-hidden">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent" />

              <div className="px-6 py-8 sm:px-8 sm:py-10 text-center space-y-5">
                {/* Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 border border-secondary/20">
                  <Download className="h-8 w-8 text-secondary" />
                </div>

                <div>
                  <h2 className="text-xl font-bold tracking-wide mb-1">HÁDRON SUPORTE</h2>
                  <p className="text-xs text-muted-foreground">Versão {APP_VERSION}</p>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center justify-center gap-1.5">
                    <Monitor className="h-3.5 w-3.5" /> Windows 10 e 11
                  </p>
                  <p className="flex items-center justify-center gap-1.5">
                    <Shield className="h-3.5 w-3.5" /> Download rápido e seguro
                  </p>
                  <p className="flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[hsl(var(--status-connected))]" /> Não é necessário instalar
                  </p>
                </div>

                <p className="text-[11px] text-muted-foreground/70">
                  Basta abrir o aplicativo e informar o ID gerado
                </p>

                {/* Download button */}
                <Button
                  className="w-full h-14 text-base font-bold gap-2.5 bg-primary text-primary-foreground hover:bg-primary/85 transition-colors"
                  onClick={() => {
                    // Future: real download link
                    window.open("#", "_self");
                  }}
                >
                  <Download className="h-5 w-5" />
                  Baixar HÁDRON SUPORTE
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="px-4 pb-10 sm:pb-14">
          <div className="mx-auto max-w-3xl">
            <h3 className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-8">
              Como funciona
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-xl border border-border bg-card/60 px-5 py-6 text-center space-y-3 hover:border-secondary/30 transition-colors"
                >
                  <span className="text-[10px] font-bold tracking-[0.3em] text-secondary">
                    PASSO {step.number}
                  </span>
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                    <step.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h4 className="text-sm font-semibold">{step.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security block */}
        <section className="px-4 pb-12 sm:pb-16">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-xl border border-border/50 bg-muted/20 px-6 py-6 sm:px-8">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-4">
                {securityItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <item.icon className="h-3.5 w-3.5 text-secondary/70" />
                    {item.label}
                  </div>
                ))}
              </div>
              <p className="text-center text-[11px] text-muted-foreground/60 leading-relaxed">
                Seu acesso é protegido e realizado somente por nossa equipe técnica autorizada.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/30 px-4 py-4">
          <p className="text-center text-[10px] text-muted-foreground/50">
            © {new Date().getFullYear()} Hádron Suporte — Todos os direitos reservados
          </p>
        </footer>
      </div>
    </div>
  );
}
