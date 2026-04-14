import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-auto relative p-4 md:p-8">
          <div className="mx-auto max-w-7xl h-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
