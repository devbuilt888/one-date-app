-- Insert Sample Events for Actual Table Structure
-- Based on your table: id, title, category, description, lat, lng, location_name, starts_at, created_at
-- Plus the new columns: ends_at, max_participants, created_by

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
    
    -- Insert sample events using the actual table structure
    INSERT INTO events (id, title, category, description, lat, lng, location_name, starts_at, ends_at, max_participants, created_by) VALUES
    -- Speed Dating Night
    (gen_random_uuid(), 'Speed Dating Night', 'Dating',
     'Meet multiple potential matches in one fun evening! Structured mini-dates with great conversation starters and a relaxed atmosphere.',
     40.7589, -73.9851, 'Downtown Cafe', 
     '2024-01-15 20:00:00+00', '2024-01-15 23:00:00+00', 
     30, dummy_user_id),

    -- Wine Tasting & Mingling
    (gen_random_uuid(), 'Wine Tasting & Mingling', 'Social',
     'Discover new wines while meeting new people in a relaxed, sophisticated atmosphere. Professional sommelier will guide you through premium selections.',
     40.6782, -73.9442, 'Vintage Cellars',
     '2024-01-16 19:00:00+00', '2024-01-16 22:00:00+00',
     20, dummy_user_id),

    -- Cooking Class Date
    (gen_random_uuid(), 'Cooking Class Date', 'Activity',
     'Learn to make pasta from scratch while connecting with fellow food lovers. Perfect for breaking the ice and creating delicious memories!',
     40.7505, -73.9934, 'Culinary Studio',
     '2024-01-20 15:00:00+00', '2024-01-20 18:00:00+00',
     16, dummy_user_id),

    -- Rooftop Mixer
    (gen_random_uuid(), 'Rooftop Mixer', 'Social',
     'Enjoy stunning city views while meeting new people at this exclusive rooftop gathering. Live DJ and craft cocktails included.',
     40.7614, -73.9776, 'Sky Lounge',
     '2024-01-19 18:30:00+00', '2024-01-19 22:30:00+00',
     40, dummy_user_id),

    -- Art Gallery Walk
    (gen_random_uuid(), 'Art Gallery Walk', 'Cultural',
     'Explore contemporary art while engaging in meaningful conversations with like-minded individuals. Expert curator will provide insights.',
     40.7614, -73.9776, 'Modern Art Museum',
     '2024-01-21 14:00:00+00', '2024-01-21 17:00:00+00',
     25, dummy_user_id),

    -- Hiking & Brunch
    (gen_random_uuid(), 'Hiking & Brunch', 'Outdoor',
     'Start with a scenic hike and end with a delicious brunch. Perfect for outdoor enthusiasts and health-conscious singles!',
     40.7829, -73.9654, 'Central Park',
     '2024-01-27 09:00:00+00', '2024-01-27 13:00:00+00',
     20, dummy_user_id);
     
END $$;

-- Verify the events were inserted
SELECT id, title, category, location_name, starts_at, max_participants FROM events ORDER BY starts_at;
