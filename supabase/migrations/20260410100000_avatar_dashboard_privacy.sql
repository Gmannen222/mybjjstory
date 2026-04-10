-- ============================================================
-- AVATAR CONFIG (JSON — stores SVG avatar customization)
-- ============================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_config jsonb DEFAULT NULL;

-- ============================================================
-- DASHBOARD CONFIG (which sections to show on home)
-- ============================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dashboard_config jsonb DEFAULT '{
  "showTrainingStats": true,
  "showCompetitionStats": false,
  "showActiveInjuries": true,
  "showRecentTraining": true,
  "showQuickActions": true,
  "showFavoriteSub": false,
  "showFavoriteGuard": false,
  "showBelt": true,
  "showAvatar": true
}'::jsonb;

-- ============================================================
-- ENHANCED PRIVACY / SHARING MODEL
-- ============================================================
-- visibility: 'private' | 'public' | 'followers' | 'academy' | 'custom'
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_visibility text NOT NULL DEFAULT 'private'
  CHECK (profile_visibility IN ('private', 'public', 'followers', 'academy', 'custom'));

-- Display name to show to others (if different from display_name)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS public_display_name text DEFAULT NULL;
