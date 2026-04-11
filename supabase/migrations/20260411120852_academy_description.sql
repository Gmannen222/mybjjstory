-- Add description and head_instructor to academies
ALTER TABLE academies ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE academies ADD COLUMN IF NOT EXISTS head_instructor TEXT;
