import { useNavigate, useLocation } from "react-router-dom";
import { X, MessageSquare, Download, UserCog, ShieldCheck } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import logoSrc from "@/assets/logo.png";

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

  const currentValue = location.pathname === "/" ? "/suporte" : location.pathname;

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
      <div className="flex items-center gap-2">
        <img src={logoSrc} alt="Hádron" className="h-5 object-contain" />
        {extra}
      </div>
      <div className="flex items-center gap-2">
        <Select 
          value={currentValue} 
          onValueChange={(value) => navigate(value)}
        >
          <SelectTrigger className="h-8 min-w-[120px] px-3 border border-border bg-background/50 hover:bg-muted text-xs text-muted-foreground hover:text-foreground transition-all shadow-none focus:ring-1 focus:ring-secondary/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" className="w-48 bg-card border-border">
            {NAV_ITEMS.map((item) => (
              <SelectItem key={item.title} value={item.url} className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showClose && (
          <button
            onClick={onClose || (() => window.close())}
            className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
            title="Fechar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
