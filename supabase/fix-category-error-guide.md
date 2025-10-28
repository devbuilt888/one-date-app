# Fix Category NOT NULL Error

## The Problem
You're getting: `ERROR: 23502: null value in column "category" of relation "events" violates not-null constraint`

This means the `category` column is required (NOT NULL) but we're not providing a value.

## Solution

### Step 1: Add Missing Columns First
Run this in your Supabase SQL Editor:

```sql
-- Add the missing columns we need for events functionality
ALTER TABLE events ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE CASCADE;
```

### Step 2: Use the Simple Insert Script
Run the contents of `supabase/insert-events-simple.sql` in your Supabase SQL Editor.

This script:
- ✅ Includes the `category` column in the INSERT statement
- ✅ Provides a category value for each event
- ✅ Uses your actual table structure
- ✅ Handles the NOT NULL constraint

### Step 3: Verify Success
After running the script, you should see:
```
6 rows inserted
```

And a list of events with their categories.

## Alternative: Make Category Optional

If you want to make the category column optional instead of required:

```sql
-- Make category column nullable
ALTER TABLE events ALTER COLUMN category DROP NOT NULL;
```

Then you can insert events without categories if needed.

## What Each Event Category Is:

- **Speed Dating Night** → `Dating`
- **Wine Tasting & Mingling** → `Social`  
- **Cooking Class Date** → `Activity`
- **Rooftop Mixer** → `Social`
- **Art Gallery Walk** → `Cultural`
- **Hiking & Brunch** → `Outdoor`

## Expected Result

After running the simple insert script, you should have 6 events in your database with proper categories, and the events page should load them correctly.
