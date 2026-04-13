import { useLocation } from "react-router-dom";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isDownloadPage = location.pathname === "/";

  // Standard layout without sidebar
  return (
    <div className="min-h-screen w-full bg-background/95 backdrop-blur-3xl">
      <div className="mx-auto max-w-7xl h-full">
        {children}
      </div>
    </div>
  );
}