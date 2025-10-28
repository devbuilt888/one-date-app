-- Event Attendance and Interaction Tables
-- Run this in your Supabase SQL Editor

-- Create event_attendance table
CREATE TABLE IF NOT EXISTS event_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'not_attending')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Create event_likes table
CREATE TABLE IF NOT EXISTS event_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS for new tables
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_attendance
CREATE POLICY "Users can view event attendance" ON event_attendance FOR SELECT USING (true);
CREATE POLICY "Users can manage their own event attendance" ON event_attendance FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for event_likes
CREATE POLICY "Users can view event likes" ON event_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own event likes" ON event_likes FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_attendance_event ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_user ON event_attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_event_likes_event ON event_likes(event_id);
CREATE INDEX IF NOT EXISTS idx_event_likes_user ON event_likes(user_id);

-- Create function to update updated_at timestamp for event_attendance
CREATE OR REPLACE FUNCTION update_event_attendance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for event_attendance updated_at
CREATE TRIGGER update_event_attendance_updated_at 
  BEFORE UPDATE ON event_attendance 
  FOR EACH ROW EXECUTE FUNCTION update_event_attendance_updated_at();
