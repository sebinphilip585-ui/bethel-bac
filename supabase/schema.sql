-- Completely drop all existing tables to ensure a clean slate
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;

-- Create the rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  price_per_night INTEGER NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed', -- Can be 'confirmed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- Insert the official room list
INSERT INTO rooms (name, type, price_per_night, images) VALUES
('Beckingham', '2 BHK', 4500, ARRAY['/images/media__1782958486604.jpg']),
('Beverly Hills', '2 BHK', 4500, ARRAY['/images/media__1782958486624.jpg']),
('Belrose', '1 BHK', 2500, ARRAY['/images/media__1782958486674.jpg']),
('Blooms Bay', '2 BHK', 4500, ARRAY['/images/media__1782958486920.jpg']),
('Blue Bell', '1 BHK', 2500, ARRAY['/images/media__1782958486604.jpg']),
('Beehive', '1 BHK', 2500, ARRAY['/images/media__1782958486624.jpg']),
('Belarus', '3 BHK', 6500, ARRAY['/images/media__1782958486674.jpg']),
('Breeze Garden', '1 BHK', 2500, ARRAY['/images/media__1782958486920.jpg']),
('Brook Hills', '1 BHK', 2500, ARRAY['/images/media__1782958486604.jpg']),
('Bliss Heaven', '1 BHK', 2500, ARRAY['/images/media__1782958486624.jpg']);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies

-- Anyone can read rooms (public)
CREATE POLICY "Public can view rooms"
ON rooms FOR SELECT
TO public
USING (true);

-- Anyone can insert a booking
CREATE POLICY "Public can create bookings"
ON bookings FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users/admins can view bookings (assuming admin uses auth)
-- Since we are doing a simple rebuild and public bookings, we might want public to read their own booking (maybe by ID later).
-- For now, we will allow read access to bookings for testing, but in production, we restrict it.
CREATE POLICY "Public can view bookings"
ON bookings FOR SELECT
TO public
USING (true); -- For demo/simplicity, you might restrict this in a real prod env.

-- Admins can update/delete (requires setting up Supabase auth later)
