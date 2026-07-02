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
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'receptionist')) DEFAULT 'receptionist',
  phone TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

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
  check_in_time TIME,
  check_out DATE NOT NULL,
  check_out_time TIME,
  identity_card TEXT,
  card_details TEXT,
  actual_check_in_time TIMESTAMPTZ,
  actual_check_out_time TIMESTAMPTZ,
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
DROP POLICY IF EXISTS "Room types are viewable by everyone" ON room_types;
CREATE POLICY "Room types are viewable by everyone" ON room_types FOR SELECT USING (true);
DROP POLICY IF EXISTS "Active offers are viewable by everyone" ON special_offers;
CREATE POLICY "Active offers are viewable by everyone" ON special_offers FOR SELECT USING (active = true);

-- Staff can manage everything based on role
DROP POLICY IF EXISTS "Staff can view profiles" ON profiles;
CREATE POLICY "Staff can view profiles" ON profiles FOR SELECT USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')));
DROP POLICY IF EXISTS "Admin can manage profiles" ON profiles;
CREATE POLICY "Admin can manage profiles" ON profiles FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Staff can view rooms" ON rooms;
CREATE POLICY "Staff can view rooms" ON rooms FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "Admin can manage rooms" ON rooms;
CREATE POLICY "Admin can manage rooms" ON rooms FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Staff can view guests" ON guests;
CREATE POLICY "Staff can view guests" ON guests FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "Staff can manage guests" ON guests;
CREATE POLICY "Staff can manage guests" ON guests FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view bookings" ON bookings;
CREATE POLICY "Staff can view bookings" ON bookings FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "Staff can manage bookings" ON bookings;
CREATE POLICY "Staff can manage bookings" ON bookings FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view pricing" ON pricing_rules;
CREATE POLICY "Staff can view pricing" ON pricing_rules FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid()));
DROP POLICY IF EXISTS "Admin can manage pricing" ON pricing_rules;
CREATE POLICY "Admin can manage pricing" ON pricing_rules FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ============================================================
-- SEED DATA
-- ============================================================
-- Clear old trial rooms if they exist
DELETE FROM rooms WHERE room_number IN ('101', '102', '201');
DELETE FROM room_types WHERE name IN ('Deluxe Room', 'Premium Suite', 'Family Suite', 'Executive Room');

INSERT INTO room_types (name, slug, description, short_description, base_price, max_guests, size_sqft, bed_type) VALUES
('Beckingham', 'beckingham', 'Luxury 2 BHK Apartment', '2 BHK', 4500, 4, 800, 'King'),
('Beverly Hills', 'beverly-hills', 'Luxury 2 BHK Apartment', '2 BHK', 4500, 4, 800, 'King'),
('Belrose', 'belrose', 'Luxury 1 BHK Apartment', '1 BHK', 2500, 2, 400, 'King'),
('Blooms Bay', 'blooms-bay', 'Luxury 2 BHK Apartment', '2 BHK', 4500, 4, 800, 'King'),
('Blue Bell', 'blue-bell', 'Luxury 1 BHK Apartment', '1 BHK', 2500, 2, 400, 'King'),
('Beehive', 'beehive', 'Luxury 1 BHK Apartment', '1 BHK', 2500, 2, 400, 'King'),
('Belarus', 'belarus', 'Luxury 3 BHK Apartment', '3 BHK', 6500, 6, 1200, 'King'),
('Breeze Garden', 'breeze-garden', 'Luxury 1 BHK Apartment', '1 BHK', 2500, 2, 400, 'King'),
('Brook Hills', 'brook-hills', 'Luxury 1 BHK Apartment', '1 BHK', 2500, 2, 400, 'King'),
('Bliss Heaven', 'bliss-heaven', 'Luxury 1 BHK Apartment', '1 BHK', 2500, 2, 400, 'King')
ON CONFLICT (name) DO UPDATE SET base_price = EXCLUDED.base_price, short_description = EXCLUDED.short_description;

