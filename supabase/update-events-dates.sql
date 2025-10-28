-- Update Events Dates to Future Dates
-- The events aren't showing because they have past dates

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

