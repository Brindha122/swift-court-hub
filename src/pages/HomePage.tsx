import { useState } from "react";
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
  Clock
} from "lucide-react";
import heroImage from "@/assets/hero-sports.jpg";
import venueBadminton from "@/assets/venue-badminton.jpg";
import venueTennis from "@/assets/venue-tennis.jpg";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for popular venues
  const popularVenues = [
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
    },
    {
      id: "3",
      name: "Metro Basketball Arena",
      sport: "Basketball",
      location: "Andheri East",
      price: 600,
      rating: 4.6,
      image: venueBadminton,
      amenities: ["Indoor", "Sound System", "Scoreboard"],
      availability: "Booked"
    }
  ];

  const popularSports = [
    { name: "Badminton", count: "200+ courts", icon: "🏸" },
    { name: "Tennis", count: "150+ courts", icon: "🎾" },
    { name: "Basketball", count: "100+ courts", icon: "🏀" },
    { name: "Football", count: "80+ fields", icon: "⚽" },
  ];

  const features = [
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book courts in seconds with real-time availability"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and secure payment processing"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole="user" userName="John Doe" />
      
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
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search for venues, sports, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-3 bg-background/95 backdrop-blur-sm border-border/50"
                />
              </div>
              <Button variant="accent" size="lg" className="px-8">
                <MapPin size={20} className="mr-2" />
                Find Courts
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="hero" size="lg">
                <Calendar size={20} className="mr-2" />
                Book Now
              </Button>
              <Button variant="sport" size="lg">
                <Trophy size={20} className="mr-2" />
                Explore Venues
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Sports</h2>
            <p className="text-muted-foreground text-lg">Choose from hundreds of verified venues</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularSports.map((sport, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-card transition-smooth border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{sport.icon}</div>
                  <h3 className="font-semibold mb-2">{sport.name}</h3>
                  <p className="text-sm text-muted-foreground">{sport.count}</p>
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
            <Button variant="outline">
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
              <Card key={index} className="text-center hover:shadow-card transition-smooth border-border/50">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="text-primary-foreground" size={28} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
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
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
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
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-muted-foreground">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}