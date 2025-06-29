/*
  # Investment Analysis Platform Schema

  1. New Tables
    - `areas` - Store selected geographical areas for analysis
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `type` (text) - polygon, rectangle, circle
      - `coordinates` (jsonb) - GeoJSON coordinates
      - `area_size` (numeric) - calculated area in square meters
      - `center_lat` (numeric)
      - `center_lng` (numeric)
      - `created_at` (timestamp)
    
    - `analyses` - Store analysis results
      - `id` (uuid, primary key)
      - `area_id` (uuid, references areas)
      - `user_id` (uuid, references auth.users)
      - `analysis_type` (text) - urban, agricultural
      - `parameters` (jsonb) - investment parameters
      - `results` (jsonb) - analysis results
      - `created_at` (timestamp)
    
    - `mobility_data` - Mock mobility patterns
      - `id` (uuid, primary key)
      - `location` (geography(POINT,4326))
      - `timestamp` (timestamptz)
      - `intensity` (numeric)
      - `hour_of_day` (integer)
      - `day_of_week` (integer)
    
    - `transaction_data` - Mock transaction data
      - `id` (uuid, primary key)
      - `location` (geography(POINT,4326))
      - `timestamp` (timestamptz)
      - `amount` (numeric)
      - `category` (text)
      - `merchant_id` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Areas table
CREATE TABLE IF NOT EXISTS areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('polygon', 'rectangle', 'circle')),
  coordinates jsonb NOT NULL,
  area_size numeric NOT NULL DEFAULT 0,
  center_lat numeric NOT NULL,
  center_lng numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own areas"
  ON areas
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id uuid REFERENCES areas(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_type text NOT NULL CHECK (analysis_type IN ('urban', 'agricultural')),
  parameters jsonb NOT NULL DEFAULT '{}',
  results jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own analyses"
  ON analyses
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Mobility data table
CREATE TABLE IF NOT EXISTS mobility_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location geography(POINT,4326) NOT NULL,
  timestamp timestamptz NOT NULL,
  intensity numeric NOT NULL DEFAULT 0 CHECK (intensity >= 0 AND intensity <= 1),
  hour_of_day integer NOT NULL CHECK (hour_of_day >= 0 AND hour_of_day <= 23),
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6)
);

ALTER TABLE mobility_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mobility data is readable by authenticated users"
  ON mobility_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Transaction data table
CREATE TABLE IF NOT EXISTS transaction_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location geography(POINT,4326) NOT NULL,
  timestamp timestamptz NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  category text NOT NULL CHECK (category IN ('retail', 'food_beverage', 'services', 'entertainment')),
  merchant_id text NOT NULL
);

ALTER TABLE transaction_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Transaction data is readable by authenticated users"
  ON transaction_data
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mobility_data_location ON mobility_data USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_mobility_data_timestamp ON mobility_data (timestamp);
CREATE INDEX IF NOT EXISTS idx_transaction_data_location ON transaction_data USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_transaction_data_timestamp ON transaction_data (timestamp);
CREATE INDEX IF NOT EXISTS idx_areas_user_id ON areas (user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses (user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_area_id ON analyses (area_id);