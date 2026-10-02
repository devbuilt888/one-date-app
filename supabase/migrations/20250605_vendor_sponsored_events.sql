-- Vendor / business sponsored events
CREATE TABLE IF NOT EXISTS vendor_sponsored_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  business_website TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Social',
  image_url TEXT,
  event_starts_at TIMESTAMPTZ NOT NULL,
  event_ends_at TIMESTAMPTZ,
  proposed_active_from TIMESTAMPTZ,
  proposed_active_until TIMESTAMPTZ,
  active_from TIMESTAMPTZ,
  active_until TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'active', 'rejected', 'expired')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendor_sponsored_events_status ON vendor_sponsored_events(status);
CREATE INDEX IF NOT EXISTS idx_vendor_sponsored_events_active_window
  ON vendor_sponsored_events(active_from, active_until)
  WHERE status = 'active';

ALTER TABLE vendor_sponsored_events ENABLE ROW LEVEL SECURITY;

-- Public vendor registration (pending applications only)
DROP POLICY IF EXISTS "Anyone can submit vendor applications" ON vendor_sponsored_events;
CREATE POLICY "Anyone can submit vendor applications" ON vendor_sponsored_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');

-- Authenticated users see currently active sponsored events
DROP POLICY IF EXISTS "Users read active sponsored events" ON vendor_sponsored_events;
CREATE POLICY "Users read active sponsored events" ON vendor_sponsored_events
  FOR SELECT TO authenticated
  USING (
    status = 'active'
    AND active_from IS NOT NULL
    AND active_until IS NOT NULL
    AND active_from <= NOW()
    AND active_until >= NOW()
  );

-- Super admins full access
DROP POLICY IF EXISTS "Super admins manage vendor events" ON vendor_sponsored_events;
CREATE POLICY "Super admins manage vendor events" ON vendor_sponsored_events
  FOR ALL USING (is_super_admin());
