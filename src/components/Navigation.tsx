import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotificationBar } from "@/components/NotificationBar";
import { 
  Home, 
  MapPin, 
  Calendar, 
  User, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NavigationProps {
  userRole?: "user" | "facility_owner" | "admin";
  userName?: string;
}

export function Navigation({ userRole = "user", userName = "Guest User" }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  const getUserNavItems = () => {
    switch (userRole) {
      case "facility_owner":
        return [
          { icon: BarChart3, label: "Dashboard", path: "/owner/dashboard" },
          { icon: MapPin, label: "Facilities", path: "/owner/facilities" },
          { icon: Calendar, label: "Bookings", path: "/owner/bookings" },
          { icon: Settings, label: "Settings", path: "/owner/settings" },
        ];
      case "admin":
        return [
          { icon: BarChart3, label: "Dashboard", path: "/admin/dashboard" },
          { icon: MapPin, label: "Facilities", path: "/admin/facilities" },
          { icon: User, label: "Users", path: "/admin/users" },
          { icon: Settings, label: "Settings", path: "/admin/settings" },
        ];
      default:
        return [
          { icon: Home, label: "Home", path: "/home" },
          { icon: MapPin, label: "Venues", path: "/venues" },
          { icon: Calendar, label: "My Bookings", path: "/bookings" },
          { icon: User, label: "Profile", path: "/profile" },
        ];
    }
  };

  const navItems = getUserNavItems();

const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">Q</span>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              QuickCourt
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-smooth ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <NotificationBar />
            
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-sm font-medium">{userName}</p>
                <Badge variant="secondary" className="text-xs">
                  {userRole?.replace('_', ' ') || 'User'}
                </Badge>
              </div>
              
              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut size={18} />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-smooth ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
            
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{userName}</p>
                  <Badge variant="secondary" className="text-xs">
                    {userRole?.replace('_', ' ') || 'User'}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}