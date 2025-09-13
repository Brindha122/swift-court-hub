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
  Mail,
  Users,
  Plus,
  Minus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Sport configurations with min/max players
const SPORT_CONFIGS = {
  cricket: { min: 11, max: 25, name: "Cricket" },
  basketball: { min: 5, max: 15, name: "Basketball" },
  volleyball: { min: 6, max: 15, name: "Volleyball" },
  tennis: { min: 2, max: 5, name: "Tennis" },
  football: { min: 11, max: 25, name: "Football" },
  badminton: { min: 2, max: 4, name: "Badminton" }
};

interface PlayerDetail {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const venueId = searchParams.get('venue');
  const sportParam = searchParams.get('sport') || 'badminton';
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [playerCount, setPlayerCount] = useState(0);
  const [players, setPlayers] = useState<PlayerDetail[]>([]);
  const [specialRequests, setSpecialRequests] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  // Get sport configuration
  const sportConfig = SPORT_CONFIGS[sportParam.toLowerCase() as keyof typeof SPORT_CONFIGS] || SPORT_CONFIGS.badminton;

  // Mock venue data - in real app, fetch by venueId
  const venue = {
    id: "1",
    name: "Elite Sports Complex",
    sport: sportConfig.name,
    location: "Downtown Mumbai",
    price: 600, // Fixed at ≤ 600
    rating: 4.8,
    amenities: ["AC", "Parking", "Lockers", "Equipment"],
    image: "/assets/venue-badminton.jpg"
  };

  // Player management functions
  const updatePlayerCount = (count: number) => {
    setPlayerCount(count);
    const newPlayers: PlayerDetail[] = [];
    for (let i = 0; i < count; i++) {
      newPlayers.push({
        id: i + 1,
        name: players[i]?.name || "",
        phone: players[i]?.phone || "",
        email: players[i]?.email || ""
      });
    }
    setPlayers(newPlayers);
  };

  const updatePlayer = (playerId: number, field: keyof Omit<PlayerDetail, 'id'>, value: string) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId ? { ...player, [field]: value } : player
    ));
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
    if (!selectedDate || !selectedTime || playerCount === 0) {
      toast({
        title: "Missing Information",
        description: "Please select date, time and number of players",
        variant: "destructive"
      });
      return;
    }

    const incompletePlayer = players.find(player => !player.name || !player.phone);
    if (incompletePlayer) {
      toast({
        title: "Incomplete Player Details",
        description: `Please fill in all required details for Player ${incompletePlayer.id}`,
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setIsBooking(false);
      toast({ title: "Not logged in", description: "Please login again and retry.", variant: "destructive" });
      return;
    }

    const [startStr, endStr] = selectedTime.split(' - ');
    const start_time = `${startStr}:00`;
    const end_time = `${endStr}:00`;
    const startDate = new Date(`1970-01-01T${startStr}:00Z`);
    const endDate = new Date(`1970-01-01T${endStr}:00Z`);
    const duration_hours = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)));

    const totalAmount = venue.price * Math.max(1, playerCount);
    const serviceFee = Math.round(totalAmount * 0.05);
    const finalAmount = totalAmount + serviceFee;

    const isUuid = (v: string | null) => !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
    const venue_uuid = isUuid(venueId) ? (venueId as string) : crypto.randomUUID();

    const { data: bookingInsert, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: session.user.id,
        venue_id: venue_uuid,
        sport: sportParam.toLowerCase(),
        booking_date: selectedDate,
        start_time,
        end_time,
        duration_hours,
        player_count: playerCount,
        total_amount: totalAmount,
        service_fee: serviceFee,
        final_amount: finalAmount,
        special_requests: specialRequests,
        payment_status: 'paid',
        status: 'confirmed'
      })
      .select('id')
      .single();

    if (bookingError || !bookingInsert) {
      setIsBooking(false);
      toast({ title: 'Booking failed', description: bookingError?.message || 'Please try again', variant: 'destructive' });
      return;
    }

    const playersPayload = players.map((p, idx) => ({
      booking_id: bookingInsert.id,
      player_name: p.name,
      player_phone: p.phone,
      player_email: p.email || null,
      is_primary: idx === 0
    }));

    const { error: playersError } = await supabase.from('booking_players').insert(playersPayload);
    if (playersError) {
      console.error(playersError);
    }

    setIsBooking(false);
    toast({
      title: "Booking Confirmed! 🎉",
      description: `Court booked successfully for ${playerCount} players`,
    });
    navigate("/bookings");
  };

  const totalAmount = venue.price * Math.max(1, playerCount);
  const serviceFee = Math.round(totalAmount * 0.05);
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

            {/* Player Count Selection */}
            {selectedDate && selectedTime && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2" size={20} />
                    Select Number of Players
                  </CardTitle>
                  <CardDescription>
                    For {sportConfig.name}: Minimum {sportConfig.min} players, Maximum {sportConfig.max} players
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updatePlayerCount(Math.max(sportConfig.min, playerCount - 1))}
                      disabled={playerCount <= sportConfig.min}
                    >
                      <Minus size={16} />
                    </Button>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{playerCount}</div>
                      <div className="text-sm text-muted-foreground">Players</div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updatePlayerCount(Math.min(sportConfig.max, playerCount + 1))}
                      disabled={playerCount >= sportConfig.max}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  
                  {playerCount === 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Array.from({ length: sportConfig.max - sportConfig.min + 1 }, (_, i) => {
                        const count = sportConfig.min + i;
                        return (
                          <Button
                            key={count}
                            variant="outline"
                            onClick={() => updatePlayerCount(count)}
                            className="h-16 flex flex-col"
                          >
                            <span className="text-xl font-bold">{count}</span>
                            <span className="text-xs text-muted-foreground">
                              {count === sportConfig.min ? "Min" : count === sportConfig.max ? "Max" : "Players"}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Player Details */}
            {playerCount > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2" size={20} />
                    Player Details ({playerCount} players)
                  </CardTitle>
                  <CardDescription>Fill in details for all {playerCount} players</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {players.map((player, index) => (
                    <div key={player.id} className="p-4 border border-border/30 rounded-lg bg-muted/20">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </div>
                        <h4 className="font-medium">Player {index + 1}</h4>
                        {index === 0 && <Badge variant="secondary" className="ml-2">Lead Player</Badge>}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`player-${player.id}-name`}>Full Name *</Label>
                          <Input
                            id={`player-${player.id}-name`}
                            value={player.name}
                            onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                            placeholder="Enter full name"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`player-${player.id}-phone`}>Phone Number *</Label>
                            <Input
                              id={`player-${player.id}-phone`}
                              value={player.phone}
                              onChange={(e) => updatePlayer(player.id, 'phone', e.target.value)}
                              placeholder="+91 98765 43210"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`player-${player.id}-email`}>Email</Label>
                            <Input
                              id={`player-${player.id}-email`}
                              type="email"
                              value={player.email}
                              onChange={(e) => updatePlayer(player.id, 'email', e.target.value)}
                              placeholder="player@example.com"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Special Requests */}
            {playerCount > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
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
            )}
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
                  
                  {playerCount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Players</span>
                      <div className="text-right">
                        <span className="font-medium">{playerCount} players</span>
                        <div className="text-xs text-muted-foreground">
                          ₹{venue.price} × {playerCount}
                        </div>
                      </div>
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
                  disabled={!selectedDate || !selectedTime || playerCount === 0 || players.some(p => !p.name || !p.phone) || isBooking}
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