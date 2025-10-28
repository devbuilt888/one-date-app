# Fix Events Table Error Guide

## The Problem
You're getting this error: `ERROR: 42703: column "location" of relation "events" does not exist`

This means the `events` table is missing the `location` column or other required columns.

## Solution Steps

### Step 1: Fix the Events Table Structure
Run this in your Supabase SQL Editor:

```sql
-- Check current table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events' 
ORDER BY ordinal_position;
```

### Step 2: Add Missing Columns
If the `location` column is missing, run this:

```sql
-- Add missing columns to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS lat DECIMAL(10, 8);
ALTER TABLE events ADD COLUMN IF NOT EXISTS lng DECIMAL(11, 8);
ALTER TABLE events ADD COLUMN IF NOT EXISTS starts_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE CASCADE;
```

### Step 3: Verify Table Structure
Check that all columns exist:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events' 
ORDER BY ordinal_position;
```

You should see these columns:
- id
- title
- description
- location
- lat
- lng
- starts_at
- ends_at
- max_participants
- created_by
- created_at

### Step 4: Run the Updated Insert Script
Now run the updated `supabase/insert-sample-events.sql` script.

## Alternative: Recreate the Events Table

If the above doesn't work, you can drop and recreate the table:

```sql
-- Drop existing events table (WARNING: This will delete all existing events)
DROP TABLE IF EXISTS events CASCADE;

-- Recreate events table with correct structure
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  starts_at TIMESTAMP WITH TIME ZONE,
  ends_at TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view all events" ON events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (auth.uid() = created_by);
```

## Quick Fix Script

Run this single script to fix everything:

```sql
-- Fix events table structure
ALTER TABLE events ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS lat DECIMAL(10, 8);
ALTER TABLE events ADD COLUMN IF NOT EXISTS lng DECIMAL(11, 8);
ALTER TABLE events ADD COLUMN IF NOT EXISTS starts_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE CASCADE;

-- Verify the fix
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'events' ORDER BY ordinal_position;
```

After running this, try the insert script again!
