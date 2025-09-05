import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
import Footer from "./components/Footer";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
};

// Auth Route Component (redirect to home if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return !isLoggedIn ? <>{children}</> : <Navigate to="/home" replace />;
};

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Small delay to ensure localStorage is checked
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Authentication Routes */}
            <Route path="/" element={
              <AuthRoute>
                <AuthPage />
              </AuthRoute>
            } />
            <Route path="/login" element={
              <AuthRoute>
                <AuthPage />
              </AuthRoute>
            } />
            <Route path="/signup" element={
              <AuthRoute>
                <AuthPage />
              </AuthRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/venues" element={
              <ProtectedRoute>
                <VenuesPage />
              </ProtectedRoute>
            } />
            
            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/bookings" element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/book" element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            } />
            
            {/* Facility Owner Routes */}
            <Route path="/owner/dashboard" element={
              <ProtectedRoute>
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/owner/facilities" element={
              <ProtectedRoute>
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/owner/bookings" element={
              <ProtectedRoute>
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/owner/settings" element={
              <ProtectedRoute>
                <OwnerDashboard />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/facilities" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
