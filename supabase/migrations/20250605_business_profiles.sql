-- Business vendor fields on profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_business BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS business_address TEXT;

-- Link vendor events to business accounts
ALTER TABLE vendor_sponsored_events ADD COLUMN IF NOT EXISTS submitted_by_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_vendor_sponsored_events_submitter
  ON vendor_sponsored_events(submitted_by_user_id);

-- Businesses can read their own applications
DROP POLICY IF EXISTS "Businesses read own vendor events" ON vendor_sponsored_events;
CREATE POLICY "Businesses read own vendor events" ON vendor_sponsored_events
  FOR SELECT TO authenticated
  USING (submitted_by_user_id = auth.uid());
