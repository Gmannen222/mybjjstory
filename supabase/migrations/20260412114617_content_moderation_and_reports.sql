-- ============================================================
-- CONTENT MODERATION: reports table + moderation columns
-- ============================================================

-- Content reports table (users flag inappropriate content)
CREATE TABLE content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text NOT NULL CHECK (content_type IN ('post', 'comment', 'media')),
  content_id uuid NOT NULL,
  reason text NOT NULL CHECK (reason IN ('inappropriate', 'spam', 'harassment', 'other')),
  description text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;

-- Users can report content
CREATE POLICY "Users can create reports"
  ON content_reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Users can see own reports
CREATE POLICY "Users can see own reports"
  ON content_reports FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id);

-- Admins can read all reports
CREATE POLICY "Admins can read all reports"
  ON content_reports FOR SELECT TO authenticated
  USING (public.is_admin_user());

-- Admins can update reports (review/dismiss)
CREATE POLICY "Admins can update reports"
  ON content_reports FOR UPDATE TO authenticated
  USING (public.is_admin_user());

CREATE INDEX idx_content_reports_status ON content_reports(status);
CREATE INDEX idx_content_reports_content ON content_reports(content_type, content_id);

-- Prevent duplicate reports from same user on same content
CREATE UNIQUE INDEX idx_content_reports_unique
  ON content_reports(reporter_id, content_type, content_id);

-- ============================================================
-- MODERATION COLUMNS on posts, comments, media
-- ============================================================

-- Posts
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'active'
    CHECK (moderation_status IN ('active', 'hidden', 'removed')),
  ADD COLUMN IF NOT EXISTS moderated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS moderated_at timestamptz;

-- Comments
ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'active'
    CHECK (moderation_status IN ('active', 'hidden', 'removed')),
  ADD COLUMN IF NOT EXISTS moderated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS moderated_at timestamptz;

-- Media
ALTER TABLE media
  ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'active'
    CHECK (moderation_status IN ('active', 'hidden', 'removed')),
  ADD COLUMN IF NOT EXISTS moderated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS moderated_at timestamptz;

-- ============================================================
-- RLS: Admin can moderate posts, comments, media
-- ============================================================

CREATE POLICY "Admins can update any post"
  ON posts FOR UPDATE TO authenticated
  USING (public.is_admin_user());

CREATE POLICY "Admins can delete any post"
  ON posts FOR DELETE TO authenticated
  USING (public.is_admin_user());

CREATE POLICY "Admins can update any comment"
  ON comments FOR UPDATE TO authenticated
  USING (public.is_admin_user());

CREATE POLICY "Admins can delete any comment"
  ON comments FOR DELETE TO authenticated
  USING (public.is_admin_user());

CREATE POLICY "Admins can update any media"
  ON media FOR UPDATE TO authenticated
  USING (public.is_admin_user());

CREATE POLICY "Admins can read all media"
  ON media FOR SELECT TO authenticated
  USING (public.is_admin_user());

-- ============================================================
-- FEEDBACK: email tracking
-- ============================================================

ALTER TABLE feedback
  ADD COLUMN IF NOT EXISTS email_sent_at timestamptz;
