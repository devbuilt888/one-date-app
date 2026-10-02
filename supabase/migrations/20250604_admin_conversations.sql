-- Super admin read access for match conversations and messages
DROP POLICY IF EXISTS "Super admins read all conversations" ON conversations;
CREATE POLICY "Super admins read all conversations" ON conversations
  FOR SELECT USING (is_super_admin());

DROP POLICY IF EXISTS "Super admins read all messages" ON messages;
CREATE POLICY "Super admins read all messages" ON messages
  FOR SELECT USING (is_super_admin());
