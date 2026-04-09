-- Feedback / suggestions table
CREATE TABLE feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('suggestion', 'wish', 'bug', 'other')),
  message text NOT NULL,
  contact_email text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'resolved')),
  created_at timestamptz DEFAULT now()
);

-- Users can insert their own feedback and read their own
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own feedback"
  ON feedback FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own feedback"
  ON feedback FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_feedback_user ON feedback(user_id);
CREATE INDEX idx_feedback_status ON feedback(status);
