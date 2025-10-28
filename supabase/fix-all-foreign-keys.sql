-- Fix All Foreign Key Constraints
-- Run this in your Supabase SQL Editor

-- 1. Fix matches table foreign keys
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_user_a_id_fkey;
ALTER TABLE matches ADD CONSTRAINT matches_user_a_id_fkey 
  FOREIGN KEY (user_a_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_user_b_id_fkey;
ALTER TABLE matches ADD CONSTRAINT matches_user_b_id_fkey 
  FOREIGN KEY (user_b_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 2. Fix likes table foreign keys
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_from_user_id_fkey;
ALTER TABLE likes ADD CONSTRAINT likes_from_user_id_fkey 
  FOREIGN KEY (from_user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_to_user_id_fkey;
ALTER TABLE likes ADD CONSTRAINT likes_to_user_id_fkey 
  FOREIGN KEY (to_user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 3. Fix conversations table foreign key
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_match_id_fkey;
ALTER TABLE conversations ADD CONSTRAINT conversations_match_id_fkey 
  FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE;

-- 4. Fix messages table foreign keys
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE messages ADD CONSTRAINT messages_sender_id_fkey 
  FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_conversation_id_fkey;
ALTER TABLE messages ADD CONSTRAINT messages_conversation_id_fkey 
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE;

-- 5. Verify all constraints were created
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM 
  information_schema.table_constraints AS tc 
  JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;
