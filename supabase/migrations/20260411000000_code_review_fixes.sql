-- Code review fixes: 2026-04-11
-- Security, consistency, and constraint improvements

-- 1. Add 'admin' to the profiles.role CHECK constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('athlete', 'competitor', 'instructor', 'academy', 'admin'));

-- Set admin user role
UPDATE public.profiles SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'gmannen@gmail.com' LIMIT 1);

-- 2. Fix feedback RLS to use profiles.role instead of hardcoded email
DROP POLICY IF EXISTS "Users and admin can read feedback" ON feedback;
DROP POLICY IF EXISTS "Admin can update all feedback" ON feedback;

CREATE POLICY "Users and admin can read feedback"
  ON feedback FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update all feedback"
  ON feedback FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 3. Fix user_achievements RLS — prevent self-awarding
-- Only allow inserts via server-side (service_role) or RPC
DROP POLICY IF EXISTS "System can insert achievements" ON public.user_achievements;

CREATE POLICY "Server can insert achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (false);
-- Achievements are now only insertable via service_role or server-side calls

-- 4. Add CHECK constraints for data integrity
ALTER TABLE public.training_checklists
  ADD CONSTRAINT training_checklists_label_check
  CHECK (char_length(trim(label)) > 0);

ALTER TABLE public.feedback
  ADD CONSTRAINT feedback_contact_email_check
  CHECK (contact_email IS NULL OR contact_email ~* '^[^@]+@[^@]+\.[^@]+$');
