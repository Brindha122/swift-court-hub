-- Create enum types
CREATE TYPE public.user_role AS ENUM ('user', 'venue_owner', 'admin');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE public.venue_status AS ENUM ('active', 'inactive', 'pending_approval');
CREATE TYPE public.sport_type AS ENUM ('football', 'basketball', 'tennis', 'cricket', 'badminton', 'volleyball');

-- Create profiles table for user information
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create venues table
CREATE TABLE public.venues (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT,
    email TEXT,
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    sports sport_type[] NOT NULL,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    status venue_status NOT NULL DEFAULT 'pending_approval',
    opening_time TIME NOT NULL DEFAULT '06:00:00',
    closing_time TIME NOT NULL DEFAULT '22:00:00',
    advance_booking_days INTEGER NOT NULL DEFAULT 30,
    cancellation_hours INTEGER NOT NULL DEFAULT 24,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    sport sport_type NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours INTEGER NOT NULL,
    player_count INTEGER NOT NULL DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    service_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    special_requests TEXT,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking_players table for player details
CREATE TABLE public.booking_players (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    player_name TEXT NOT NULL,
    player_phone TEXT,
    player_email TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(booking_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer functions for role checking
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_venue_owner(user_uuid UUID, venue_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.venues 
    WHERE id = venue_uuid AND owner_id = user_uuid
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Profiles RLS policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Venues RLS policies
CREATE POLICY "Anyone can view active venues" ON public.venues FOR SELECT USING (status = 'active');
CREATE POLICY "Venue owners can view own venues" ON public.venues FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Admins can view all venues" ON public.venues FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Venue owners can insert venues" ON public.venues FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Venue owners can update own venues" ON public.venues FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Admins can update venue status" ON public.venues FOR UPDATE USING (public.get_user_role(auth.uid()) = 'admin');

-- Bookings RLS policies
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Venue owners can view venue bookings" ON public.bookings FOR SELECT USING (public.is_venue_owner(auth.uid(), venue_id));
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Venue owners can update venue bookings" ON public.bookings FOR UPDATE USING (public.is_venue_owner(auth.uid(), venue_id));

-- Booking players RLS policies
CREATE POLICY "Users can view booking players for own bookings" ON public.booking_players FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND user_id = auth.uid())
);
CREATE POLICY "Venue owners can view booking players for venue bookings" ON public.booking_players FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bookings b JOIN public.venues v ON b.venue_id = v.id 
          WHERE b.id = booking_id AND v.owner_id = auth.uid())
);
CREATE POLICY "Users can insert booking players for own bookings" ON public.booking_players FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND user_id = auth.uid())
);

-- Reviews RLS policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews for own bookings" ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = user_id AND 
  EXISTS (SELECT 1 FROM public.bookings WHERE id = booking_id AND user_id = auth.uid() AND status = 'completed')
);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Notifications RLS policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_venues_owner_id ON public.venues(owner_id);
CREATE INDEX idx_venues_sports ON public.venues USING GIN(sports);
CREATE INDEX idx_venues_status ON public.venues(status);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_venue_id ON public.bookings(venue_id);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_booking_players_booking_id ON public.booking_players(booking_id);
CREATE INDEX idx_reviews_venue_id ON public.reviews(venue_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', 'User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();