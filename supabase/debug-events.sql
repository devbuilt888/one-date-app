-- Debug Events Setup
-- Run this in your Supabase SQL Editor to diagnose issues

-- 1. Check if events table exists and has data
SELECT 'Events Table Check' as check_type;
SELECT COUNT(*) as event_count FROM events;
SELECT id, title, category, location_name, starts_at FROM events LIMIT 5;

-- 2. Check if profiles table has data
SELECT 'Profiles Table Check' as check_type;
SELECT COUNT(*) as profile_count FROM profiles;
SELECT id, display_name FROM profiles LIMIT 3;

-- 3. Check if event_attendance table exists
SELECT 'Event Attendance Table Check' as check_type;
SELECT COUNT(*) as attendance_count FROM event_attendance;

-- 4. Check if event_likes table exists
SELECT 'Event Likes Table Check' as check_type;
SELECT COUNT(*) as likes_count FROM event_likes;

-- 5. Check table structure
SELECT 'Events Table Structure' as check_type;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events' 
ORDER BY ordinal_position;

-- 6. Check if events have valid dates
SELECT 'Events Date Check' as check_type;
SELECT title, starts_at, 
       CASE 
         WHEN starts_at > NOW() THEN 'Future'
         WHEN starts_at <= NOW() THEN 'Past'
         ELSE 'Invalid'
       END as date_status
FROM events 
ORDER BY starts_at;

