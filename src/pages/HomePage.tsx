import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { VenueCard } from "@/components/VenueCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chatbot } from "@/components/Chatbot";

import { 
  Search, 
  MapPin, 
  Calendar, 
  Trophy, 
  Users,
  ArrowRight,
  Zap,
  Shield,
  Clock,
  X,
  Activity
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import heroImage from "@/assets/hero-sports.jpg";
import venueBadminton from "@/assets/venue-badminton.jpg";
import venueTennis from "@/assets/venue-tennis.jpg";
import venueBasketball from "@/assets/venue-basketball.jpg";
import venueFootball from "@/assets/venue-football.jpg";
import venueCricket from "@/assets/venue-cricket.jpg";
import venueVolleyball from "@/assets/venue-volleyball.jpg";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeature, setSelectedFeature] = useState(null);
  const navigate = useNavigate();

  // Tamil Nadu districts for popular venues
  const tamilNaduDistricts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", 
    "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", 
    "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", 
    "Salem", "Sivagangai", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", 
    "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", 
    "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
  ];

  // Generate popular venues from different districts
  const sports = ["Badminton", "Tennis", "Basketball", "Football", "Cricket", "Volleyball"];
  const sportImages = [venueBadminton, venueTennis, venueBasketball, venueFootball, venueCricket, venueVolleyball];
  
  const popularVenues = tamilNaduDistricts.slice(0, 4).map((district, index) => ({
    id: `district-${district}`,
    name: `${district} Sports Complex`,
    sport: sports[index],
    location: `${district}, Tamil Nadu`,
    price: Math.floor(Math.random() * (1000 - 400) + 400), // 400-1000 rupees range
    rating: (4.5 + (index * 0.1)),
    image: sportImages[index],
    amenities: ["AC", "Parking", "Lockers", "Equipment", "Coaching", "Cafeteria"],
    availability: "Available",
    district: district
  }));

  const popularSports = [
    { name: "Badminton", count: "380+ courts", icon: "🏸" },
    { name: "Tennis", count: "380+ courts", icon: "🎾" },
    { name: "Basketball", count: "380+ courts", icon: "🏀" },
    { name: "Football", count: "380+ fields", icon: "⚽" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book courts in seconds with real-time availability",
      details: "Experience lightning-fast booking with our advanced real-time availability system. Browse, select, and confirm your court booking in under 30 seconds. Our platform automatically updates availability, preventing double bookings and ensuring you get the exact slot you want. No more waiting on hold or visiting venues in person - book anytime, anywhere with just a few clicks."
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and secure payment processing",
      details: "Your financial security is our top priority. We use industry-leading encryption and partner with trusted payment gateways to ensure your transactions are completely secure. Support for UPI, all major credit/debit cards, and popular digital wallets. All payments are processed through PCI DSS compliant systems with fraud detection and prevention measures in place."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support",
      details: "Get help whenever you need it with our dedicated 24/7 customer support team. Whether you have questions about bookings, need help with payments, or face any technical issues, our experienced support agents are available via chat, email, and phone. Average response time under 2 minutes for chat support and comprehensive help documentation available."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole="user" userName="" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              🏆 India's #1 Sports Booking Platform
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Book Your Perfect
              <span className="block bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
                Sports Court
              </span>
            </h1>
            
            <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
              Discover and book premium sports facilities near you. From badminton courts to 
              tennis clubs, find the perfect venue for your game.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="relative mb-8">
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl shadow-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    placeholder="Search by location (e.g. Chennai, Salem) or court name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-4 bg-transparent border-0 focus:ring-0 text-lg"
                  />
                </div>
                <Button 
                  variant="accent" 
                  size="lg" 
                  className="px-8 py-4 rounded-xl"
                  onClick={() => {
                    if (searchQuery.trim()) {
                      // Check if it's a district search
                      const matchingDistrict = tamilNaduDistricts.find(district => 
                        district.toLowerCase().includes(searchQuery.toLowerCase())
                      );
                      
                      if (matchingDistrict) {
                        navigate(`/venues?district=${matchingDistrict.toLowerCase()}`);
                      } else {
                        // Search for court names
                        navigate(`/venues?search=${encodeURIComponent(searchQuery)}`);
                      }
                    } else {
                      navigate('/venues');
                    }
                  }}
                >
                  <MapPin size={20} className="mr-2" />
                  Find Courts
                </Button>
              </div>
              
              {/* Search Suggestions */}
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                  {tamilNaduDistricts
                    .filter(district => district.toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(0, 5)
                    .map(district => (
                      <div
                        key={district}
                        className="p-3 hover:bg-muted cursor-pointer border-b border-border/50 last:border-0"
                        onClick={() => {
                          setSearchQuery(district);
                          navigate(`/venues?district=${district.toLowerCase()}`);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <MapPin size={16} className="text-primary" />
                          <div>
                            <div className="font-medium">{district}</div>
                            <div className="text-sm text-muted-foreground">10+ courts available</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {/* Popular courts suggestions */}
                  {popularVenues
                    .filter(venue => 
                      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      venue.location.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .slice(0, 3)
                    .map(venue => (
                      <div
                        key={venue.id}
                        className="p-3 hover:bg-muted cursor-pointer border-b border-border/50 last:border-0"
                        onClick={() => {
                          setSearchQuery(venue.name);
                          navigate(`/venues?search=${encodeURIComponent(venue.name)}`);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <Activity size={16} className="text-secondary" />
                          <div>
                            <div className="font-medium">{venue.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {venue.sport} • {venue.location} • ₹{venue.price}/hr
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
            <Button variant="hero" size="lg" onClick={() => navigate('/venues')}>
              <Calendar size={20} className="mr-2" />
              Book Now
            </Button>
            <Button variant="sport" size="lg" onClick={() => navigate('/venues')}>
              <Trophy size={20} className="mr-2" />
              Explore Venues
            </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Sports */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Sports</h2>
            <p className="text-muted-foreground text-lg">Choose from hundreds of verified venues</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: "Football", image: venueFootball, icon: "⚽", count: "200+" },
              { name: "Volleyball", image: venueVolleyball, icon: "🏐", count: "180+" },
              { name: "Tennis", image: venueTennis, icon: "🎾", count: "350+" },
              { name: "Badminton", image: venueBadminton, icon: "🏸", count: "400+" },
              { name: "Basketball", image: venueBasketball, icon: "🏀", count: "220+" },
              { name: "Cricket", image: venueCricket, icon: "🏏", count: "160+" }
            ].map((sport) => (
              <Card 
                key={sport.name} 
                className="group cursor-pointer hover:shadow-card transition-smooth border-border/50 overflow-hidden relative h-48"
                onClick={() => navigate(`/venues?sport=${sport.name.toLowerCase()}`)}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${sport.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
                <CardContent className="relative z-10 p-4 h-full flex flex-col justify-end text-white">
                  <div className="text-3xl mb-2">{sport.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{sport.name}</h3>
                  <p className="text-sm text-white/80">{sport.count} courts</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Venues */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Popular Venues</h2>
              <p className="text-muted-foreground">Top-rated courts near you</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/venues')}>
              View All
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                {...venue}
                onBook={(id) => console.log(`Booking venue ${id}`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose QuickCourt?</h2>
            <p className="text-muted-foreground text-lg">Experience the future of sports booking</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-card transition-smooth border-border/50 cursor-pointer"
                onClick={() => setSelectedFeature(feature)}
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="text-primary-foreground" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <Button variant="outline" className="mt-4">Learn More</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">3,800+</div>
              <div className="text-muted-foreground">Active Venues</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50k+</div>
              <div className="text-muted-foreground">Happy Players</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">100k+</div>
              <div className="text-muted-foreground">Bookings Made</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">38</div>
              <div className="text-muted-foreground">Tamil Nadu Districts</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Details Dialog */}
      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              {selectedFeature && (
                <>
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <selectedFeature.icon className="text-primary-foreground" size={24} />
                  </div>
                  <span>{selectedFeature.title}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <p className="text-muted-foreground leading-relaxed">
              {selectedFeature?.details}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}