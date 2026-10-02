-- Fix: allow SQL Editor / service role to grant super admin
-- (The original trigger silently reverted is_super_admin when auth.uid() was NULL)

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

-- Re-grant admin after fixing the trigger (replace with your user id):
-- UPDATE profiles SET is_super_admin = true WHERE id = '<your-user-uuid>';
-- SELECT id, display_name, is_super_admin FROM profiles WHERE id = '<your-user-uuid>';
