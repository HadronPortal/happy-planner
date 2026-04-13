import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import { X, MessageSquare, Download, UserCog, ShieldCheck } from "lucide-react";
import logoSrc from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { title: "Suporte", url: "/suporte", icon: MessageSquare },
  { title: "Download", url: "/download", icon: Download },
  { title: "Técnico", url: "/tecnico", icon: UserCog },
  { title: "Admin", url: "/admin", icon: ShieldCheck },
];

interface PageHeaderProps {
  showClose?: boolean;
  onClose?: () => void;
  extra?: React.ReactNode;
}

export function PageHeader({ showClose = true, onClose, extra }: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img src={logoSrc} alt="Hádron" className="h-5 object-contain" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              className={({ isActive }) => cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                isActive 
                  ? "bg-secondary text-secondary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {extra}
        
        {/* Mobile Nav (simple) */}
        <div className="flex md:hidden items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              title={item.title}
              className={({ isActive }) => cn(
                "p-2 rounded-md transition-all",
                isActive 
                  ? "bg-secondary text-secondary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
            </NavLink>
          ))}
        </div>

        {showClose && (
          <button
            onClick={onClose || (() => window.close())}
            className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors ml-2"
            title="Fechar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
