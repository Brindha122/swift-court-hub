import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Calendar,
  Clock,
  Users,
  MapPin,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'booking' | 'quick-reply';
}

interface BookingDetails {
  sport?: string;
  date?: string;
  time?: string;
  players?: number;
  venue?: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your sports venue booking assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [bookingState, setBookingState] = useState<BookingDetails>({});
  const [bookingStep, setBookingStep] = useState<'sport' | 'date' | 'time' | 'players' | 'venue' | 'confirm' | 'complete'>('sport');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addMessage = (text: string, sender: 'user' | 'bot', type: 'text' | 'booking' | 'quick-reply' = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (callback: () => void, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const sports = ['Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 'Volleyball'];
  const timeSlots = ['6:00 AM - 8:00 AM', '8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM', '6:00 PM - 8:00 PM'];
  const venues = ['Elite Sports Complex', 'Championship Arena', 'Victory Grounds', 'Sports Paradise', 'Premier Courts'];

  const handleBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for booking intent
    if (lowerMessage.includes('book') || lowerMessage.includes('reserve') || lowerMessage.includes('i want to play')) {
      if (!bookingState.sport) {
        simulateTyping(() => {
          addMessage('Great! I\'d love to help you book a venue. Which sport would you like to play?', 'bot');
          setBookingStep('sport');
        });
      }
      return;
    }

    // Handle booking flow
    if (bookingStep === 'sport' && !bookingState.sport) {
      const selectedSport = sports.find(sport => lowerMessage.includes(sport.toLowerCase()));
      if (selectedSport) {
        setBookingState(prev => ({ ...prev, sport: selectedSport }));
        simulateTyping(() => {
          addMessage(`Perfect! ${selectedSport} it is. Which date would you prefer? (Please provide in DD/MM/YYYY format)`, 'bot');
          setBookingStep('date');
        });
        return;
      }
    }

    if (bookingStep === 'date' && !bookingState.date) {
      const dateRegex = /(\d{1,2}\/\d{1,2}\/\d{4})/;
      const dateMatch = userMessage.match(dateRegex);
      if (dateMatch) {
        setBookingState(prev => ({ ...prev, date: dateMatch[0] }));
        simulateTyping(() => {
          addMessage(`Great! Date set for ${dateMatch[0]}. What time slot would you prefer?`, 'bot');
          addMessage('Available slots: ' + timeSlots.join(', '), 'bot');
          setBookingStep('time');
        });
        return;
      }
    }

    if (bookingStep === 'time' && !bookingState.time) {
      const selectedTime = timeSlots.find(time => 
        lowerMessage.includes(time.toLowerCase()) || 
        time.split(' - ').some(t => lowerMessage.includes(t.toLowerCase()))
      );
      if (selectedTime) {
        setBookingState(prev => ({ ...prev, time: selectedTime }));
        simulateTyping(() => {
          addMessage(`Time slot ${selectedTime} selected! How many players will be playing?`, 'bot');
          setBookingStep('players');
        });
        return;
      }
    }

    if (bookingStep === 'players' && !bookingState.players) {
      const playersMatch = userMessage.match(/(\d+)/);
      if (playersMatch) {
        const playerCount = parseInt(playersMatch[0]);
        setBookingState(prev => ({ ...prev, players: playerCount }));
        simulateTyping(() => {
          addMessage(`${playerCount} players noted! Which venue would you prefer?`, 'bot');
          addMessage('Available venues: ' + venues.join(', '), 'bot');
          setBookingStep('venue');
        });
        return;
      }
    }

    if (bookingStep === 'venue' && !bookingState.venue) {
      const selectedVenue = venues.find(venue => lowerMessage.includes(venue.toLowerCase()));
      if (selectedVenue) {
        setBookingState(prev => ({ ...prev, venue: selectedVenue }));
        simulateTyping(() => {
          const booking = { ...bookingState, venue: selectedVenue };
          addMessage(`Perfect! Here's your booking summary:
          
🏟️ Venue: ${booking.venue}
⚽ Sport: ${booking.sport}
📅 Date: ${booking.date}
⏰ Time: ${booking.time}
👥 Players: ${booking.players}

Type "confirm" to complete your booking!`, 'bot', 'booking');
          setBookingStep('confirm');
        }, 1500);
        return;
      }
    }

    if (bookingStep === 'confirm' && lowerMessage.includes('confirm')) {
      simulateTyping(() => {
        addMessage('🎉 Booking Confirmed! Your venue has been successfully booked. You\'ll receive a confirmation shortly. You can view your bookings in the "My Bookings" section.', 'bot', 'booking');
        setBookingStep('complete');
        setBookingState({});
      }, 1500);
      return;
    }

    // General responses
    const responses = [
      "I can help you book sports venues! Just say 'I want to book' to get started.",
      "Looking for a venue? I can help you find and book the perfect sports facility.",
      "I'm here to assist with your sports venue bookings. What would you like to know?",
      "Need help with booking? I can guide you through finding the right venue for your sport!",
      "I can help you book venues for Football, Cricket, Basketball, Tennis, Badminton, and Volleyball!"
    ];

    simulateTyping(() => {
      addMessage(responses[Math.floor(Math.random() * responses.length)], 'bot');
    });
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addMessage(inputValue, 'user');
    const userMessage = inputValue;
    setInputValue('');

    // Handle bot response
    handleBotResponse(userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickReplies = [
    "I want to book a venue",
    "Show available sports",
    "Check my bookings",
    "Cancel booking"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Chat Window */}
      {isOpen && (
        <Card className="w-80 h-96 mb-4 shadow-2xl border-0 bg-gradient-to-br from-background via-background to-accent/5">
          <CardHeader className="pb-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 bg-white/20">
                  <AvatarFallback className="text-primary">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">Sports Assistant</h3>
                  <p className="text-xs opacity-90">Online now</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-primary-foreground hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages Area */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 py-3">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <Avatar className="h-6 w-6 bg-primary/10">
                        <AvatarFallback className="text-primary">
                          <Bot className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground ml-auto'
                          : message.type === 'booking'
                          ? 'bg-gradient-to-br from-accent to-accent/50 text-accent-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {message.text}
                      {message.type === 'booking' && (
                        <Badge className="mt-2 bg-success/20 text-success-foreground text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Booking
                        </Badge>
                      )}
                    </div>
                    {message.sender === 'user' && (
                      <Avatar className="h-6 w-6 bg-accent/10">
                        <AvatarFallback className="text-accent-foreground">
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <Avatar className="h-6 w-6 bg-primary/10">
                      <AvatarFallback className="text-primary">
                        <Bot className="h-3 w-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-2xl px-3 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 border-t bg-muted/30">
                <div className="flex flex-wrap gap-1">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 rounded-full"
                      onClick={() => {
                        addMessage(reply, 'user');
                        handleBotResponse(reply);
                      }}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t bg-background/50">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full border-muted-foreground/20 focus:border-primary"
                />
                <Button 
                  onClick={handleSendMessage}
                  size="sm"
                  className="rounded-full h-10 w-10 p-0 shadow-lg"
                  disabled={!inputValue.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-gradient-to-br from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70' 
            : 'bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6 text-primary-foreground" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse"></div>
          </div>
        )}
      </Button>
    </div>
  );
}