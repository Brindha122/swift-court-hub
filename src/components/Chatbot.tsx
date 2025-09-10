import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot,
  User,
  Zap,
  HelpCircle
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotProps {
  className?: string;
}

export function Chatbot({ className = "" }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi! I'm your QuickCourt assistant. I can help you with booking courts, finding facilities, and answering questions about our platform. I can also help you book courts directly through chat! How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickQuestions = [
    "I want to book a court",
    "How to book a court?",
    "What sports are available?",
    "Show me venue prices",
    "How to cancel booking?",
    "Payment options?"
  ];

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Booking intent detection
    if (message.includes("i want to book") || message.includes("book now") || message.includes("make a booking")) {
      return "Great! I'd love to help you book a court. 🏆\n\nTo complete your booking through our chat system, I'll need to store your booking details in our database. For this feature to work, we need to connect to our backend system.\n\nFor now, you can easily book by:\n1) Go to 'Venues' page\n2) Select your sport and venue\n3) Choose date, time & players\n4) Complete booking\n\nWould you like me to guide you through the booking process?";
    }
    
    if (message.includes("book") || message.includes("reservation")) {
      return "To book a court: 1) Browse venues on our Venues page 2) Select your preferred court and time slot 3) Choose date, time and number of players 4) Fill player details 5) Choose payment method 6) Confirm booking. You'll receive instant confirmation!";
    }
    
    if (message.includes("sports") || message.includes("available")) {
      return "We offer these exciting sports: 🏀 Basketball, ⚽ Football, 🏐 Volleyball, 🎾 Tennis, 🏏 Cricket, 🏸 Badminton. Each sport has specific player requirements and courts across multiple districts!";
    }
    
    if (message.includes("price") || message.includes("cost") || message.includes("fee")) {
      return "Our court prices are ₹600 per player for all sports. Final cost = ₹600 × number of players. Different sports have different player requirements: Cricket/Football (11-25), Basketball (5-15), Volleyball (6-15), Tennis (2-5), Badminton (2-4).";
    }
    
    if (message.includes("admin") || message.includes("administrator")) {
      return "Admins can: • Approve/reject facility applications • Manage users and accounts • View platform analytics • Handle disputes • Monitor facility quality • Access detailed reports and insights.";
    }
    
    if (message.includes("owner") || message.includes("facility")) {
      return "Facility owners can: • Add and manage their sports facilities • Set court pricing and availability • View booking analytics • Manage time slots • Track revenue • Respond to user reviews.";
    }
    
    if (message.includes("cancel")) {
      return "To cancel a booking: Go to 'My Bookings' → Select your booking → Click 'Cancel'. Cancellations made 24+ hours before are fully refunded. Within 24 hours may have a cancellation fee.";
    }
    
    if (message.includes("payment") || message.includes("pay")) {
      return "We accept: • Credit/Debit cards • UPI payments • Net banking • Digital wallets. All payments are secure and encrypted. You'll receive instant payment confirmation.";
    }
    
    if (message.includes("help") || message.includes("support")) {
      return "I'm here to help! You can ask me about booking courts, sports availability, pricing, facility management, payments, or any QuickCourt features. I can even help guide you through bookings! What would you like to know?";
    }
    
    return "I'm here to help with QuickCourt! 🏆 I can assist with:\n• Court bookings and availability\n• Sports info and pricing\n• Venue details and locations\n• Payment and cancellation policies\n• Platform features\n\nTry asking 'I want to book a court' or 'What sports are available?' What can I help you with?";
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(inputValue),
        sender: "bot", 
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInputValue("");
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
    sendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          variant="hero"
          className="rounded-full w-14 h-14 shadow-glow hover:shadow-glow"
        >
          <MessageCircle size={24} />
        </Button>
      ) : (
        <Card className="w-96 h-[600px] flex flex-col shadow-glow border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Bot className="text-primary-foreground" size={18} />
                </div>
                <div>
                  <CardTitle className="text-sm">QuickCourt Assistant</CardTitle>
                  <CardDescription className="text-xs flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-1"></div>
                    Online
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost" 
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6"
              >
                <X size={14} />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-3 space-y-3">
            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 pr-2">
              <div className="space-y-3 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[85%] ${
                      message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-gradient-primary"
                      }`}>
                        {message.sender === "user" ? (
                          <User size={12} />
                        ) : (
                          <Bot className="text-primary-foreground" size={12} />
                        )}
                      </div>
                      <div className={`rounded-lg p-2 text-sm whitespace-pre-line ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Questions - Show when less than 3 messages */}
            {messages.length <= 2 && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground flex items-center">
                  <HelpCircle size={12} className="mr-1" />
                  Quick questions:
                </div>
                <div className="flex flex-wrap gap-1">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="flex space-x-2 pt-2 border-t border-border">
              <Input
                placeholder="Ask me anything about QuickCourt..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm"
              />
              <Button 
                onClick={sendMessage}
                size="icon"
                variant="hero"
                disabled={!inputValue.trim()}
                className="h-10 w-10 flex-shrink-0"
              >
                <Send size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}