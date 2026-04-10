-- Add admin_note column to feedback
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS admin_note text;

-- Drop the existing "users can read own" policy so we can replace it
-- with one that also allows admin to read all
DROP POLICY IF EXISTS "Users can read own feedback" ON feedback;

-- Users can read own feedback, admin (by email) can read all
CREATE POLICY "Users and admin can read feedback"
  ON feedback FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR (auth.jwt() ->> 'email') = 'glenn@mybjjstory.no'
  );

-- Admin can update any feedback (status, admin_note)
CREATE POLICY "Admin can update all feedback"
  ON feedback FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'glenn@mybjjstory.no')
  WITH CHECK ((auth.jwt() ->> 'email') = 'glenn@mybjjstory.no');
