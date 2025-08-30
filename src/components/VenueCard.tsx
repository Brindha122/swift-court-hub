import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, DollarSign } from "lucide-react";

interface VenueCardProps {
  id: string;
  name: string;
  sport: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  amenities?: string[];
  availability?: string;
  onBook?: (id: string) => void;
}

export function VenueCard({
  id,
  name,
  sport,
  location,
  price,
  rating,
  image,
  amenities = [],
  availability = "Available",
  onBook
}: VenueCardProps) {
  const navigate = useNavigate();
  
  const handleBookClick = () => {
    if (availability === "Available") {
      navigate(`/book?venue=${id}`);
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-card transition-smooth border-border/50">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {sport}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge 
            variant={availability === "Available" ? "default" : "destructive"}
            className="bg-background/90 backdrop-blur-sm"
          >
            {availability}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
            <div className="flex items-center text-muted-foreground text-sm mt-1">
              <MapPin size={14} className="mr-1" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">{rating}</span>
              <span className="text-xs text-muted-foreground">(4.2k)</span>
            </div>
            
            <div className="flex items-center text-primary font-semibold">
              <span>₹{price}/hr</span>
            </div>
          </div>

          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {amenities.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {amenities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{amenities.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="hero" 
          size="sm" 
          className="w-full"
          onClick={handleBookClick}
          disabled={availability !== "Available"}
        >
          <Clock size={16} className="mr-2" />
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}