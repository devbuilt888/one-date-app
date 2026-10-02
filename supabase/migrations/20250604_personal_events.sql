-- Personal events (user-created date plans)
CREATE TABLE IF NOT EXISTS personal_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  host_name TEXT,
  title TEXT NOT NULL,
  approximate_location TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'restaurant',
  description TEXT NOT NULL,
  event_datetime TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_personal_events_host ON personal_events(host_user_id);
CREATE INDEX IF NOT EXISTS idx_personal_events_datetime ON personal_events(event_datetime DESC);
CREATE INDEX IF NOT EXISTS idx_personal_events_created_at ON personal_events(created_at DESC);

ALTER TABLE personal_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users read personal events" ON personal_events;
CREATE POLICY "Authenticated users read personal events" ON personal_events
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users insert own personal events" ON personal_events;
CREATE POLICY "Users insert own personal events" ON personal_events
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = host_user_id);

DROP POLICY IF EXISTS "Users update own personal events" ON personal_events;
CREATE POLICY "Users update own personal events" ON personal_events
  FOR UPDATE TO authenticated USING (auth.uid() = host_user_id);

DROP POLICY IF EXISTS "Users delete own personal events" ON personal_events;
CREATE POLICY "Users delete own personal events" ON personal_events
  FOR DELETE TO authenticated USING (auth.uid() = host_user_id);

DROP POLICY IF EXISTS "Super admins read all personal events" ON personal_events;
CREATE POLICY "Super admins read all personal events" ON personal_events
  FOR SELECT USING (is_super_admin());
