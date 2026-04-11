ALTER TABLE academies ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'visible';
ALTER TABLE academies ADD CONSTRAINT academies_visibility_check CHECK (visibility IN ('visible', 'hidden'));
