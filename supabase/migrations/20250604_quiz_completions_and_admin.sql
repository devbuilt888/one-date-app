-- Quiz completions + super admin support
-- Run in Supabase SQL Editor or via Supabase CLI migrations

-- Super admin flag on profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT false;

-- Prevent users from promoting themselves to super admin.
-- SQL Editor / service role runs with auth.uid() IS NULL and is allowed to grant admin.
CREATE OR REPLACE FUNCTION protect_is_super_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF auth.uid() IS NOT NULL THEN
      NEW.is_super_admin := false;
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.is_super_admin IS DISTINCT FROM COALESCE(OLD.is_super_admin, false) THEN
    IF auth.uid() IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND is_super_admin = true
    ) THEN
      NEW.is_super_admin := COALESCE(OLD.is_super_admin, false);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS protect_is_super_admin_trigger ON profiles;
CREATE TRIGGER protect_is_super_admin_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION protect_is_super_admin();

-- Helper used in RLS policies
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    (SELECT is_super_admin FROM profiles WHERE id = auth.uid()),
    false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Quiz completion results (final outcome only, no individual answers)
CREATE TABLE IF NOT EXISTS quiz_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id TEXT NOT NULL,
  result_label TEXT NOT NULL,
  result_key TEXT,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, quiz_id)
);

CREATE INDEX IF NOT EXISTS idx_quiz_completions_user ON quiz_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_completions_quiz ON quiz_completions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_completions_completed_at ON quiz_completions(completed_at DESC);

ALTER TABLE quiz_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own quiz completions" ON quiz_completions;
CREATE POLICY "Users read own quiz completions" ON quiz_completions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own quiz completions" ON quiz_completions;
CREATE POLICY "Users insert own quiz completions" ON quiz_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own quiz completions" ON quiz_completions;
CREATE POLICY "Users update own quiz completions" ON quiz_completions
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Super admins read all quiz completions" ON quiz_completions;
CREATE POLICY "Super admins read all quiz completions" ON quiz_completions
  FOR SELECT USING (is_super_admin());

-- Super admin access to matches and likes
DROP POLICY IF EXISTS "Super admins read all matches" ON matches;
CREATE POLICY "Super admins read all matches" ON matches
  FOR SELECT USING (is_super_admin());

DROP POLICY IF EXISTS "Super admins read all likes" ON likes;
CREATE POLICY "Super admins read all likes" ON likes
  FOR SELECT USING (is_super_admin());

-- RPC: fetch auth emails for super admins only
CREATE OR REPLACE FUNCTION admin_get_user_emails()
RETURNS TABLE (user_id UUID, email TEXT)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT u.id AS user_id, u.email::TEXT
  FROM auth.users u
  WHERE is_super_admin();
$$;

REVOKE ALL ON FUNCTION admin_get_user_emails() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION admin_get_user_emails() TO authenticated;

-- To grant super admin (run manually in Supabase SQL Editor):
-- UPDATE profiles SET is_super_admin = true WHERE id = '<your-user-uuid>';
-- Verify: SELECT id, display_name, is_super_admin FROM profiles WHERE is_super_admin = true;
