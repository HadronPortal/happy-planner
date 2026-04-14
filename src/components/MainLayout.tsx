import { AppWindow } from "./AppWindow";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#0a0c10] overflow-hidden">
      <AppWindow>
        {children}
      </AppWindow>
    </div>
  );
}
