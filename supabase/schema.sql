-- ============================================================
-- BETHEL MEADOWS — Complete Database Schema
-- Run this in Supabase SQL Editor to create all tables
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'receptionist')) DEFAULT 'receptionist',
  phone TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'receptionist')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ROOM TYPES
-- ============================================================
CREATE TABLE IF NOT EXISTS room_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  max_guests INTEGER DEFAULT 2,
  size_sqft INTEGER,
  bed_type TEXT,
  facilities JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROOMS
-- ============================================================
CREATE TABLE IF NOT EXISTS rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_number TEXT NOT NULL UNIQUE,
  room_type_id UUID REFERENCES room_types(id) ON DELETE RESTRICT,
  floor INTEGER,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'occupied', 'cleaning', 'maintenance')),
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- GUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  id_type TEXT CHECK (id_type IN ('Aadhaar', 'Passport', 'Driving License', 'Voter ID', 'Other')),
  id_number TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY, -- BM-YYYYMMDD-XXXX format
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  room_type_id UUID REFERENCES room_types(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')),
  total_amount DECIMAL(10,2),
  amount_paid DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded')),
  source TEXT DEFAULT 'direct' CHECK (source IN ('direct', 'booking_com', 'agoda', 'makemytrip', 'expedia', 'goibibo', 'other')),
  special_requests TEXT,
  notes TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT check_dates CHECK (check_out > check_in)
);

-- ============================================================
-- PRICING RULES
-- ============================================================
CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('weekend', 'season', 'occupancy', 'special')),
  multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.0,
  start_date DATE,
  end_date DATE,
  threshold INTEGER, -- for occupancy rules
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SPECIAL OFFERS
-- ============================================================
CREATE TABLE IF NOT EXISTS special_offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  discount_percent INTEGER,
  discount_amount DECIMAL(10,2),
  code TEXT UNIQUE,
  valid_from DATE,
  valid_to DATE,
  min_stay INTEGER DEFAULT 1,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- OTA BOOKINGS (Future - Channel Manager)
-- ============================================================
CREATE TABLE IF NOT EXISTS ota_bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id TEXT REFERENCES bookings(id),
  ota_name TEXT NOT NULL,
  ota_booking_ref TEXT,
  ota_status TEXT DEFAULT 'pending',
  commission_percent DECIMAL(5,2),
  commission_amount DECIMAL(10,2),
  synced_at TIMESTAMPTZ,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- CHANNEL MANAGER (Future)
-- ============================================================
CREATE TABLE IF NOT EXISTS channel_connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  channel_name TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error', 'syncing')),
  api_key TEXT,
  last_sync TIMESTAMPTZ,
  rooms_synced INTEGER DEFAULT 0,
  config JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- REVENUE SNAPSHOTS (for historical tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS revenue_snapshots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE NOT NULL,
  total_rooms INTEGER,
  occupied_rooms INTEGER,
  occupancy_percent DECIMAL(5,2),
  total_revenue DECIMAL(10,2),
  adr DECIMAL(10,2), -- Average Daily Rate
  revpar DECIMAL(10,2), -- Revenue Per Available Room
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_check_out ON bookings(check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_guest ON bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_type ON rooms(room_type_id);
CREATE INDEX IF NOT EXISTS idx_guests_email ON guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE special_offers ENABLE ROW LEVEL SECURITY;

-- Public read access for room types and offers (for website)
CREATE POLICY "Room types are viewable by everyone" ON room_types FOR SELECT USING (true);
CREATE POLICY "Active offers are viewable by everyone" ON special_offers FOR SELECT USING (active = true);

-- Staff can manage everything based on role
CREATE POLICY "Staff can view profiles" ON profiles FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')));
CREATE POLICY "Admin can manage profiles" ON profiles FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff can view rooms" ON rooms FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admin can manage rooms" ON rooms FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Staff can view guests" ON guests FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Staff can manage guests" ON guests FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Staff can view bookings" ON bookings FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Staff can manage bookings" ON bookings FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Staff can view pricing" ON pricing_rules FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Admin can manage pricing" ON pricing_rules FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO room_types (name, slug, description, short_description, base_price, max_guests, size_sqft, bed_type, facilities, images, featured) VALUES
('Deluxe Room', 'deluxe-room', 'A beautifully appointed room featuring modern amenities and elegant wooden interiors.', 'Elegant comfort with modern amenities', 3500, 2, 320, 'King', '["Air Conditioning", "Smart TV", "Free WiFi", "Mini Bar", "Room Service", "Attached Bathroom", "Hot Water", "Wardrobe"]', '["/images/rooms/room-bed.jpg", "/images/rooms/room-ac.jpg"]', true),
('Premium Suite', 'premium-suite', 'Spacious suite with separate living area and premium furnishings.', 'Spacious luxury with living area', 5500, 2, 480, 'King', '["Air Conditioning", "Smart TV 55\"", "Free WiFi", "Mini Bar", "Room Service", "Living Area", "Sofa Set", "Work Desk"]', '["/images/rooms/room-tv.jpg", "/images/rooms/room-sofa.jpg"]', true),
('Family Suite', 'family-suite', 'Generously sized suite designed for families with separate sleeping and living areas.', 'Perfect for families with extra space', 7500, 4, 620, 'King + Twin', '["Air Conditioning", "Smart TV 55\"", "Free WiFi", "Room Service", "Living Area", "Dining Area", "Kitchenette"]', '["/images/rooms/room-living.jpg", "/images/rooms/room-sofa.jpg"]', true),
('Executive Room', 'executive-room', 'A refined room designed for business travelers with dedicated work desk.', 'Designed for business travelers', 4500, 2, 380, 'King', '["Air Conditioning", "Smart TV", "High-Speed WiFi", "Mini Bar", "Work Desk", "Ergonomic Chair", "Laptop Safe"]', '["/images/rooms/room-ac.jpg", "/images/rooms/room-tv.jpg"]', false);
