import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import VenuesPage from "./pages/VenuesPage";
import UserDashboard from "./pages/UserDashboard";
import MyBookings from "./pages/MyBookings";
import UserProfile from "./pages/UserProfile";
import BookingPage from "./pages/BookingPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Authentication Routes - Show first */}
          <Route path="/" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          
          {/* Protected Routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/venues" element={<VenuesPage />} />
          
          {/* User Routes - After Login */}
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/book" element={<BookingPage />} />
          
          {/* Facility Owner Routes */}
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/facilities" element={<OwnerDashboard />} />
          <Route path="/owner/bookings" element={<OwnerDashboard />} />
          <Route path="/owner/settings" element={<OwnerDashboard />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/facilities" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
