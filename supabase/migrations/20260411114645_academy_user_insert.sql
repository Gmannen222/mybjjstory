-- Add submitted_by column to track who submitted a new academy
ALTER TABLE academies
ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES profiles(id);

-- Allow authenticated users to insert academies with is_active = false
CREATE POLICY "Users can add academies"
ON academies
FOR INSERT
TO authenticated
WITH CHECK (is_active = false);
