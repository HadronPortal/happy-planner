import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Suporte from "./pages/Suporte.tsx";
import Download from "./pages/Download.tsx";
import Admin from "./pages/Admin.tsx";
import Tecnico from "./pages/Tecnico.tsx";
import NotFound from "./pages/NotFound.tsx";

import { MainLayout } from "./components/MainLayout.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Index /></MainLayout>} />
          <Route path="/suporte" element={<MainLayout><Suporte /></MainLayout>} />
          <Route path="/download" element={<MainLayout><Download /></MainLayout>} />
          <Route path="/tecnico" element={<MainLayout><Tecnico /></MainLayout>} />
          <Route path="/admin" element={<MainLayout><Admin /></MainLayout>} />
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
