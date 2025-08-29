import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { VenueCard } from "@/components/VenueCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Star,
  TrendingUp,
  Activity,
  CreditCard,
  Filter,
  Search
} from "lucide-react";
import venueBadminton from "@/assets/venue-badminton.jpg";
import venueTennis from "@/assets/venue-tennis.jpg";

export default function UserDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  // Tamil Nadu districts
  const districts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode",
    "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
    "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet",
    "Salem", "Sivagangai", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", 
    "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", 
    "Viluppuram", "Virudhunagar"
  ];

  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    // Search in districts AND court names
    const results = [];
    
    districts.forEach(district => {
      // Check if district matches query
      if (district.toLowerCase().includes(query.toLowerCase())) {
        // Add all courts from this district
        for (let i = 1; i <= 10; i++) {
          results.push({
            id: `${district}-${i}`,
            name: `${district} Sports Complex ${i}`,
            sport: ["Badminton", "Tennis", "Basketball", "Football"][i % 4],
            location: `${district}, Tamil Nadu`,
            price: Math.min(600, 400 + (i * 50)), // Keep prices ≤ 600
            rating: 4.2 + (i * 0.1),
            image: venueBadminton,
            amenities: ["AC", "Parking", "Lockers"],
            availability: "Available"
          });
        }
      }
    });
    
    // Also search by court names
    const courtSearchResults = [];
    const searchTerm = query.toLowerCase();
    districts.forEach(district => {
      for (let i = 1; i <= 10; i++) {
        const courtName = `${district} Sports Complex ${i}`;
        if (courtName.toLowerCase().includes(searchTerm)) {
          courtSearchResults.push({
            id: `${district}-${i}`,
            name: courtName,
            sport: ["Badminton", "Tennis", "Basketball", "Football"][i % 4],
            location: `${district}, Tamil Nadu`,
            price: Math.min(600, 400 + (i * 50)),
            rating: 4.2 + (i * 0.1),
            image: venueBadminton,
            amenities: ["AC", "Parking", "Lockers"],
            availability: "Available"
          });
        }
      }
    });
    
    // Combine and deduplicate results
    const allResults = [...results, ...courtSearchResults];
    const uniqueResults = allResults.filter((result, index, self) => 
      index === self.findIndex(r => r.id === result.id)
    );
    
    setSearchResults(uniqueResults.slice(0, 20));
  };

  // Mock user stats
  const userStats = [
    {
      title: "Total Bookings",
      value: "24",
      change: "+12%",
      icon: Calendar,
      color: "text-primary"
    },
    {
      title: "Active Courts",
      value: "3",
      change: "+2",
      icon: MapPin,
      color: "text-secondary"
    },
    {
      title: "Hours Played",
      value: "48",
      change: "+8hrs",
      icon: Clock,
      color: "text-accent"
    },
    {
      title: "Total Spent",
      value: "₹18,400",
      change: "+₹2,400",
      icon: CreditCard,
      color: "text-primary"
    }
  ];

  // Mock bookings data
  const upcomingBookings = [
    {
      id: "1",
      venue: "Elite Sports Complex",
      sport: "Badminton",
      court: "Court A",
      date: "2024-01-15",
      time: "18:00 - 19:00",
      status: "confirmed",
      price: 800
    },
    {
      id: "2",
      venue: "Champions Tennis Club", 
      sport: "Tennis",
      court: "Court 2",
      date: "2024-01-17",
      time: "16:00 - 17:30",
      status: "confirmed",
      price: 1200
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
      rating: 5
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
      rating: 4
    }
  ];

  // Mock recommended venues
  const recommendedVenues = [
    {
      id: "1",
      name: "Elite Sports Complex",
      sport: "Badminton",
      location: "Downtown Mumbai",
      price: 800,
      rating: 4.8,
      image: venueBadminton,
      amenities: ["AC", "Parking", "Lockers"],
      availability: "Available"
    },
    {
      id: "2", 
      name: "Champions Tennis Club",
      sport: "Tennis",
      location: "Bandra West",
      price: 1200,
      rating: 4.7,
      image: venueTennis,
      amenities: ["Professional Courts", "Coaching", "Equipment"],
      availability: "Available"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-primary/10 text-primary">Confirmed</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole="user" userName="Current User" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your bookings</p>
          
          {/* District Search */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Enter district name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Search Results ({searchResults.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((venue) => (
                <VenueCard
                  key={venue.id}
                  {...venue}
                  onBook={(id) => console.log(`Booking venue ${id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {userStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-card transition-smooth border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`${stat.color} h-5 w-5`} />
                  <Badge variant="outline" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookings Section */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Bookings</CardTitle>
                    <CardDescription>Manage your court reservations</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="upcoming" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
                    <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upcoming" className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking.id} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{booking.venue}</h4>
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center">
                                    <Activity size={14} className="mr-1" />
                                    {booking.sport} - {booking.court}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar size={14} className="mr-1" />
                                    {new Date(booking.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <Clock size={14} className="mr-1" />
                                  {booking.time}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">₹{booking.price}</div>
                              <Button variant="outline" size="sm" className="mt-2">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="past" className="space-y-4">
                    {pastBookings.map((booking) => (
                      <Card key={booking.id} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{booking.venue}</h4>
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center">
                                    <Activity size={14} className="mr-1" />
                                    {booking.sport} - {booking.court}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar size={14} className="mr-1" />
                                    {new Date(booking.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center">
                                    <Clock size={14} className="mr-1" />
                                    {booking.time}
                                  </span>
                                  {booking.rating && (
                                    <span className="flex items-center">
                                      <Star size={14} className="mr-1 text-yellow-500 fill-yellow-500" />
                                      {booking.rating}/5
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">₹{booking.price}</div>
                              <Button variant="outline" size="sm" className="mt-2">
                                Rate & Review
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Venues */}
          <div>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your booking history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedVenues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    {...venue}
                    onBook={(id) => console.log(`Booking venue ${id}`)}
                  />
                ))}
                <Button variant="outline" className="w-full">
                  <TrendingUp size={16} className="mr-2" />
                  Explore More Venues
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}