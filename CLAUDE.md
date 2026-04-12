# MyBJJStory

Personal BJJ training app — spin-off from TheBjjStory.no.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack, TypeScript)
- **Styling:** Tailwind CSS 4 (inline @theme in globals.css)
- **Database:** Supabase PostgreSQL with RLS
- **Auth:** Google OAuth via Supabase
- **Storage:** Supabase Storage (buckets: avatars, training-media, grading-media)
- **i18n:** next-intl (Norwegian first, domain-based routing ready)
- **PWA:** @serwist/next (service worker + manifest)
- **Testing:** Vitest + React Testing Library
- **CI:** GitHub Actions (lint, build, test on push/PR)
- **Hosting:** Vercel (mybjjstory.no)

## Project Structure
```
app/[locale]/          — All user-facing pages (no locale prefix only for now)
app/auth/              — OAuth callback and error pages
app/api/               — API routes (achievements, push)
app/i18n/              — next-intl routing and request config
components/            — Client and shared components by feature
lib/actions/           — Server Actions (all mutations)
lib/supabase/          — Three Supabase clients (client, server, static)
lib/hooks/             — Custom React hooks (presence, realtime)
lib/types/             — TypeScript interfaces matching DB schema
lib/__tests__/         — Unit tests
messages/              — i18n JSON files (no.json)
supabase/migrations/   — SQL migration files
proxy.ts               — next-intl middleware (NOT middleware.ts)
```

## Conventions
- Migration filenames: use `supabase migration new <name>` for unique timestamps
- Utility functions live in `lib/` (e.g., lib/achievements.ts, lib/admin.ts, lib/url.ts)
- Components organized by feature: `components/[feature]/ComponentName.tsx`
- Server Actions in `lib/actions/` return `ActionResult` type
- Error pattern: console.error + surface to user via state (no toast library)
- One feature per commit — don't batch multiple features at end of session
- Test files next to source: `lib/__tests__/foo.test.ts` or `components/__tests__/Foo.test.tsx`
- **Norwegian text MUST use æøå** — never substitute with ae/o/a. All user-facing strings (in messages/no.json, hardcoded labels, i18n keys) must use proper Norwegian characters: ø (not o), æ (not ae), å (not a). Examples: "økter" not "okter", "søk" not "sok", "første" not "forste", "spørsmål" not "sporsmal"

## Architecture Rules (prevent recurring bugs)
- **Navigation:** NAV_ITEMS and SUB_PATH_MAP live ONLY in `lib/navigation.ts` — never hardcode routes in Header/BottomNav. When adding a new page under an existing tab, add it to SUB_PATH_MAP.
- **Auth state:** Access via `useAuthProfile()` from `lib/hooks/useAuthProfile.tsx` — never call `onAuthStateChange` directly in components.
- **Display name:** Canonical source is `profiles.display_name`, NOT `session.user.user_metadata`. All components showing user name must read from AuthProfileProvider or server-side profile prop.
- **Testing:** When fixing a bug, write the test that would have caught it BEFORE the code fix. New nav routes must pass the nav consistency test (`lib/__tests__/navigation.test.ts`).

## Key Patterns
- **Server components** fetch data, **client components** handle interactivity
- **Server Actions** with `ActionResult` pattern for all mutations (`lib/actions/`)
- Forms use `useActionState` + `SubmitButton` component
- `export const dynamic = 'force-dynamic'` on auth-protected pages
- `proxy.ts` NOT `middleware.ts` for next-intl in Next.js 16
- Three Supabase clients: `client.ts` (browser), `server.ts` (SSR with cookies), `static.ts` (public reads)
- RLS on all tables — check user_id matches auth.uid()
- Storage paths follow pattern: `{user_id}/{filename}`
- Belt ranks: white, blue, purple, brown, black (standardized slugs)
- Color palette: primary #c9a84c, background #0d0d1a, surface #1a1a2e

## Database Tables
profiles, training_sessions, session_techniques, gradings, competitions, injuries, sparring_rounds, session_feedback, media, posts, comments, reactions, follows, push_subscriptions, achievements

## Commands
- `npm run dev` — Start dev server (Turbopack)
- `npm run build` — Production build
- `npm run lint` — ESLint check
- `npm test` — Run tests (Vitest)
- `npm run test:watch` — Tests in watch mode
- `npx supabase db push` — Push migrations to remote (needs SUPABASE_ACCESS_TOKEN)
- `npx supabase db query --linked "SQL"` — Query remote database
- `npx vercel --prod` — Deploy to production

## Quality Gates (run before deploy)
1. `npm run lint` — must pass
2. `npm run build` — must pass
3. `npm test` — must pass
4. Pre-commit hook runs lint-staged (ESLint + related tests)
5. GitHub Actions CI runs on every push/PR

## Git
- Push to master: `git push origin master`
- GitHub: github.com/Gmannen222/mybjjstory
- Supabase project ref: jgknpmjfqctjycccnbub