INSERT INTO rooms (room_number, room_type_id, floor) 
SELECT 'BKG-01', id, 1 FROM room_types WHERE name = 'Beckingham' ON CONFLICT DO NOTHING;
INSERT INTO rooms (room_number, room_type_id, floor) 
SELECT 'BVH-01', id, 1 FROM room_types WHERE name = 'Beverly Hills' ON CONFLICT DO NOTHING;
INSERT INTO rooms (room_number, room_type_id, floor) 
SELECT 'BLR-01', id, 1 FROM room_types WHERE name = 'Belrose' ON CONFLICT DO NOTHING;
INSERT INTO rooms (room_number, room_type_id, floor) 
SELECT 'BLB-01', id, 1 FROM room_types WHERE name = 'Blooms Bay' ON CONFLICT DO NOTHING;
INSERT INTO rooms (room_number, room_type_id, floor) 
SELECT 'BBL-01', id, 1 FROM room_types WHERE name = 'Blue Bell' ON CONFLICT DO NOTHING;
INSERT INTO rooms (room_number, room_type_id, floor) 
SELECT 'BHV-01', id, 1 FROM room_types WHERE name = 'Beehive' ON CONFLICT DO NOTHING;
INSERT INTO rooms (room_number, room_type_id, floor) 
SELECT 'BLS-01', id, 1 FROM room_types WHERE name = 'Belarus' ON CONFLICT DO NOTHING;
INSERT INTO rooms (room_number, room_type_id, floor) 
SELECT 'BRG-01', id, 1 FROM room_types WHERE name = 'Breeze Garden' ON CONFLICT DO NOTHING;
INSERT INTO rooms (room_number, room_type_id, floor) 
SELECT 'BRH-01', id, 1 FROM room_types WHERE name = 'Brook Hills' ON CONFLICT DO NOTHING;
INSERT INTO rooms (room_number, room_type_id, floor) 
SELECT 'BLH-01', id, 1 FROM room_types WHERE name = 'Bliss Heaven' ON CONFLICT DO NOTHING;

-- ============================================================
-- EXPENSES
-- ============================================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  vendor_name TEXT,
  payment_status TEXT DEFAULT 'Paid',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- CALENDAR EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  type TEXT DEFAULT 'meeting',
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  staff_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- DIGITAL QUEUE
-- ============================================================
CREATE TABLE IF NOT EXISTS digital_queue (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  token_number TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  purpose TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  notes TEXT,
  status TEXT DEFAULT 'waiting',
  joined_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'low',
  type TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security for new tables
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff can view expenses" ON expenses;
CREATE POLICY "Staff can view expenses" ON expenses FOR SELECT USING (true);
DROP POLICY IF EXISTS "Staff can view calendar" ON calendar_events;
CREATE POLICY "Staff can view calendar" ON calendar_events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Staff can view queue" ON digital_queue;
CREATE POLICY "Staff can view queue" ON digital_queue FOR SELECT USING (true);
DROP POLICY IF EXISTS "Staff can view notifications" ON notifications;
CREATE POLICY "Staff can view notifications" ON notifications FOR SELECT USING (true);

-- ============================================================
-- ACTIVITY TIMELINE (Audit Logs)
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_timeline (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id TEXT REFERENCES bookings(id) ON DELETE CASCADE,
  action TEXT NOT NULL, 
  description TEXT,
  actor_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INVENTORY ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  quantity INTEGER DEFAULT 0,
  min_threshold INTEGER DEFAULT 5,
  unit TEXT,
  last_restocked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- STAFF ATTENDANCE
-- ============================================================
CREATE TABLE IF NOT EXISTS staff_attendance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  staff_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ,
  status TEXT DEFAULT 'present',
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- HOUSEKEEPING TASKS
-- ============================================================
CREATE TABLE IF NOT EXISTS housekeeping_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES profiles(id),
  task_type TEXT DEFAULT 'cleaning',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE activity_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE housekeeping_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view activity" ON activity_timeline FOR SELECT USING (true);
CREATE POLICY "Staff can view inventory" ON inventory_items FOR SELECT USING (true);
CREATE POLICY "Staff can view attendance" ON staff_attendance FOR SELECT USING (true);
CREATE POLICY "Staff can view housekeeping" ON housekeeping_tasks FOR SELECT USING (true);
