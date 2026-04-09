-- Add onboarding survey fields to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS training_preference text CHECK (training_preference IN ('gi', 'nogi', 'both')),
  ADD COLUMN IF NOT EXISTS passion_level integer CHECK (passion_level >= 1 AND passion_level <= 10),
  ADD COLUMN IF NOT EXISTS currently_training boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS heard_about_from text;
