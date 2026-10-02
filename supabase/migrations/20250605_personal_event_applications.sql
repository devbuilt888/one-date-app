-- Applications to join personal events
CREATE TABLE IF NOT EXISTS personal_event_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES personal_events(id) ON DELETE CASCADE,
  applicant_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'matched', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_id, applicant_user_id)
);

CREATE INDEX IF NOT EXISTS idx_pe_applications_event ON personal_event_applications(event_id);
CREATE INDEX IF NOT EXISTS idx_pe_applications_applicant ON personal_event_applications(applicant_user_id);
CREATE INDEX IF NOT EXISTS idx_pe_applications_status ON personal_event_applications(status);

ALTER TABLE personal_event_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users apply to personal events" ON personal_event_applications;
CREATE POLICY "Users apply to personal events" ON personal_event_applications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = applicant_user_id);

DROP POLICY IF EXISTS "Applicants read own applications" ON personal_event_applications;
CREATE POLICY "Applicants read own applications" ON personal_event_applications
  FOR SELECT TO authenticated
  USING (auth.uid() = applicant_user_id);

DROP POLICY IF EXISTS "Hosts read applications for their events" ON personal_event_applications;
CREATE POLICY "Hosts read applications for their events" ON personal_event_applications
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM personal_events pe
      WHERE pe.id = event_id AND pe.host_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Hosts update applications for their events" ON personal_event_applications;
CREATE POLICY "Hosts update applications for their events" ON personal_event_applications
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM personal_events pe
      WHERE pe.id = event_id AND pe.host_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Super admins read personal event applications" ON personal_event_applications;
CREATE POLICY "Super admins read personal event applications" ON personal_event_applications
  FOR SELECT USING (is_super_admin());
