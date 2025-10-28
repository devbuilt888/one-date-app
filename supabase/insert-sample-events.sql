-- Insert Sample Events into Database
-- Run this in your Supabase SQL Editor after running event-tables.sql and fix-events-table.sql

-- First, let's check if we have any profiles to use as created_by
-- If no profiles exist, we'll need to create a dummy one or use a specific user ID
DO $$
DECLARE
    profile_count INTEGER;
    dummy_user_id UUID;
BEGIN
    -- Check if we have any profiles
    SELECT COUNT(*) INTO profile_count FROM profiles;
    
    IF profile_count = 0 THEN
        -- Create a dummy profile for events if none exist
        INSERT INTO profiles (id, display_name, created_at) 
        VALUES (gen_random_uuid(), 'OneDate Events', NOW())
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Get a user ID to use as created_by
    SELECT id INTO dummy_user_id FROM profiles LIMIT 1;
    
    -- Insert sample events
    INSERT INTO events (id, title, description, location, lat, lng, starts_at, ends_at, max_participants, created_by) VALUES
    -- Speed Dating Night
    (gen_random_uuid(), 'Speed Dating Night', 
     'Meet multiple potential matches in one fun evening! Structured mini-dates with great conversation starters and a relaxed atmosphere.',
     'Downtown Cafe', 40.7589, -73.9851, 
     '2024-01-15 20:00:00+00', '2024-01-15 23:00:00+00', 
     30, dummy_user_id),

    -- Wine Tasting & Mingling
    (gen_random_uuid(), 'Wine Tasting & Mingling',
     'Discover new wines while meeting new people in a relaxed, sophisticated atmosphere. Professional sommelier will guide you through premium selections.',
     'Vintage Cellars', 40.6782, -73.9442,
     '2024-01-16 19:00:00+00', '2024-01-16 22:00:00+00',
     20, dummy_user_id),

    -- Cooking Class Date
    (gen_random_uuid(), 'Cooking Class Date',
     'Learn to make pasta from scratch while connecting with fellow food lovers. Perfect for breaking the ice and creating delicious memories!',
     'Culinary Studio', 40.7505, -73.9934,
     '2024-01-20 15:00:00+00', '2024-01-20 18:00:00+00',
     16, dummy_user_id),

    -- Rooftop Mixer
    (gen_random_uuid(), 'Rooftop Mixer',
     'Enjoy stunning city views while meeting new people at this exclusive rooftop gathering. Live DJ and craft cocktails included.',
     'Sky Lounge', 40.7614, -73.9776,
     '2024-01-19 18:30:00+00', '2024-01-19 22:30:00+00',
     40, dummy_user_id),

    -- Art Gallery Walk
    (gen_random_uuid(), 'Art Gallery Walk',
     'Explore contemporary art while engaging in meaningful conversations with like-minded individuals. Expert curator will provide insights.',
     'Modern Art Museum', 40.7614, -73.9776,
     '2024-01-21 14:00:00+00', '2024-01-21 17:00:00+00',
     25, dummy_user_id),

    -- Hiking & Brunch
    (gen_random_uuid(), 'Hiking & Brunch',
     'Start with a scenic hike and end with a delicious brunch. Perfect for outdoor enthusiasts and health-conscious singles!',
     'Central Park', 40.7829, -73.9654,
     '2024-01-27 09:00:00+00', '2024-01-27 13:00:00+00',
     20, dummy_user_id);
     
END $$;

-- Add some sample event attendance (optional - for testing)
-- You can uncomment these lines to add some sample attendees
/*
INSERT INTO event_attendance (event_id, user_id, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM profiles LIMIT 1), 'attending'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM profiles OFFSET 1 LIMIT 1), 'attending'),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM profiles LIMIT 1), 'attending'),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM profiles OFFSET 1 LIMIT 1), 'attending');
*/

-- Add some sample event likes (optional - for testing)
/*
INSERT INTO event_likes (event_id, user_id) VALUES
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM profiles LIMIT 1)),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM profiles LIMIT 1)),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM profiles LIMIT 1));
*/

-- Verify the events were inserted
SELECT id, title, location, starts_at, max_participants FROM events ORDER BY starts_at;
