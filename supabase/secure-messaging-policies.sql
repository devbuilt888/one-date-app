-- Enhanced RLS Policies for Secure Messaging
-- Run this in your Supabase SQL Editor to ensure proper security

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view conversations for their matches" ON conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON messages;

-- Enhanced RLS Policies for conversations
CREATE POLICY "Users can view conversations for their matches" ON conversations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM matches 
    WHERE matches.id = conversations.match_id 
    AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
  )
);

-- Enhanced RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations 
    JOIN matches ON conversations.match_id = matches.id
    WHERE conversations.id = messages.conversation_id 
    AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
  )
);

CREATE POLICY "Users can insert messages in their conversations" ON messages FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM conversations 
    JOIN matches ON conversations.match_id = matches.id
    WHERE conversations.id = messages.conversation_id 
    AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
  )
);

-- Verify the policies are working
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('conversations', 'messages')
ORDER BY tablename, policyname;
