import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Building,
  UserCheck,
  Ban,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star
} from "lucide-react";

export default function AdminDashboard() {
  // Mock admin stats
  const adminStats = [
    {
      title: "Total Users",
      value: "12,847",
      change: "+1.2K",
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Active Facilities",
      value: "284",
      change: "+23",
      icon: Building,
      color: "text-secondary"
    },
    {
      title: "Monthly Bookings",
      value: "8,432",
      change: "+18%",
      icon: Calendar,
      color: "text-accent"
    },
    {
      title: "Platform Revenue",
      value: "₹2.4M",
      change: "+₹320K",
      icon: DollarSign,
      color: "text-primary"
    }
  ];

  // Mock pending facilities
  const pendingFacilities = [
    {
      id: "1",
      name: "Supreme Sports Hub",
      owner: "Vikram Singh",
      location: "Pune, Maharashtra",
      sports: ["Cricket", "Football"],
      courts: 6,
      submittedDate: "2024-01-10",
      status: "pending"
    },
    {
      id: "2", 
      name: "Golden Badminton Center",
      owner: "Sunita Sharma",
      location: "Bengaluru, Karnataka",
      sports: ["Badminton"],
      courts: 8,
      submittedDate: "2024-01-12",
      status: "pending"
    }
  ];

  // Mock user management data
  const recentUsers = [
    {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul@email.com",
      role: "user",
      joinDate: "2024-01-10",
      bookings: 12,
      status: "active",
      lastActive: "2 hours ago"
    },
    {
      id: "2",
      name: "Priya Patel", 
      email: "priya@email.com",
      role: "facility_owner",
      joinDate: "2024-01-08",
      bookings: 0,
      facilities: 2,
      status: "active",
      lastActive: "1 day ago"
    },
    {
      id: "3",
      name: "Amit Kumar",
      email: "amit@email.com", 
      role: "user",
      joinDate: "2024-01-05",
      bookings: 25,
      status: "flagged",
      lastActive: "3 days ago"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-primary/10 text-primary">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-700">Pending</Badge>;
      case "approved":
        return <Badge className="bg-green-500/10 text-green-700">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "flagged":
        return <Badge className="bg-orange-500/10 text-orange-700">Flagged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "user":
        return <Badge variant="secondary">User</Badge>;
      case "facility_owner":
        return <Badge className="bg-secondary/10 text-secondary border-secondary/20">Owner</Badge>;
      case "admin":
        return <Badge className="bg-accent/10 text-accent border-accent/20">Admin</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole="admin" userName="Admin User" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard 👨‍💼</h1>
          <p className="text-muted-foreground">Manage the QuickCourt platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {adminStats.map((stat, index) => (
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
          {/* Main Management Panel */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Platform Management</CardTitle>
                <CardDescription>Manage facilities and users</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="facilities" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="facilities">Facility Approvals ({pendingFacilities.length})</TabsTrigger>
                    <TabsTrigger value="users">User Management</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="facilities" className="space-y-4">
                    {pendingFacilities.map((facility) => (
                      <Card key={facility.id} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{facility.name}</h4>
                                {getStatusBadge(facility.status)}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div>Owner: {facility.owner}</div>
                                <div className="flex items-center space-x-4">
                                  <span className="flex items-center">
                                    <MapPin size={14} className="mr-1" />
                                    {facility.location}
                                  </span>
                                  <span className="flex items-center">
                                    <Building size={14} className="mr-1" />
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
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock size={12} className="mr-1" />
                                  Submitted: {new Date(facility.submittedDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button variant="outline" size="sm">
                                <Eye size={14} className="mr-1" />
                                Review
                              </Button>
                              <div className="flex space-x-1">
                                <Button variant="default" size="sm">
                                  <CheckCircle size={14} className="mr-1" />
                                  Approve
                                </Button>
                                <Button variant="destructive" size="sm">
                                  <XCircle size={14} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="users" className="space-y-4">
                    {recentUsers.map((user) => (
                      <Card key={user.id} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{user.name}</h4>
                                {getRoleBadge(user.role)}
                                {getStatusBadge(user.status)}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <div>{user.email}</div>
                                <div className="flex items-center space-x-4">
                                  <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                                  <span>Last active: {user.lastActive}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                  {user.bookings !== undefined && (
                                    <span>{user.bookings} bookings</span>
                                  )}
                                  {user.facilities && (
                                    <span>{user.facilities} facilities</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <Button variant="outline" size="sm">
                                <Eye size={14} className="mr-1" />
                                View Profile
                              </Button>
                              <div className="flex space-x-1">
                                {user.status === "active" ? (
                                  <Button variant="destructive" size="sm">
                                    <Ban size={14} className="mr-1" />
                                    Ban
                                  </Button>
                                ) : (
                                  <Button variant="default" size="sm">
                                    <UserCheck size={14} className="mr-1" />
                                    Activate
                                  </Button>
                                )}
                              </div>
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

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Platform Health */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Users</span>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Facility Utilization</span>
                    <span className="text-sm font-medium">73%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '73%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Rating</span>
                    <span className="text-sm font-medium flex items-center">
                      <Star size={12} className="mr-1 text-yellow-500 fill-yellow-500" />
                      4.6/5
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span>New facility application</span>
                    <Badge variant="outline" className="text-xs">5 min ago</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>User reported issue</span>
                    <Badge variant="outline" className="text-xs">1 hr ago</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Facility approved</span>
                    <Badge variant="outline" className="text-xs">2 hrs ago</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment dispute resolved</span>
                    <Badge variant="outline" className="text-xs">4 hrs ago</Badge>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <Button variant="outline" className="w-full">
                    <TrendingUp size={16} className="mr-2" />
                    View All Activity
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