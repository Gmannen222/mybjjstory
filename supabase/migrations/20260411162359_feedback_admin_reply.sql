ALTER TABLE feedback ADD COLUMN IF NOT EXISTS admin_reply text;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS replied_at timestamptz;
