import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { VenueCard } from "@/components/VenueCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  MapPin, 
  Filter,
  SlidersHorizontal,
  Grid3X3,
  List,
  Star
} from "lucide-react";
import venueBadminton from "@/assets/venue-badminton.jpg";
import venueTennis from "@/assets/venue-tennis.jpg";
import venueBasketball from "@/assets/venue-basketball.jpg";
import venueFootball from "@/assets/venue-football.jpg";
import venueCricket from "@/assets/venue-cricket.jpg";
import venueVolleyball from "@/assets/venue-volleyball.jpg";

export default function VenuesPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popularity");

  // Check URL params for sport or district filter
  useEffect(() => {
    const sportParam = searchParams.get('sport');
    const districtParam = searchParams.get('district');
    
    if (sportParam) {
      const sportName = sportParam.charAt(0).toUpperCase() + sportParam.slice(1);
      setSelectedSports([sportName]);
    }
    
    if (districtParam) {
      const districtName = districtParam.charAt(0).toUpperCase() + districtParam.slice(1);
      setSearchQuery(districtName);
    }
  }, [searchParams]);

  // Tamil Nadu Districts with 10 courts each
  const tamilNaduDistricts = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", 
    "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", 
    "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", 
    "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", 
    "Salem", "Sivagangai", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", 
    "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", 
    "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
  ];

  const sportsTypes = ["Badminton", "Tennis", "Basketball", "Football", "Cricket", "Volleyball"];
  
  // Generate venues for all districts
  const generateVenues = () => {
    const venues = [];
    let venueId = 1;
    
    tamilNaduDistricts.forEach(district => {
      // Generate 10 courts per district, ensuring all sports are covered
      const sportsPerDistrict = [...sportsTypes];
      
      for (let i = 1; i <= 10; i++) {
        const sport = sportsPerDistrict[i % sportsTypes.length];
        const price = Math.floor(Math.random() * (200 - 50) + 50); // 50-200 rupees range
        const rating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
        
        // Get appropriate image for sport
        const getImageForSport = (sportName) => {
          switch(sportName) {
            case 'Tennis': return venueTennis;
            case 'Basketball': return venueBasketball;
            case 'Football': return venueFootball;
            case 'Cricket': return venueCricket;
            case 'Volleyball': return venueVolleyball;
            default: return venueBadminton;
          }
        };
        
        venues.push({
          id: venueId.toString(),
          name: `${district} ${sport} Arena ${i}`,
          sport: sport,
          location: `${district}, Tamil Nadu`,
          district: district,
          price: price,
          rating: parseFloat(rating),
          image: getImageForSport(sport),
          amenities: ["AC", "Parking", "Lockers", "Equipment", "Coaching", "Cafeteria", "Changing Rooms"].slice(0, Math.floor(Math.random() * 4) + 3),
          availability: Math.random() > 0.1 ? "Available" : "Booked"
        });
        venueId++;
      }
    });
    
    return venues;
  };

  const allVenues = generateVenues();

  const sports = ["Badminton", "Tennis", "Basketball", "Football", "Cricket", "Volleyball"];
  const amenities = ["AC", "Parking", "Lockers", "Equipment", "Coaching", "Cafeteria", "Changing Rooms"];

  const handleSportFilter = (sport: string, checked: boolean) => {
    if (checked) {
      setSelectedSports([...selectedSports, sport]);
    } else {
      setSelectedSports(selectedSports.filter(s => s !== sport));
    }
  };

  const handleAmenityFilter = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenity]);
    } else {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    }
  };

  // Filter and sort venues  
  const filteredVenues = allVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.district?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSports = selectedSports.length === 0 || selectedSports.includes(venue.sport);
    
    const matchesAmenities = selectedAmenities.length === 0 || 
                           selectedAmenities.every(amenity => venue.amenities.includes(amenity));
    
    const matchesPrice = !priceRange || 
                        (priceRange === "under-75" && venue.price < 75) ||
                        (priceRange === "75-125" && venue.price >= 75 && venue.price < 125) ||
                        (priceRange === "125-175" && venue.price >= 125 && venue.price < 175) ||
                        (priceRange === "above-175" && venue.price >= 175);

    return matchesSearch && matchesSports && matchesAmenities && matchesPrice;
  });

  // Sort venues
  const sortedVenues = [...filteredVenues].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return b.rating - a.rating; // Default to popularity (rating)
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole="user" userName="Current User" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Court 🏸</h1>
          <p className="text-muted-foreground">Discover and book premium sports facilities near you</p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-8 border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Search by district name (e.g., Chennai, Coimbatore, Madurai)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Quick Filters */}
              <div className="flex flex-wrap gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {(selectedSports.length > 0 || selectedAmenities.length > 0 || priceRange) && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedSports.length + selectedAmenities.length + (priceRange ? 1 : 0)}
                    </Badge>
                  )}
                </Button>

                <div className="flex border border-border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 size={16} />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sports Filter */}
                <div>
                  <h4 className="font-medium mb-3">Sports</h4>
                  <div className="space-y-2">
                    {sports.map((sport) => (
                      <div key={sport} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sport-${sport}`}
                          checked={selectedSports.includes(sport)}
                          onCheckedChange={(checked) => handleSportFilter(sport, checked as boolean)}
                        />
                        <label htmlFor={`sport-${sport}`} className="text-sm">
                          {sport}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities Filter */}
                <div>
                  <h4 className="font-medium mb-3">Amenities</h4>
                  <div className="space-y-2">
                    {amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={(checked) => handleAmenityFilter(amenity, checked as boolean)}
                        />
                        <label htmlFor={`amenity-${amenity}`} className="text-sm">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h4 className="font-medium mb-3">Price Range (per hour)</h4>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-75">Under ₹75</SelectItem>
                      <SelectItem value="75-125">₹75 - ₹125</SelectItem>
                      <SelectItem value="125-175">₹125 - ₹175</SelectItem>
                      <SelectItem value="above-175">Above ₹175</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">
              {sortedVenues.length} venues found
            </h2>
            {searchQuery && (
              <p className="text-muted-foreground">
                Results for "<span className="font-medium">{searchQuery}</span>"
              </p>
            )}
          </div>
          
          {/* Active Filters */}
          {(selectedSports.length > 0 || selectedAmenities.length > 0 || priceRange) && (
            <div className="flex flex-wrap gap-2">
              {selectedSports.map((sport) => (
                <Badge key={sport} variant="secondary" className="flex items-center gap-1">
                  {sport}
                  <button
                    onClick={() => handleSportFilter(sport, false)}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {selectedAmenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                  {amenity}
                  <button
                    onClick={() => handleAmenityFilter(amenity, false)}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {priceRange && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {priceRange.replace('-', ' - ₹')}
                  <button
                    onClick={() => setPriceRange("")}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Venues Grid/List */}
        {sortedVenues.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {sortedVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                {...venue}
                onBook={(id) => console.log(`Booking venue ${id}`)}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-border/50">
            <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No venues found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedSports([]);
                setSelectedAmenities([]);
                setPriceRange("");
              }}
            >
              Clear all filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}