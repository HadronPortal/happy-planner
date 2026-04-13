import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { ShieldCheck, LayoutDashboard, MessageSquare, Download, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logoSrc from "@/assets/logo.png";

const items = [
  {
    title: "Download",
    url: "/",
    icon: Download,
  },
  {
    title: "Suporte",
    url: "/suporte",
    icon: MessageSquare,
  },
  {
    title: "Painel Admin",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Módulo Técnico",
    url: "/tecnico",
    icon: ShieldCheck,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border/50 bg-card/80 backdrop-blur-xl">
      <SidebarContent>
        <div className="p-6 mb-4 flex items-center gap-3">
          <img src={logoSrc} alt="Hádron" className="h-8 object-contain" />
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">Hádron</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Suporte</span>
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60 px-4 mb-2">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="h-11 px-4 transition-all hover:bg-secondary/10 hover:text-secondary data-[active=true]:bg-secondary/10 data-[active=true]:text-secondary data-[active=true]:font-bold"
                  >
                    <button onClick={() => navigate(item.url)} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto p-4 border-t border-border/40">
        <button 
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
          onClick={() => navigate("/")}
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      </div>
    </Sidebar>
  );
}
