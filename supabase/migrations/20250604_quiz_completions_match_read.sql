-- Allow users to read quiz completions of their matches (for comparison report)
DROP POLICY IF EXISTS "Users read match partners quiz completions" ON quiz_completions;
CREATE POLICY "Users read match partners quiz completions" ON quiz_completions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM matches m
      WHERE (
        m.user_a_id = auth.uid() AND m.user_b_id = quiz_completions.user_id
      ) OR (
        m.user_b_id = auth.uid() AND m.user_a_id = quiz_completions.user_id
      )
    )
  );
