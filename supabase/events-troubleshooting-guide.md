# Events Troubleshooting Guide

## Step 1: Run Diagnostic Script
Run the contents of `supabase/debug-events.sql` in your Supabase SQL Editor to check:
- If events exist in the database
- If the table structure is correct
- If events have valid dates

## Step 2: Fix Date Issues (Most Likely Cause)
The events probably have past dates. Run this to update them to future dates:

```sql
-- Update all events to have future dates
UPDATE events 
SET starts_at = NOW() + INTERVAL '1 day' + (random() * INTERVAL '30 days'),
    ends_at = starts_at + INTERVAL '3 hours'
WHERE starts_at < NOW();

-- Verify the updates
SELECT title, starts_at, ends_at, 
       CASE 
         WHEN starts_at > NOW() THEN 'Future ✓'
         ELSE 'Still Past'
       END as status
FROM events 
ORDER BY starts_at;
```

## Step 3: Check Browser Console
1. Open your app in the browser
2. Go to `/events` page
3. Open Developer Tools (F12)
4. Check the Console tab for any errors

Look for errors like:
- `Error fetching events: [error details]`
- `Exception loading events: [error details]`
- Network errors

## Step 4: Verify Database Connection
Check if your Supabase connection is working:

```sql
-- Test basic query
SELECT COUNT(*) FROM events;
SELECT title FROM events LIMIT 1;
```

## Step 5: Check Authentication
Make sure you're logged in:
1. Go to your app
2. Check if you're logged in (should see user info)
3. If not logged in, create an account or log in

## Step 6: Manual Test
Try this simple test in your browser console (on the events page):

```javascript
// Test if the events function works
import { events } from './src/lib/supabase.js';
events.getAll().then(result => console.log(result));
```

## Common Issues & Solutions

### Issue 1: Events have past dates
**Solution**: Run the date update script above

### Issue 2: No events in database
**Solution**: Re-run the insert script:
```sql
-- Re-run the insert script
-- Copy and paste the contents of insert-events-simple.sql
```

### Issue 3: Authentication issues
**Solution**: Make sure you're logged in and have a profile

### Issue 4: RLS (Row Level Security) blocking access
**Solution**: Check if RLS policies are correct:
```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'events';
```

### Issue 5: Network/Connection issues
**Solution**: Check your Supabase URL and API key in the config

## Expected Results

After running the date update script, you should see:
- 6 events in the database with future dates
- Events page loads successfully
- Event cards display with correct information

## Still Not Working?

If events still don't show after these steps:
1. Check the browser console for specific error messages
2. Verify your Supabase connection settings
3. Make sure you're logged in as a user
4. Check if the events table has the correct structure

