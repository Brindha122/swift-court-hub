import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">Q</span>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  QuickCourt
                </h3>
                <p className="text-sm text-muted-foreground">Sports Booking Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Book premium sports facilities across Tamil Nadu with instant confirmation and secure payments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/venues" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Venues
                </a>
              </li>
              <li>
                <a href="/bookings" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  My Bookings
                </a>
              </li>
              <li>
                <a href="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Profile
                </a>
              </li>
              <li>
                <a href="/owner/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  List Your Venue
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-muted-foreground flex-shrink-0" />
                <a 
                  href="mailto:codecraft@gmail.com" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  codecraft@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-muted-foreground flex-shrink-0" />
                <a 
                  href="tel:+919876543210" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-muted-foreground flex-shrink-0 mt-1" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  Chennai, Tamil Nadu
                  <br />India
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 QuickCourt. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6">
            <span className="text-sm text-muted-foreground">Follow us:</span>
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <ExternalLink size={16} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <ExternalLink size={16} />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}