import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/auth/login";
import Dashboard from "./pages/dashboard";
import Timetables from "./pages/timetables";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/timetables" element={<Timetables />} />
          <Route path="/timetables/create" element={<Timetables />} />
          <Route path="/timetables/review" element={<Timetables />} />
          <Route path="/faculty" element={<Dashboard />} />
          <Route path="/classrooms" element={<Dashboard />} />
          <Route path="/subjects" element={<Dashboard />} />
          <Route path="/batches" element={<Dashboard />} />
          <Route path="/reports" element={<Dashboard />} />
          <Route path="/settings" element={<Dashboard />} />
          <Route path="/my-schedule" element={<Dashboard />} />
          <Route path="/availability" element={<Dashboard />} />
          <Route path="/schedule" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
