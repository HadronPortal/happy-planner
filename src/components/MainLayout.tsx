import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useLocation } from "react-router-dom";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isDownloadPage = location.pathname === "/";

  // Don't show sidebar on the landing page if desired
  if (isDownloadPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background/95 backdrop-blur-3xl">
        <AppSidebar />
        <SidebarInset className="flex-1 bg-transparent p-6">
          <div className="mx-auto max-w-7xl h-full">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
