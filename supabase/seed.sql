-- Seed data for MyBJJStory demo
-- Note: These posts need real user IDs. Run after creating test accounts.

-- Demo posts for the feed (requires at least one user in profiles)
-- Run manually after first user has signed up:

-- INSERT INTO public.posts (user_id, content, post_type, created_at)
-- SELECT id, 'Fantastisk treningsøkt i dag! Drillet armbar fra guard i 30 minutter 🥋', 'text', now() - interval '1 hour'
-- FROM public.profiles LIMIT 1;

-- INSERT INTO public.posts (user_id, content, post_type, created_at)
-- SELECT id, 'Fikk endelig blått belte etter 2 år med konsistent trening! Tusen takk til instruktøren min 🏅', 'text', now() - interval '3 hours'
-- FROM public.profiles LIMIT 1;

-- INSERT INTO public.posts (user_id, content, post_type, created_at)
-- SELECT id, 'Tips til nybegynnere: fokuser på posisjon før submission. Det endret spillet mitt fullstendig.', 'text', now() - interval '1 day'
-- FROM public.profiles LIMIT 1;

-- For å kjøre seed etter at en bruker har registrert seg, bruk:
-- npx supabase db query --linked < supabase/seed.sql
