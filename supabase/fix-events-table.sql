-- Fix Events Table Structure
-- Run this in your Supabase SQL Editor

-- First, let's check the current table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events' 
ORDER BY ordinal_position;

-- If the location column is missing, add it
ALTER TABLE events ADD COLUMN IF NOT EXISTS location TEXT;

-- If other columns are missing, add them
ALTER TABLE events ADD COLUMN IF NOT EXISTS lat DECIMAL(10, 8);
ALTER TABLE events ADD COLUMN IF NOT EXISTS lng DECIMAL(11, 8);
ALTER TABLE events ADD COLUMN IF NOT EXISTS starts_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE CASCADE;

-- Verify the table structure after adding columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events' 
ORDER BY ordinal_position;
