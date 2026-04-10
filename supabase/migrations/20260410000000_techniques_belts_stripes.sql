-- ============================================================
-- TECHNIQUE LIBRARY (user custom techniques)
-- ============================================================
CREATE TABLE user_techniques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text CHECK (category IN ('guard', 'pass', 'sweep', 'submission', 'takedown', 'escape', 'other')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE user_techniques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own techniques"
  ON user_techniques FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own techniques"
  ON user_techniques FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own techniques"
  ON user_techniques FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_user_techniques_user ON user_techniques(user_id);

-- ============================================================
-- EXPAND BELT RANKS (add kids belts)
-- ============================================================
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_belt_rank_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_belt_rank_check
  CHECK (belt_rank IN (
    'white',
    'grey_white', 'grey', 'grey_black',
    'yellow_white', 'yellow', 'yellow_black',
    'orange_white', 'orange', 'orange_black',
    'green_white', 'green', 'green_black',
    'blue', 'purple', 'brown', 'black'
  ));

ALTER TABLE gradings DROP CONSTRAINT IF EXISTS gradings_belt_rank_check;
ALTER TABLE gradings ADD CONSTRAINT gradings_belt_rank_check
  CHECK (belt_rank IN (
    'white',
    'grey_white', 'grey', 'grey_black',
    'yellow_white', 'yellow', 'yellow_black',
    'orange_white', 'orange', 'orange_black',
    'green_white', 'green', 'green_black',
    'blue', 'purple', 'brown', 'black'
  ));

-- ============================================================
-- GRADING TYPE + STRIPE DATES
-- ============================================================
ALTER TABLE gradings ADD COLUMN IF NOT EXISTS grading_type text NOT NULL DEFAULT 'belt'
  CHECK (grading_type IN ('belt', 'stripe'));

-- Profile toggle for showing kids belts in progression
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS show_kids_belts boolean DEFAULT false;
