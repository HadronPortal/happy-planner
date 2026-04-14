import { Link, useLocation } from "react-router-dom";
import { 
  Download, 
  UserCog, 
  MessageSquare,
  ShieldCheck,
  Home,
  X,
  Minimize2,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { title: "Início", url: "/", icon: Home },
  { title: "Suporte", url: "/suporte", icon: MessageSquare },
  { title: "Downloads", url: "/download", icon: Download },
  { title: "Técnico", url: "/tecnico", icon: UserCog },
  { title: "Painel", url: "/admin", icon: ShieldCheck },
];

export function AppWindow({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-screen items-center justify-center bg-background/50 p-2 md:p-6 overflow-hidden">
      {/* Desktop Background (Optional hint) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05]" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--secondary)) 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }} />

      <div className="w-full max-w-5xl h-[85vh] md:h-[80vh] flex flex-col rounded-2xl border border-border/50 bg-card shadow-2xl shadow-black/60 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Title Bar (Native feel) */}
        <div className="h-10 border-b border-border/40 bg-muted/20 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500 transition-colors" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 hover:bg-yellow-500 transition-colors" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 hover:bg-green-500 transition-colors" />
            </div>
            <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Hádron Suporte Técnico</span>
          </div>
          
          <div className="flex items-center gap-3">
             <Minimize2 className="h-3 w-3 text-muted-foreground/50" />
             <Maximize2 className="h-3 w-3 text-muted-foreground/50" />
             <X className="h-3.5 w-3.5 text-muted-foreground/50" />
          </div>
        </div>

        {/* Main Interface Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Internal Sidebar */}
          <aside className="w-16 md:w-56 bg-muted/10 border-r border-border/30 flex flex-col shrink-0">
            <nav className="flex-1 p-3 space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                      isActive 
                        ? "bg-secondary/10 text-secondary shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                        : "text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
                    <span className={cn("hidden md:block text-xs font-bold tracking-wide", isActive ? "text-foreground" : "")}>{item.title}</span>
                    
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-secondary rounded-r-full shadow-[0_0_8px_hsl(var(--secondary))]" />
                    )}
                  </Link>
                );
              })}
            </nav>
            
            <div className="p-4 border-t border-border/20 text-[9px] text-muted-foreground/30 font-mono text-center">
              V 2.5.0
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 overflow-auto relative bg-background/20 backdrop-blur-sm">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
