import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Settings,
  Plus,
  Eye,
  Edit
} from "lucide-react";

export default function OwnerDashboard() {
  // Mock owner stats
  const ownerStats = [
    {
      title: "Total Bookings",
      value: "156",
      change: "+23%",
      icon: Calendar,
      color: "text-primary"
    },
    {
      title: "Monthly Revenue",
      value: "₹84,200",
      change: "+₹12K",
      icon: DollarSign,
      color: "text-secondary"
    },
    {
      title: "Active Courts",
      value: "8",
      change: "+2",
      icon: MapPin,
      color: "text-accent"
    },
    {
      title: "Average Rating",
      value: "4.7",
      change: "+0.3",
      icon: Users,
      color: "text-primary"
    }
  ];

  // Mock facilities data
  const facilities = [
    {
      id: "1",
      name: "Elite Sports Complex",
      location: "Downtown Mumbai",
      courts: 4,
      sports: ["Badminton", "Tennis"],
      status: "active",
      bookings: 45,
      revenue: 36000,
      rating: 4.8
    },
    {
      id: "2",
      name: "Metro Sports Arena",
      location: "Andheri East", 
      courts: 3,
      sports: ["Basketball", "Volleyball"],
      status: "active",
      bookings: 32,
      revenue: 19200,
      rating: 4.5
    }
  ];

  // Mock recent bookings
  const recentBookings = [
    {
      id: "1",
      user: "Rahul Sharma",
      facility: "Elite Sports Complex",
      court: "Badminton Court A",
      date: "2024-01-15",
      time: "18:00 - 19:00",
      status: "confirmed",
      amount: 800
    },
    {
      id: "2",
      user: "Priya Patel",
      facility: "Elite Sports Complex", 
      court: "Tennis Court 1",
      date: "2024-01-15",
      time: "16:00 - 17:30",
      status: "confirmed",
      amount: 1200
    },
    {
      id: "3",
      user: "Amit Kumar",
      facility: "Metro Sports Arena",
      court: "Basketball Court",
      date: "2024-01-14", 
      time: "19:00 - 20:00",
      status: "completed",
      amount: 600
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-primary/10 text-primary">Active</Badge>;
      case "confirmed":
        return <Badge className="bg-primary/10 text-primary">Confirmed</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole="facility_owner" userName="Rajesh Gupta" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Facility Dashboard 🏟️</h1>
            <p className="text-muted-foreground">Manage your sports facilities and bookings</p>
          </div>
          <Button variant="hero">
            <Plus size={16} className="mr-2" />
            Add New Facility
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {ownerStats.map((stat, index) => (
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
          {/* Facilities Management */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Facilities</CardTitle>
                    <CardDescription>Manage your sports facilities</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings size={16} className="mr-2" />
                    Settings
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="facilities" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="facilities">Facilities ({facilities.length})</TabsTrigger>
                    <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="facilities" className="space-y-4">
                    {facilities.map((facility) => (
                      <Card key={facility.id} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{facility.name}</h4>
                                {getStatusBadge(facility.status)}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center">
                                    <MapPin size={14} className="mr-1" />
                                    {facility.location}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar size={14} className="mr-1" />
                                    {facility.courts} courts
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {facility.sports.map((sport, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {sport}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <div className="text-sm">
                                <div className="font-semibold">₹{facility.revenue.toLocaleString()}</div>
                                <div className="text-muted-foreground">{facility.bookings} bookings</div>
                              </div>
                              <div className="flex space-x-1">
                                <Button variant="outline" size="sm">
                                  <Eye size={14} className="mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit size={14} className="mr-1" />
                                  Edit
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="bookings" className="space-y-4">
                    {recentBookings.map((booking) => (
                      <Card key={booking.id} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{booking.user}</h4>
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div>{booking.facility}</div>
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center">
                                    <MapPin size={14} className="mr-1" />
                                    {booking.court}
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
                              <div className="font-semibold">₹{booking.amount}</div>
                              <Button variant="outline" size="sm" className="mt-2">
                                View Details
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

          {/* Quick Actions & Analytics */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="sport" className="w-full justify-start">
                  <Plus size={16} className="mr-2" />
                  Add New Court
                </Button>
                <Button variant="sport" className="w-full justify-start">
                  <Calendar size={16} className="mr-2" />
                  Manage Time Slots
                </Button>
                <Button variant="sport" className="w-full justify-start">
                  <BarChart3 size={16} className="mr-2" />
                  View Analytics
                </Button>
                <Button variant="sport" className="w-full justify-start">
                  <Settings size={16} className="mr-2" />
                  Facility Settings
                </Button>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>This Month</CardTitle>
                <CardDescription>Performance overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenue Target</span>
                    <span className="text-sm font-medium">₹84K / ₹100K</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Booking Rate</span>
                    <span className="text-sm font-medium">76%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <Button variant="outline" className="w-full">
                    <TrendingUp size={16} className="mr-2" />
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}