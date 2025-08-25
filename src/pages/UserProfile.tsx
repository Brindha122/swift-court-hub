import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Camera,
  Settings,
  Bell,
  Shield
} from "lucide-react";

export default function UserProfile() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole="user" userName="Current User" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="border-border/50">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback className="text-2xl">CU</AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  >
                    <Camera size={14} />
                  </Button>
                </div>
                
                <h3 className="text-xl font-semibold mb-1">Current User</h3>
                <p className="text-muted-foreground mb-4">user@example.com</p>
                
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <Badge variant="secondary">Premium Member</Badge>
                  <Badge variant="outline">Active Player</Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Calendar size={14} className="mr-2" />
                    Member since Jan 2024
                  </div>
                  <div className="flex items-center justify-center text-muted-foreground">
                    <MapPin size={14} className="mr-2" />
                    Mumbai, India
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="personal">Personal Info</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Current" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="User" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="user@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Mumbai, India" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Tell us about yourself and your favorite sports..."
                        rows={3}
                      />
                    </div>
                    
                    <Button className="w-full md:w-auto">
                      <Edit size={16} className="mr-2" />
                      Save Changes
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="preferences" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <Bell size={16} className="mr-2" />
                          Notifications
                        </h4>
                        <div className="space-y-3 pl-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Booking Confirmations</div>
                              <div className="text-sm text-muted-foreground">Get notified when bookings are confirmed</div>
                            </div>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Promotional Offers</div>
                              <div className="text-sm text-muted-foreground">Receive offers and discounts</div>
                            </div>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Favorite Sports</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">Badminton</Badge>
                          <Badge variant="outline">Tennis</Badge>
                          <Badge variant="outline">Basketball</Badge>
                          <Button variant="outline" size="sm">+ Add Sport</Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="security" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                        <Shield className="text-primary" size={20} />
                        <div>
                          <div className="font-medium">Account Security</div>
                          <div className="text-sm text-muted-foreground">Your account is protected</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                      
                      <Button variant="outline">Update Password</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}