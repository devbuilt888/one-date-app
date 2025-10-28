# Complete Events Setup Guide

## Current Status
✅ Events are now loading from the database  
✅ Basic events functionality is working  
⚠️ Join/Leave and Like functionality requires additional tables

## What's Working Now
- Events page loads events from database
- Events display with correct information
- Basic event cards and details modal work

## To Complete Full Functionality

### Step 1: Create Event Attendance and Likes Tables
Run this in your Supabase SQL Editor:

```sql
-- Create event_attendance table
CREATE TABLE IF NOT EXISTS event_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'not_attending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create event_likes table
CREATE TABLE IF NOT EXISTS event_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS for new tables
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_attendance
CREATE POLICY "Users can view event attendance" ON event_attendance FOR SELECT USING (true);
CREATE POLICY "Users can manage their own event attendance" ON event_attendance FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for event_likes
CREATE POLICY "Users can view event likes" ON event_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own event likes" ON event_likes FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_attendance_event ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_user ON event_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_event_likes_event ON event_likes(event_id);
CREATE INDEX IF NOT EXISTS idx_event_likes_user ON event_likes(user_id);
```

### Step 2: Update Events Functions
After creating the tables, the events functions will automatically work with full functionality.

## Test the Complete Setup

1. **Events Load**: Navigate to `/events` - should see 6 events
2. **Join Events**: Click "Join Event" button - should work
3. **Like Events**: Click heart icon - should work  
4. **Real Counts**: Attendance and like counts should update

## Current Features

### ✅ Working Now
- Events display from database
- Event details modal
- Basic event information
- Responsive design

### 🔄 After Step 1
- Join/Leave events
- Like/Unlike events
- Real attendance counts
- Real like counts
- User-specific status tracking

## Troubleshooting

### If events still don't load:
- Check browser console for errors
- Verify events exist in database: `SELECT * FROM events;`
- Check user authentication

### If Join/Like buttons don't work:
- Make sure you ran the table creation script
- Check that RLS policies are working
- Verify user is authenticated

