import { PageHeader } from "./PageHeader";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background overflow-hidden">
      <PageHeader showClose={false} />
      <main className="flex-1 overflow-auto relative p-4 md:p-8">
        <div className="mx-auto max-w-7xl h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
