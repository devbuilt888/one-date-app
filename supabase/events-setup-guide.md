# Events Setup Guide

## Step 1: Run Database Scripts

### 1.1 Create Event Tables
Run the contents of `supabase/event-tables.sql` in your Supabase SQL Editor:
```sql
-- This creates event_attendance and event_likes tables
-- Copy and paste the entire file content
```

### 1.2 Insert Sample Events
Run the contents of `supabase/insert-sample-events.sql` in your Supabase SQL Editor:
```sql
-- This inserts 6 sample events with all the data
-- Copy and paste the entire file content
```

## Step 2: Verify Setup

### 2.1 Check Tables Created
In your Supabase dashboard, verify these tables exist:
- `events` - Main events table
- `event_attendance` - Who's attending events
- `event_likes` - Which events are liked

### 2.2 Check Sample Data
Run this query to verify events were inserted:
```sql
SELECT id, title, location, starts_at, max_participants FROM events ORDER BY starts_at;
```

## Step 3: Test the App

### 3.1 Events Page
- Navigate to `/events` in your app
- You should see 6 events loaded from the database
- Events should show real attendance counts and like counts

### 3.2 Event Interactions
- **Join/Leave Events**: Click "Join Event" button
- **Like Events**: Click the heart icon
- **View Details**: Click "Details" button for full event info

### 3.3 Real-time Updates
- Attendance counts update immediately
- Like counts update immediately
- User status persists across page refreshes

## Step 4: Features Available

### ✅ **Event Management**
- View all upcoming events
- Filter by category (Dating, Social, Activity, etc.)
- Real-time attendance and like counts

### ✅ **User Interactions**
- Join/leave events
- Like/unlike events
- View event details

### ✅ **Database Features**
- Secure RLS policies
- Optimized queries with indexes
- Real-time data updates

## Step 5: Customization

### 5.1 Add More Events
Insert new events using this format:
```sql
INSERT INTO events (title, description, location, lat, lng, starts_at, ends_at, max_participants, created_by) 
VALUES ('Your Event', 'Description', 'Location', 40.7589, -73.9851, '2024-01-20 19:00:00+00', '2024-01-20 22:00:00+00', 25, (SELECT id FROM profiles LIMIT 1));
```

### 5.2 Modify Event Categories
Update the categories array in `EventsPage.js`:
```javascript
const categories = ['All', 'Dating', 'Social', 'Activity', 'Cultural', 'Outdoor', 'YourCategory'];
```

## Troubleshooting

### Events Not Loading
- Check browser console for errors
- Verify database tables exist
- Ensure RLS policies are correct

### Attendance Not Working
- Check if user is authenticated
- Verify event_attendance table exists
- Check RLS policies for event_attendance

### Likes Not Working
- Check if user is authenticated
- Verify event_likes table exists
- Check RLS policies for event_likes

## Database Structure

```
events (event data)
    ↓
event_attendance (who's attending)
    ↓
event_likes (which events are liked)
```

## Security Features

- **Row Level Security**: Users can only see their own attendance/likes
- **Authentication Required**: All operations require user login
- **Data Validation**: Proper constraints and checks
- **Optimized Queries**: Indexes for fast performance
