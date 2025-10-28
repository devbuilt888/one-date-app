-- Fix Events Table for Actual Structure
-- Based on your current table structure: id, title, category, description, lat, lng, location_name, starts_at, created_at

-- Add missing columns that we need for the events functionality
ALTER TABLE events ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE CASCADE;

-- Verify the updated table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events' 
ORDER BY ordinal_position;
