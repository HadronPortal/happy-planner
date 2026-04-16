import { Shield, Lock, UserCheck, Monitor, AlertTriangle } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import logo3Src from "@/assets/logo-3.png";
import { Button } from "@/components/ui/button";

const APP_VERSION = "1.0.0";
const RELEASE_DATE = "15.05.2024";

const platforms = [
  { icon: Monitor, label: "Windows", version: "x64", active: true },
];

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      <div className="relative">
        {/* Header/Hero */}
        <section className="px-4 pt-16 pb-12 text-center">
          <div className="mx-auto max-w-3xl">
            <img src={logoSrc} alt="Hádron Suporte" className="mx-auto h-16 mb-8" />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
              Download do Hádron Suporte
            </h1>
            
            {/* Warning Banner - RustDesk style */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto flex gap-3 text-left">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800">
                Atenção ao aspecto de segurança ao baixar software de assistência remota. 
                Há um aumento no número de <strong>golpes</strong> e <strong>casos de fraude</strong> online. 
                Por favor, seja particularmente cuidadoso e forneça acesso apenas a técnicos autorizados da Hádron.
              </p>
            </div>

            <div className="inline-block bg-slate-100 rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 mb-10">
              Versão atual: <span className="text-slate-900 font-bold">{APP_VERSION}</span> (atualizado em: {RELEASE_DATE})
            </div>
          </div>
        </section>

        {/* Platform Grid */}
        <section className="px-4 pb-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xl font-bold mb-8 text-center text-slate-800">Selecione o arquivo para download:</h2>
            <div className="flex justify-center">
              {platforms.map((platform) => (
                <div 
                  key={platform.label}
                  className={`group relative rounded-xl border-2 transition-all p-6 text-center flex flex-col items-center gap-4 ${
                    platform.active 
                    ? "border-secondary bg-white shadow-lg hover:shadow-xl cursor-pointer" 
                    : "border-slate-200 bg-slate-50 opacity-60 grayscale cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (platform.active) {
                      // Real download logic here
                      console.log(`Downloading for ${platform.label}`);
                    }
                  }}
                >
                  <div className={`p-4 rounded-2xl ${platform.active ? "bg-secondary/10 text-secondary" : "bg-slate-200 text-slate-400"}`}>
                    <platform.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{platform.label}</h3>
                    <p className="text-xs text-slate-500 font-medium">{platform.version}</p>
                  </div>
                  {platform.active ? (
                    <Button variant="outline" className="mt-2 w-full border-secondary text-secondary hover:bg-secondary hover:text-white font-bold">
                      Baixar Agora
                    </Button>
                  ) : (
                    <span className="mt-2 text-[10px] uppercase tracking-wider font-bold text-slate-400">Em Breve</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Instructions */}
        <section className="bg-white border-y border-slate-200 py-20 px-4">
          <div className="mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold text-center mb-12">Como iniciar o suporte</h3>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl italic">1</div>
                <h4 className="font-bold">Baixe o Executável</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Clique no botão de download para a sua plataforma e salve o arquivo.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl italic">2</div>
                <h4 className="font-bold">Abra o Aplicativo</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Não precisa instalar. Basta abrir e ele gerará um ID de atendimento único.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xl italic">3</div>
                <h4 className="font-bold">Informe seu ID</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Passe o ID ao nosso técnico e aguarde o início da conexão segura.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center gap-2 text-slate-600">
                <Shield className="h-5 w-5 text-secondary" />
                <span className="font-semibold">Criptografia Ponta-a-Ponta</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Lock className="h-5 w-5 text-secondary" />
                <span className="font-semibold">Acesso via Senha/ID</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <UserCheck className="h-5 w-5 text-secondary" />
                <span className="font-semibold">Sempre Autorizado</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              Nossa ferramenta é baseada em protocolos de segurança avançados para garantir que sua privacidade 
              seja mantida durante todo o processo de suporte técnico.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-12 px-4">
          <div className="mx-auto max-w-5xl flex flex-col md:flex-row justify-between items-center gap-6">
            <img src={logoSrc} alt="Hádron Suporte" className="h-8 grayscale brightness-200" />
            <p className="text-xs">
              © {new Date().getFullYear()} Hádron Suporte — Soluções em Tecnologia. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-xs font-medium">
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Suporte</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

