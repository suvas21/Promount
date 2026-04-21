-- Create the quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  
  -- Service Details
  tv_size TEXT,
  tv_price INTEGER,
  num_technicians INTEGER,
  technician_price INTEGER,
  mount_type TEXT,
  mount_price INTEGER,
  wall_type TEXT,
  wall_price INTEGER,
  wire_option TEXT,
  wire_price INTEGER,
  extras JSONB, -- Storing as JSONB is better than text for querying, but schema asked for text/JSON string
  extras_price INTEGER,
  num_tvs INTEGER DEFAULT 1,
  
  -- Pricing
  discount INTEGER,
  trip_charge INTEGER,
  estimated_total INTEGER,
  
  -- Schedule
  preferred_date DATE,
  preferred_time TEXT,
  
  -- Location
  street_address TEXT,
  apt_suite TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  -- Contact
  full_name TEXT,
  phone_number TEXT,
  email TEXT,
  
  -- Other
  additional_notes TEXT,
  marketing_consent BOOLEAN,
  sms_consent BOOLEAN DEFAULT FALSE -- Added for completeness if needed later
);

-- Enable Row Level Security
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert quotes (public access)
CREATE POLICY "Enable insert for everyone" ON quotes
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to read only their own quotes (optional, strictly for security if auth was used)
-- Since this is a public form without auth, we typically don't allow public SELECT access to all quotes.
-- Admin access would be handled via service role key or dashboard.