import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "@/contexts/DataContext";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Goals from "./pages/Goals";
import Bills from "./pages/Bills";
import Debts from "./pages/Debts";
import Insights from "./pages/Insights";
import ChallengePage from "./pages/Challenge";
import Settings from "./pages/Settings";

import FinanceChatbot from "./components/FinanceChatbot";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/debts" element={<Debts />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/challenge" element={<ChallengePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
    
          <FinanceChatbot />
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
