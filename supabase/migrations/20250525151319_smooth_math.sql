/*
  # Initial Schema Setup

  1. New Tables
    - `drivers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `gender` (text)
      - `age` (integer)
      - `email` (text)
      - `phone` (text) 
      - `address` (text)
      - `license_number` (text)
      - `license_expiry` (date)
      - `vehicle_reg` (text)
      - `vehicle_type` (text)
      - `experience` (integer)
      - `status` (text)
      - `photo_url` (text)
      - `created_at` (timestamptz)

    - `vehicles`
      - `id` (uuid, primary key)
      - `reg_number` (text)
      - `type` (text)
      - `make` (text)
      - `model` (text)
      - `year` (integer)
      - `capacity` (integer)
      - `fuel_type` (text)
      - `condition` (text)
      - `status` (text)
      - `assigned_driver` (text)
      - `created_at` (timestamptz)

    - `schedules`
      - `id` (uuid, primary key)
      - `route` (text)
      - `departure_time` (time)
      - `arrival_time` (time)
      - `vehicle_id` (uuid, references vehicles)
      - `driver_id` (uuid, references drivers)
      - `days_of_week` (text[])
      - `status` (text)
      - `created_at` (timestamptz)

    - `trips`
      - `id` (uuid, primary key)
      - `route_id` (text)
      - `company` (text)
      - `vehicle_type` (text)
      - `service` (text)
      - `departure_time` (timestamptz)
      - `arrival_time` (timestamptz)
      - `price` (decimal)
      - `available_seats` (integer)
      - `total_seats` (integer)
      - `features` (text[])
      - `from_city` (text)
      - `to_city` (text)
      - `created_at` (timestamptz)

    - `bookings`
      - `id` (uuid, primary key)
      - `booking_reference` (text)
      - `trip_id` (uuid, references trips)
      - `customer_id` (uuid, references customers)
      - `seat_numbers` (integer[])
      - `total_amount` (decimal)
      - `status` (text)
      - `payment_status` (text)
      - `payment_method` (text)
      - `created_at` (timestamptz)

    - `customers`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `phone_number` (text)
      - `email` (text)
      - `id_number` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create drivers table
CREATE TABLE IF NOT EXISTS drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  gender text,
  age integer,
  email text,
  phone text,
  address text,
  license_number text,
  license_expiry date,
  vehicle_reg text,
  vehicle_type text,
  experience integer,
  status text DEFAULT 'Active',
  photo_url text,
  created_at timestamptz DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reg_number text UNIQUE NOT NULL,
  type text,
  make text,
  model text,
  year integer,
  capacity integer,
  fuel_type text,
  condition text,
  status text DEFAULT 'Available',
  assigned_driver text,
  created_at timestamptz DEFAULT now()
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route text NOT NULL,
  departure_time time NOT NULL,
  arrival_time time NOT NULL,
  vehicle_id uuid REFERENCES vehicles(id),
  driver_id uuid REFERENCES drivers(id),
  days_of_week text[],
  status text DEFAULT 'Active',
  created_at timestamptz DEFAULT now()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id text NOT NULL,
  company text,
  vehicle_type text,
  service text,
  departure_time timestamptz NOT NULL,
  arrival_time timestamptz NOT NULL,
  price decimal NOT NULL,
  available_seats integer,
  total_seats integer,
  features text[],
  from_city text NOT NULL,
  to_city text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone_number text NOT NULL,
  email text,
  id_number text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference text UNIQUE NOT NULL,
  trip_id uuid REFERENCES trips(id),
  customer_id uuid REFERENCES customers(id),
  seat_numbers integer[],
  total_amount decimal NOT NULL,
  status text DEFAULT 'pending',
  payment_status text DEFAULT 'pending',
  payment_method text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users full access to drivers"
  ON drivers FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to vehicles"
  ON vehicles FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to schedules"
  ON schedules FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to trips"
  ON trips FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to customers"
  ON customers FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users full access to bookings"
  ON bookings FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);