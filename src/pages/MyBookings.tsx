import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Star,
  Activity,
  Filter,
  Search,
  X,
  Download,
  MoreHorizontal
} from "lucide-react";

export default function MyBookings() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock bookings data - will come from backend later
  const upcomingBookings = [
    {
      id: "1",
      venue: "Elite Sports Complex",
      sport: "Badminton",
      court: "Court A",
      date: "2024-01-15",
      time: "18:00 - 19:00",
      status: "confirmed",
      price: 800,
      bookingId: "QC001234"
    },
    {
      id: "2",
      venue: "Champions Tennis Club", 
      sport: "Tennis",
      court: "Court 2",
      date: "2024-01-17",
      time: "16:00 - 17:30",
      status: "confirmed",
      price: 1200,
      bookingId: "QC001235"
    }
  ];

  const pastBookings = [
    {
      id: "3",
      venue: "Metro Basketball Arena",
      sport: "Basketball",
      court: "Main Court",
      date: "2024-01-10",
      time: "19:00 - 20:00", 
      status: "completed",
      price: 600,
      rating: 5,
      bookingId: "QC001230"
    },
    {
      id: "4",
      venue: "Elite Sports Complex",
      sport: "Badminton",
      court: "Court B",
      date: "2024-01-08",
      time: "17:00 - 18:00",
      status: "completed", 
      price: 800,
      rating: 4,
      bookingId: "QC001231"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Confirmed</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const BookingCard = ({ booking, showActions = true }: { booking: any, showActions?: boolean }) => (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <h4 className="font-semibold text-lg">{booking.venue}</h4>
              {getStatusBadge(booking.status)}
            </div>
            <div className="text-sm text-muted-foreground">
              Booking ID: {booking.bookingId}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">₹{booking.price}</div>
            <div className="text-sm text-muted-foreground">Total Amount</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <Activity className="text-primary" size={20} />
            <div>
              <div className="font-medium">{booking.sport}</div>
              <div className="text-sm text-muted-foreground">{booking.court}</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <Calendar className="text-primary" size={20} />
            <div>
              <div className="font-medium">{new Date(booking.date).toLocaleDateString()}</div>
              <div className="text-sm text-muted-foreground">Booking Date</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <Clock className="text-primary" size={20} />
            <div>
              <div className="font-medium">{booking.time}</div>
              <div className="text-sm text-muted-foreground">Time Slot</div>
            </div>
          </div>
        </div>
        
        {booking.rating && (
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm text-muted-foreground">Your Rating:</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < booking.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                />
              ))}
            </div>
          </div>
        )}
        
        {showActions && (
          <div className="flex flex-wrap gap-2">
            {booking.status === "confirmed" && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to cancel this booking?')) {
                      alert('Booking cancelled successfully. Refund will be processed within 5-7 business days.');
                    }
                  }}
                >
                  <X size={16} className="mr-2" />
                  Cancel Booking
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    alert('Reschedule request submitted. You will receive a call from our team within 30 minutes to confirm new slot.');
                  }}
                >
                  Reschedule
                </Button>
              </>
            )}
            {booking.status === "completed" && !booking.rating && (
              <Button variant="outline" size="sm">
                <Star size={16} className="mr-2" />
                Rate & Review
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Generate receipt content
                const receiptContent = `
QUICKCOURT BOOKING RECEIPT
========================
Booking ID: ${booking.bookingId}
Venue: ${booking.venue}
Sport: ${booking.sport}
Court: ${booking.court || 'Main Court'}
Date: ${new Date(booking.date).toLocaleDateString()}
Time: ${booking.time}
Amount: ₹${booking.price}
Status: ${booking.status}
========================
Thank you for choosing QuickCourt!
                `;
                
                // Create downloadable file
                const blob = new Blob([receiptContent], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `QuickCourt_Receipt_${booking.bookingId}.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                alert('Receipt downloaded successfully!');
              }}
            >
              <Download size={16} className="mr-2" />
              Download Receipt
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole="user" userName="Current User" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Track and manage all your court reservations</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{upcomingBookings.length}</div>
              <div className="text-sm text-muted-foreground">Upcoming</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-secondary mb-1">{pastBookings.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-accent mb-1">48</div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">₹18,400</div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search bookings by venue, sport, or booking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter size={16} className="mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Tabs */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
            <CardDescription>View and manage your court bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList className="w-full">
                <TabsTrigger value="upcoming" className="flex-1">
                  Upcoming Bookings ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="flex-1">
                  Past Bookings ({pastBookings.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <div className="space-y-4">
                  {upcomingBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="mx-auto mb-4 text-muted-foreground" size={48} />
                      <h3 className="text-lg font-medium mb-2">No upcoming bookings</h3>
                      <p className="text-muted-foreground mb-4">Start booking your favorite courts!</p>
                      <Button>Browse Venues</Button>
                    </div>
                  ) : (
                    upcomingBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="past">
                <div className="space-y-4">
                  {pastBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity className="mx-auto mb-4 text-muted-foreground" size={48} />
                      <h3 className="text-lg font-medium mb-2">No past bookings</h3>
                      <p className="text-muted-foreground">Your booking history will appear here</p>
                    </div>
                  ) : (
                    pastBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}