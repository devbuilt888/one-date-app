# Database Setup Guide

## Step 1: Run the Database Schema

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database-schema.sql`
4. Click **Run** to execute the schema

## Step 2: Verify Tables Created

After running the schema, you should see these tables in your **Table Editor**:

- `profiles` - User profile information
- `likes` - User likes/swipes
- `matches` - Mutual matches between users
- `conversations` - Chat conversations for matches
- `messages` - Individual messages in conversations
- `events` - Dating events (for future use)

## Step 3: Test the Setup

1. **Test Profile Creation**: Try creating a profile in your app
2. **Test Matching**: Try liking another user
3. **Test Chat**: If you get a match, try sending a message

## Step 4: Troubleshooting

### If you get permission errors:
- Make sure you're logged in as an authenticated user
- Check that RLS policies are working correctly
- Verify that the user has a profile record

### If matches aren't being created:
- Check the `likes` table to see if likes are being recorded
- Verify that the matching logic is working in the edge function
- Check the browser console for any errors

### If chat isn't working:
- Verify that conversations are being created when matches happen
- Check that messages are being inserted into the `messages` table
- Ensure the real-time subscriptions are working

## Database Structure Overview

```
profiles (user data)
    ↓
likes (swipes/likes)
    ↓ (when mutual)
matches (mutual matches)
    ↓
conversations (chat rooms)
    ↓
messages (individual messages)
```

## Key Features

- **Row Level Security (RLS)**: Ensures users can only see their own data and matches
- **Real-time**: Messages update in real-time using Supabase subscriptions
- **Optimized**: Indexes for fast queries on location, matches, and messages
- **Scalable**: Designed to handle many users and conversations
