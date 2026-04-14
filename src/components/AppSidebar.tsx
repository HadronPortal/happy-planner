import { 
  Download, 
  UserCog, 
  MessageSquare,
  ShieldCheck,
  Home,
  Settings,
  HelpCircle
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoSrc from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Suporte", url: "/suporte", icon: MessageSquare },
  { title: "Download", url: "/download", icon: Download },
  { title: "Técnico", url: "/tecnico", icon: UserCog },
  { title: "Admin", url: "/admin", icon: ShieldCheck },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-16 md:w-20 lg:w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0 z-50 transition-all duration-300">
      <div className="p-4 flex items-center justify-center lg:justify-start gap-3 h-16 border-b border-border/50">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all">
          <div className="bg-secondary/10 p-2 rounded-lg">
            <img src={logoSrc} alt="Hádron" className="h-5 w-5 object-contain" />
          </div>
          <span className="hidden lg:block font-extrabold text-sm tracking-[0.2em] text-foreground uppercase">Hádron</span>
        </Link>
      </div>
      
      <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
        {items.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                isActive 
                  ? "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center justify-center min-w-[24px]">
                <item.icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", isActive ? "scale-110" : "")} />
              </div>
              <span className="hidden lg:block text-sm font-semibold tracking-wide truncate">{item.title}</span>
              
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary-foreground rounded-l-full" />
              )}
              
              {/* Tooltip for collapsed mode */}
              <div className="lg:hidden absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.title}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border/50 space-y-2">
        <button className="w-full flex items-center gap-4 px-3 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-all group">
          <Settings className="h-5 w-5" />
          <span className="hidden lg:block text-sm font-medium">Ajustes</span>
        </button>
        <button className="w-full flex items-center gap-4 px-3 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-all group">
          <HelpCircle className="h-5 w-5" />
          <span className="hidden lg:block text-sm font-medium">Ajuda</span>
        </button>
      </div>
    </aside>
  );
}
