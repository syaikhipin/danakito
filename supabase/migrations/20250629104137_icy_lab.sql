/*
  # Generate Mock Data for Investment Analysis Platform

  1. Mock Data Generation
    - Mobility data: 24 months of hourly foot traffic patterns
    - Transaction data: Daily transaction records with realistic amounts and categories
    - Geographic bounds: NYC area with realistic coordinate distribution
    - Time patterns: Peak hours, weekend variations, seasonal adjustments

  2. Data Volume
    - Mobility: ~35,000 records (24 months × 30 days × 24 hours × ~20 points)
    - Transactions: ~50,000 records (24 months × 30 days × ~70 transactions)

  3. Realistic Patterns
    - Higher mobility during business hours and weekends
    - Transaction amounts vary by category (retail, food, services, entertainment)
    - Geographic clustering around NYC center with natural distribution
*/

-- Function to generate random point within NYC bounds
CREATE OR REPLACE FUNCTION random_nyc_point()
RETURNS geography AS $$
BEGIN
  RETURN ST_SetSRID(
    ST_MakePoint(
      -74.0060 + (random() - 0.5) * 0.2,  -- Longitude: NYC ± 0.1 degrees
      40.7128 + (random() - 0.5) * 0.15   -- Latitude: NYC ± 0.075 degrees
    ),
    4326
  )::geography;
END;
$$ LANGUAGE plpgsql;

-- Generate mobility data (past 24 months, hourly samples)
DO $$
DECLARE
  start_date timestamptz := now() - interval '24 months';
  loop_timestamp timestamptz;
  hour_intensity numeric;
  day_multiplier numeric;
  points_per_hour integer;
  i integer;
BEGIN
  loop_timestamp := start_date;
  
  WHILE loop_timestamp <= now() LOOP
    -- Calculate intensity based on hour and day
    hour_intensity := CASE 
      WHEN EXTRACT(hour FROM loop_timestamp) BETWEEN 7 AND 9 THEN 0.8 + random() * 0.2
      WHEN EXTRACT(hour FROM loop_timestamp) BETWEEN 11 AND 14 THEN 0.9 + random() * 0.1
      WHEN EXTRACT(hour FROM loop_timestamp) BETWEEN 17 AND 19 THEN 0.7 + random() * 0.3
      ELSE 0.2 + random() * 0.4
    END;
    
    -- Weekend multiplier
    day_multiplier := CASE 
      WHEN EXTRACT(dow FROM loop_timestamp) IN (0, 6) THEN 0.6 + random() * 0.3
      ELSE 1.0
    END;
    
    hour_intensity := hour_intensity * day_multiplier;
    points_per_hour := (20 + random() * 30)::integer;
    
    -- Insert mobility points for this hour
    FOR i IN 1..points_per_hour LOOP
      INSERT INTO mobility_data (location, timestamp, intensity, hour_of_day, day_of_week)
      VALUES (
        random_nyc_point(),
        loop_timestamp + (random() * interval '1 hour'),
        LEAST(1.0, GREATEST(0.0, hour_intensity + (random() - 0.5) * 0.2)),
        EXTRACT(hour FROM loop_timestamp)::integer,
        EXTRACT(dow FROM loop_timestamp)::integer
      );
    END LOOP;
    
    loop_timestamp := loop_timestamp + interval '1 hour';
  END LOOP;
END $$;

-- Generate transaction data
DO $$
DECLARE
  start_date timestamptz := now() - interval '24 months';
  loop_date date;
  transactions_per_day integer;
  categories text[] := ARRAY['retail', 'food_beverage', 'services', 'entertainment'];
  selected_category text;
  transaction_amount numeric;
  i integer;
  category_index integer;
BEGIN
  loop_date := start_date::date;
  
  WHILE loop_date <= now()::date LOOP
    -- More transactions on weekends and holidays
    transactions_per_day := CASE 
      WHEN EXTRACT(dow FROM loop_date) IN (0, 6) THEN 80 + (random() * 40)::integer
      ELSE 50 + (random() * 30)::integer
    END;
    
    FOR i IN 1..transactions_per_day LOOP
      -- Safely select category
      category_index := 1 + (random() * (array_length(categories, 1) - 1))::integer;
      selected_category := categories[category_index];
      
      -- Ensure selected_category is not null
      IF selected_category IS NULL THEN
        selected_category := 'retail';
      END IF;
      
      -- Amount varies by category with guaranteed non-null values
      transaction_amount := CASE selected_category
        WHEN 'retail' THEN 15.0 + random() * 200.0
        WHEN 'food_beverage' THEN 8.0 + random() * 50.0
        WHEN 'services' THEN 25.0 + random() * 300.0
        WHEN 'entertainment' THEN 12.0 + random() * 150.0
        ELSE 20.0 + random() * 100.0  -- Default fallback
      END;
      
      -- Ensure amount is never null and within valid range
      transaction_amount := GREATEST(5.0, LEAST(500.0, transaction_amount));
      
      INSERT INTO transaction_data (location, timestamp, amount, category, merchant_id)
      VALUES (
        random_nyc_point(),
        loop_date::timestamptz + (random() * interval '24 hours'),
        ROUND(transaction_amount, 2),
        selected_category,
        'merchant_' || (1000 + (random() * 9000)::integer)
      );
    END LOOP;
    
    loop_date := loop_date + interval '1 day';
  END LOOP;
END $$;

-- Clean up the helper function
DROP FUNCTION random_nyc_point();