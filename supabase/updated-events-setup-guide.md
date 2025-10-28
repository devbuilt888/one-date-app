# Updated Events Setup Guide
## Based on Your Actual Table Structure

Your `events` table has this structure:
- `id`, `title`, `category`, `description`, `lat`, `lng`, `location_name`, `starts_at`, `created_at`

## Step 1: Add Missing Columns

Run this in your Supabase SQL Editor:

```sql
-- Add the missing columns we need for events functionality
ALTER TABLE events ADD COLUMN IF NOT EXISTS ends_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES profiles(id) ON DELETE CASCADE;
```

## Step 2: Insert Sample Events

Run the contents of `supabase/insert-events-actual-structure.sql` in your Supabase SQL Editor.

This script:
- Uses your actual column names (`location_name` instead of `location`)
- Includes the `category` column
- Creates a dummy profile if none exist
- Inserts 6 sample events with proper data

## Step 3: Verify Setup

Check that events were inserted:

```sql
SELECT id, title, category, location_name, starts_at, max_participants FROM events ORDER BY starts_at;
```

## Step 4: Test the App

1. Navigate to `/events` in your app
2. You should see 6 events loaded from the database
3. Events should show real attendance counts and like counts
4. Join/Leave and Like functionality should work

## What's Different

### Database Structure
- Uses `location_name` instead of `location`
- Includes `category` column for event filtering
- Added missing columns: `ends_at`, `max_participants`, `created_by`

### EventsPage Updates
- Updated to use `event.location_name` instead of `event.location`
- All other functionality remains the same

## Troubleshooting

### If you get column errors:
- Make sure you ran the "Add Missing Columns" script first
- Check that all columns exist with: `SELECT column_name FROM information_schema.columns WHERE table_name = 'events';`

### If events don't load:
- Check browser console for errors
- Verify the events were inserted successfully
- Ensure RLS policies are working

### If attendance/likes don't work:
- Make sure you ran the `event-tables.sql` script to create the attendance and likes tables
- Check that the user is authenticated

## Expected Result

After setup, you should have:
- ✅ 6 sample events in your database
- ✅ Events page loading real data
- ✅ Working Join/Leave functionality
- ✅ Working Like/Unlike functionality
- ✅ Real attendance and like counts
