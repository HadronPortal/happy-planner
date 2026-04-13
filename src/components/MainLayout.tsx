import { useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background border-r border-border/10">
        <AppSidebar />
        <main className="flex-1 overflow-auto relative">
          <div className="p-4 md:p-8">
            <SidebarTrigger className="mb-4" />
            <div className="mx-auto max-w-7xl h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}