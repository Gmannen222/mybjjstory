-- Add 'special' to allowed categories
ALTER TABLE achievements DROP CONSTRAINT IF EXISTS achievements_category_check;
ALTER TABLE achievements ADD CONSTRAINT achievements_category_check
  CHECK (category = ANY (ARRAY['training', 'streak', 'belt', 'social', 'competition', 'special']));

-- Beta tester achievement — awarded to all users who join during beta
INSERT INTO achievements (id, name, description, category, icon, sort_order) VALUES
  ('beta_tester', 'Betatester', 'Var med fra starten og formet appen', 'special', 'rocket', 0)
ON CONFLICT (id) DO NOTHING;

-- Award beta_tester to ALL existing users who don't already have it
INSERT INTO user_achievements (user_id, achievement_id)
SELECT p.id, 'beta_tester'
FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM user_achievements ua
  WHERE ua.user_id = p.id AND ua.achievement_id = 'beta_tester'
)
ON CONFLICT DO NOTHING;
