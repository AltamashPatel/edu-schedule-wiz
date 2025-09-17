import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import { ProtectedRoute } from "./components/layout/protected-route";
import Index from "./pages/Index";
import Login from "./pages/auth/login";
import Dashboard from "./pages/dashboard";
import Timetables from "./pages/timetables";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component is rendering");
  return (
    <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/timetables" element={
            <ProtectedRoute>
              <Timetables />
            </ProtectedRoute>
          } />
          <Route path="/timetables/create" element={
            <ProtectedRoute allowedRoles={['admin', 'faculty']}>
              <Timetables />
            </ProtectedRoute>
          } />
          <Route path="/timetables/review" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Timetables />
            </ProtectedRoute>
          } />
          <Route path="/faculty" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/classrooms" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/subjects" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/batches" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/my-schedule" element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/availability" element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/schedule" element={
            <ProtectedRoute allowedRoles={['student']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
