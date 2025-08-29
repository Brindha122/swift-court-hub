import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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
  Shield,
  Plus,
  X
} from "lucide-react";

// Favorite Sports Component
function FavoriteSportsSection() {
  const { toast } = useToast();
  const [favoriteSports, setFavoriteSports] = useState(["Badminton", "Tennis", "Basketball"]);
  const [showAddSports, setShowAddSports] = useState(false);
  
  const allSports = [
    "Badminton", "Tennis", "Basketball", "Football", "Cricket", "Volleyball", 
    "Table Tennis", "Swimming", "Boxing", "Gym", "Squash", "Cycling",
    "Running", "Yoga", "Martial Arts", "Hockey", "Golf", "Baseball"
  ];
  
  const availableSports = allSports.filter(sport => !favoriteSports.includes(sport));
  
  const addSport = (sport: string) => {
    setFavoriteSports([...favoriteSports, sport]);
    toast({
      title: "Sport Added! 🎯",
      description: `${sport} has been added to your favorites`,
    });
  };
  
  const removeSport = (sport: string) => {
    setFavoriteSports(favoriteSports.filter(s => s !== sport));
    toast({
      title: "Sport Removed",
      description: `${sport} has been removed from favorites`,
    });
  };
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {favoriteSports.map((sport) => (
          <Badge 
            key={sport} 
            variant="secondary" 
            className="cursor-pointer hover:bg-destructive/20 group relative"
          >
            {sport}
            <button 
              onClick={() => removeSport(sport)}
              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </Badge>
        ))}
        
        <Dialog open={showAddSports} onOpenChange={setShowAddSports}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Plus size={14} />
              Add Sport
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Favorite Sports</DialogTitle>
            </DialogHeader>
            <div className="pt-4">
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {availableSports.map((sport) => (
                  <Button
                    key={sport}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addSport(sport);
                      if (availableSports.length === 1) {
                        setShowAddSports(false);
                      }
                    }}
                    className="justify-start"
                  >
                    {sport}
                  </Button>
                ))}
              </div>
              {availableSports.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  All sports have been added to your favorites!
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function UserProfile() {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("Current");
  const [lastName, setLastName] = useState("User");
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [location, setLocation] = useState("Mumbai, India");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile Updated! ✅",
        description: "Your changes have been saved successfully",
      });
    }, 1000);
  };

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
                
                <h3 className="text-xl font-semibold mb-1">{firstName} {lastName}</h3>
                <p className="text-muted-foreground mb-4">{email}</p>
                
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <Badge 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => toast({ title: "Premium Member 👑", description: "Enjoy exclusive benefits: Priority booking, 20% discounts, free equipment, dedicated support, and premium court access!" })}
                  >
                    Premium Member
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="cursor-pointer hover:bg-accent/20 transition-colors"
                    onClick={() => toast({ title: "Active Player 🏆", description: "You've played 48+ hours this month! Keep up the great work and stay active!" })}
                  >
                    Active Player
                  </Badge>
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
                        <Input 
                          id="firstName" 
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself and your favorite sports..."
                        rows={3}
                      />
                    </div>
                    
                    <Button 
                      className="w-full md:w-auto" 
                      onClick={handleSaveChanges}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Edit size={16} className="mr-2" />
                          Save Changes
                        </>
                      )}
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
                        <FavoriteSportsSection />
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