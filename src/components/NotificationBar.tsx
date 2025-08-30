import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function NotificationBar() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get bookings from localStorage to generate dynamic notifications
  const getBookingNotifications = () => {
    try {
      const bookingsData = localStorage.getItem('userBookings');
      const bookings = bookingsData ? JSON.parse(bookingsData) : [];
      
      const notifications: Notification[] = [];
      
      // Create notifications for recent bookings
      bookings.forEach((booking: any, index: number) => {
        if (booking.status === 'confirmed') {
          notifications.push({
            id: `booking-${booking.id}`,
            type: 'success' as const,
            title: 'Booking Confirmed',
            message: `Your ${booking.sport} court booking at ${booking.venue} has been confirmed for ${booking.date} ${booking.time}`,
            timestamp: new Date(Date.now() - index * 1000 * 60 * 30), // Stagger timestamps
            read: false
          });
        }
      });
      
      // Add some default notifications if no bookings
      if (notifications.length === 0) {
        notifications.push({
          id: "welcome",
          type: "info" as const,
          title: "Welcome to QuickCourt!",
          message: "Discover and book premium sports facilities near you",
          timestamp: new Date(),
          read: false
        });
      }
      
      return notifications;
    } catch {
      return [{
        id: "welcome",
        type: "info" as const,
        title: "Welcome to QuickCourt!",
        message: "Discover and book premium sports facilities near you",
        timestamp: new Date(),
        read: false
      }];
    }
  };

  const [notifications, setNotifications] = useState<Notification[]>(getBookingNotifications());

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      default: return Info;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Notifications {unreadCount > 0 && `(${unreadCount})`}</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const IconComponent = getIcon(notification.type);
                return (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b border-border/50 hover:bg-muted/50 transition-colors ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <IconComponent 
                        size={18} 
                        className={`mt-0.5 ${getIconColor(notification.type)}`} 
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium truncate">
                            {notification.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X size={12} />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 text-xs mt-1 p-1"
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Bell size={24} className="mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}