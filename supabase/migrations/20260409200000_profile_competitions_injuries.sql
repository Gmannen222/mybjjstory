-- Profile extensions: favorite guard, submission, training since, visibility
ALTER TABLE public.profiles
  ADD COLUMN favorite_guard text,
  ADD COLUMN favorite_submission text,
  ADD COLUMN training_since_year int,
  ADD COLUMN show_belt boolean DEFAULT true,
  ADD COLUMN show_academy boolean DEFAULT true,
  ADD COLUMN show_training_since boolean DEFAULT true,
  ADD COLUMN show_favorite_guard boolean DEFAULT false,
  ADD COLUMN show_favorite_submission boolean DEFAULT false,
  ADD COLUMN show_injuries boolean DEFAULT false,
  ADD COLUMN show_competitions boolean DEFAULT true,
  ADD COLUMN show_stats boolean DEFAULT false,
  ADD COLUMN show_feed boolean DEFAULT true;

-- ============================================================
-- COMPETITIONS
-- ============================================================
CREATE TABLE public.competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_name text NOT NULL,
  event_date date,
  organization text,
  weight_class text,
  belt_division text,
  gi_nogi text CHECK (gi_nogi IN ('gi', 'nogi')),
  result text CHECK (result IN ('gold', 'silver', 'bronze', 'participant')),
  wins int DEFAULT 0,
  losses int DEFAULT 0,
  source text DEFAULT 'manual' CHECK (source IN ('manual', 'smoothcomp', 'ibjjf', 'adcc', 'other')),
  source_url text,
  source_id text,
  verified boolean DEFAULT false,
  notes text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brukere kan se egne konkurranser"
  ON public.competitions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Offentlige konkurranser er synlige"
  ON public.competitions FOR SELECT
  USING (is_public = true);

CREATE POLICY "Brukere kan opprette egne konkurranser"
  ON public.competitions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Brukere kan oppdatere egne konkurranser"
  ON public.competitions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Brukere kan slette egne konkurranser"
  ON public.competitions FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_competitions_user ON public.competitions(user_id, event_date DESC);

-- ============================================================
-- INJURIES
-- ============================================================
CREATE TABLE public.injuries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body_part text NOT NULL,
  injury_type text CHECK (injury_type IN ('sprain', 'tear', 'fracture', 'bruise', 'dislocation', 'other')),
  description text,
  date_occurred date NOT NULL DEFAULT current_date,
  date_recovered date,
  severity text DEFAULT 'mild' CHECK (severity IN ('mild', 'moderate', 'severe')),
  training_impact text DEFAULT 'none' CHECK (training_impact IN ('none', 'modified', 'rest')),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.injuries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brukere kan se egne skader"
  ON public.injuries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Brukere kan opprette egne skader"
  ON public.injuries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Brukere kan oppdatere egne skader"
  ON public.injuries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Brukere kan slette egne skader"
  ON public.injuries FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_injuries_user ON public.injuries(user_id, date_occurred DESC);
