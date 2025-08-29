import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  User,
  Phone,
  Mail
} from "lucide-react";

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const venueId = searchParams.get('venue');
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [playerPhone, setPlayerPhone] = useState("");
  const [playerEmail, setPlayerEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  // Mock venue data - in real app, fetch by venueId
  const venue = {
    id: "1",
    name: "Elite Sports Complex",
    sport: "Badminton",
    location: "Downtown Mumbai",
    price: 600, // Fixed at ≤ 600
    rating: 4.8,
    amenities: ["AC", "Parking", "Lockers", "Equipment"],
    image: "/assets/venue-badminton.jpg"
  };

  // Mock available time slots
  const timeSlots = [
    "06:00 - 07:00", "07:00 - 08:00", "08:00 - 09:00",
    "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00",
    "19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00"
  ];

  const availableDates = [
    "2024-01-15", "2024-01-16", "2024-01-17", 
    "2024-01-18", "2024-01-19", "2024-01-20", "2024-01-21"
  ];

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !playerName || !playerPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsBooking(false);
      toast({
        title: "Booking Confirmed! 🎉",
        description: "Your court has been booked successfully",
      });
      
      // Navigate to bookings page
      navigate("/bookings");
    }, 2000);
  };

  const totalAmount = venue.price;
  const serviceFee = Math.round(venue.price * 0.05);
  const finalAmount = totalAmount + serviceFee;

  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole="user" userName="Current User" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Venues
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Book Your Court</h1>
          <p className="text-muted-foreground">Complete your booking details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Venue Info */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div>
                    <h3 className="text-xl">{venue.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {venue.location}
                      </span>
                      <span className="flex items-center">
                        <Star size={14} className="mr-1 text-yellow-500 fill-yellow-500" />
                        {venue.rating}
                      </span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{venue.sport}</Badge>
                  {venue.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline">{amenity}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableDates.map((date) => (
                    <Button
                      key={date}
                      variant={selectedDate === date ? "default" : "outline"}
                      onClick={() => setSelectedDate(date)}
                      className="h-auto p-3 flex flex-col"
                    >
                      <div className="font-medium">
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className="text-sm">
                        {new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Selection */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2" size={20} />
                  Select Time Slot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTime === slot ? "default" : "outline"}
                      onClick={() => setSelectedTime(slot)}
                      className="h-12"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Player Details */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2" size={20} />
                  Player Details
                </CardTitle>
                <CardDescription>Primary player information for the booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="playerName">Full Name *</Label>
                  <Input
                    id="playerName"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="playerPhone">Phone Number *</Label>
                    <Input
                      id="playerPhone"
                      value={playerPhone}
                      onChange={(e) => setPlayerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="playerEmail">Email</Label>
                    <Input
                      id="playerEmail"
                      type="email"
                      value={playerEmail}
                      onChange={(e) => setPlayerEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                  <Textarea
                    id="specialRequests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any special requirements or requests..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Venue</span>
                    <span className="font-medium">{venue.name}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sport</span>
                    <Badge variant="secondary">{venue.sport}</Badge>
                  </div>
                  
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">
                        {new Date(selectedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {selectedTime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Court Fee</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="text-muted-foreground">₹{serviceFee}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{finalAmount}</span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 border border-border/50 rounded-lg">
                    <h4 className="font-medium mb-3">Payment Method</h4>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="payment" value="online" defaultChecked className="text-primary" />
                        <span>Online Payment</span>
                      </label>
                      <div className="ml-6 p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Available Options:</p>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2"
                            onClick={() => toast({ title: "UPI Payment", description: "Opening UPI app..." })}
                          >
                            💳 UPI
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast({ title: "Card Payment", description: "Opening card payment..." })}
                          >
                            💰 Credit Cards
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast({ title: "Debit Card", description: "Opening debit card payment..." })}
                          >
                            💳 Debit Cards
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast({ title: "Wallet Payment", description: "Opening wallet payment..." })}
                          >
                            👛 Wallets
                          </Button>
                        </div>
                        <div className="mt-3 p-2 bg-background border rounded text-center">
                          <div className="text-xs text-muted-foreground mb-1">Scan QR to Pay ₹{finalAmount}</div>
                          <div 
                            className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/50 rounded-lg flex items-center justify-center cursor-pointer hover:shadow-lg transition-smooth"
                            onClick={() => toast({ 
                              title: "QR Payment Initiated! 📱", 
                              description: `Payment of ₹${finalAmount} initiated via QR code` 
                            })}
                          >
                            <div className="text-center">
                              <div className="text-2xl">📱</div>
                              <div className="text-xs font-medium">PAY NOW</div>
                            </div>
                          </div>
                          <div className="text-xs text-primary font-medium mt-1">Click to Pay</div>
                        </div>
                      </div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="payment" value="offline" className="text-primary" />
                        <span>Pay at Venue (Cash/Card)</span>
                      </label>
                      <div className="ml-6 text-sm text-muted-foreground">
                        <p>• Payment confirmation will be sent to venue owner</p>
                        <p>• Booking confirmed only after payment at venue</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full mt-6" 
                  size="lg"
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime || !playerName || !playerPhone || isBooking}
                >
                  {isBooking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing Booking...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} className="mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center mt-4">
                  By booking, you agree to our terms and conditions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}