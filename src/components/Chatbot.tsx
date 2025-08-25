import { useState } from "react";
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
      content: "Hi! I'm your QuickCourt assistant. I can help you with booking courts, finding facilities, and answering questions about our platform. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");

  const quickQuestions = [
    "How to book a court?",
    "What can admins do?", 
    "What features do owners have?",
    "How to cancel booking?",
    "Payment options?",
    "How to become facility owner?"
  ];

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("book") || message.includes("reservation")) {
      return "To book a court: 1) Browse venues on our Venues page 2) Select your preferred court and time slot 3) Choose payment method 4) Confirm booking. You'll receive instant confirmation!";
    }
    
    if (message.includes("admin") || message.includes("administrator")) {
      return "Admins can: • Approve/reject facility applications • Manage users and ban accounts • View platform analytics • Handle disputes • Monitor facility quality • Access detailed reports and insights.";
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
    
    if (message.includes("become") || message.includes("register")) {
      return "To become a facility owner: 1) Sign up and select 'Facility Owner' role 2) Complete profile verification 3) Submit facility details and photos 4) Wait for admin approval 5) Start receiving bookings!";
    }
    
    if (message.includes("help") || message.includes("support")) {
      return "I'm here to help! You can ask me about booking courts, facility management, payments, or any QuickCourt features. For urgent issues, contact our 24/7 support team.";
    }
    
    return "I understand you're asking about QuickCourt. Could you be more specific? I can help with bookings, facility management, payments, admin features, or general platform questions. Try asking 'How to book a court?' or choose from the quick questions below!";
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
        <Card className="w-96 h-[500px] flex flex-col shadow-glow border-border/50">
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
            <ScrollArea className="flex-1 pr-2">
              <div className="space-y-3">
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
                      <div className={`rounded-lg p-2 text-sm ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground flex items-center">
                  <HelpCircle size={12} className="mr-1" />
                  Quick questions:
                </p>
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