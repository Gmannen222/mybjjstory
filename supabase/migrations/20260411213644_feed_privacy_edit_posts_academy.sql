-- Migration: Feed privacy, edit posts, academy visibility
-- Covers: RLS on posts, profiles visibility policies, updated_at on posts, show_in_academy_list

-- ============================================================
-- 1. FEED PRIVACY: Replace open posts SELECT policy
-- ============================================================

-- First, migrate existing public profiles so feed doesn't go empty
UPDATE profiles SET profile_visibility = 'public'
  WHERE is_public = true AND profile_visibility = 'private';

-- Drop the old wide-open policy
DROP POLICY IF EXISTS "Alle kan se innlegg" ON public.posts;

-- Create privacy-aware SELECT policy on posts
CREATE POLICY "Innlegg synlige basert på profilsynlighet"
  ON public.posts FOR SELECT
  USING (
    -- Own posts always visible
    auth.uid() = user_id
    OR
    -- Admin override
    public.is_admin_user()
    OR
    -- Check poster's profile_visibility
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = posts.user_id
      AND (
        -- Public: everyone can see
        p.profile_visibility = 'public'
        OR
        -- Followers: must follow the poster
        (p.profile_visibility = 'followers' AND EXISTS (
          SELECT 1 FROM public.follows f
          WHERE f.following_id = posts.user_id
          AND f.follower_id = auth.uid()
        ))
        OR
        -- Academy: must share same academy_id
        (p.profile_visibility = 'academy' AND p.academy_id IS NOT NULL AND EXISTS (
          SELECT 1 FROM public.profiles viewer
          WHERE viewer.id = auth.uid()
          AND viewer.academy_id = p.academy_id
        ))
      )
    )
  );

-- ============================================================
-- 2. PROFILES RLS: Academy and follower visibility
-- ============================================================

-- Academy members can see each other
CREATE POLICY "Akademimedlemmer kan se hverandre"
  ON public.profiles FOR SELECT
  USING (
    profile_visibility = 'academy'
    AND academy_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.profiles viewer
      WHERE viewer.id = auth.uid()
      AND viewer.academy_id = profiles.academy_id
    )
  );

-- Followers can see profiles they follow
CREATE POLICY "Følgere kan se profiler"
  ON public.profiles FOR SELECT
  USING (
    profile_visibility = 'followers'
    AND EXISTS (
      SELECT 1 FROM public.follows f
      WHERE f.following_id = profiles.id
      AND f.follower_id = auth.uid()
    )
  );

-- ============================================================
-- 3. EDIT POSTS: Add updated_at column
-- ============================================================

ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- Add UPDATE policy for posts (user can only edit own posts)
CREATE POLICY "Brukere kan redigere egne innlegg"
  ON public.posts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-set updated_at on update
CREATE OR REPLACE TRIGGER set_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- 4. ACADEMY VISIBILITY: show_in_academy_list column
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS show_in_academy_list boolean NOT NULL DEFAULT true;

-- ============================================================
-- 5. PERFORMANCE INDEXES
-- ============================================================

-- Speed up follows lookup in posts RLS
CREATE INDEX IF NOT EXISTS idx_follows_compound
  ON public.follows (following_id, follower_id);

-- Speed up visibility filtering
CREATE INDEX IF NOT EXISTS idx_profiles_visibility
  ON public.profiles (profile_visibility)
  WHERE profile_visibility != 'private';
