-- Session feedback: let users send feedback to training partners after a session
CREATE TABLE session_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL CHECK (char_length(message) >= 1),
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('tip', 'encouragement', 'observation', 'question')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_session_feedback_session ON session_feedback(session_id);
CREATE INDEX idx_session_feedback_sender ON session_feedback(sender_id);
CREATE INDEX idx_session_feedback_recipient ON session_feedback(recipient_id);
CREATE INDEX idx_session_feedback_recipient_unread ON session_feedback(recipient_id) WHERE is_read = false;

-- RLS
ALTER TABLE session_feedback ENABLE ROW LEVEL SECURITY;

-- Sender can see their own sent feedback
CREATE POLICY "session_feedback_select_sender"
  ON session_feedback FOR SELECT
  USING (sender_id = auth.uid());

-- Recipient can see feedback sent to them
CREATE POLICY "session_feedback_select_recipient"
  ON session_feedback FOR SELECT
  USING (recipient_id = auth.uid());

-- Sender can insert feedback (must be the sender)
CREATE POLICY "session_feedback_insert_sender"
  ON session_feedback FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Recipient can update (mark as read)
CREATE POLICY "session_feedback_update_recipient"
  ON session_feedback FOR UPDATE
  USING (recipient_id = auth.uid())
  WITH CHECK (recipient_id = auth.uid());

-- Sender can delete their own feedback
CREATE POLICY "session_feedback_delete_sender"
  ON session_feedback FOR DELETE
  USING (sender_id = auth.uid());
