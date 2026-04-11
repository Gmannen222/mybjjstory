-- Sparring rounds table
CREATE TABLE sparring_rounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES training_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  partner_name TEXT NOT NULL,
  partner_user_id UUID REFERENCES profiles(id),
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
  technique_rating INTEGER CHECK (technique_rating >= 1 AND technique_rating <= 5),
  flow_rating INTEGER CHECK (flow_rating >= 1 AND flow_rating <= 5),
  learning_rating INTEGER CHECK (learning_rating >= 1 AND learning_rating <= 5),
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  notes TEXT,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_sparring_rounds_session ON sparring_rounds(session_id);
CREATE INDEX idx_sparring_rounds_user ON sparring_rounds(user_id);
CREATE INDEX idx_sparring_rounds_partner_user ON sparring_rounds(partner_user_id) WHERE partner_user_id IS NOT NULL;
CREATE INDEX idx_sparring_rounds_partner_name_user ON sparring_rounds(user_id, partner_name);

-- RLS
ALTER TABLE sparring_rounds ENABLE ROW LEVEL SECURITY;

-- Users can select their own rounds
CREATE POLICY "sparring_rounds_select_own"
  ON sparring_rounds FOR SELECT
  USING (user_id = auth.uid());

-- Users can see rounds shared with them
CREATE POLICY "sparring_rounds_select_shared"
  ON sparring_rounds FOR SELECT
  USING (partner_user_id = auth.uid() AND is_shared = true);

-- Users can insert their own rounds
CREATE POLICY "sparring_rounds_insert_own"
  ON sparring_rounds FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own rounds
CREATE POLICY "sparring_rounds_update_own"
  ON sparring_rounds FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own rounds
CREATE POLICY "sparring_rounds_delete_own"
  ON sparring_rounds FOR DELETE
  USING (user_id = auth.uid());
