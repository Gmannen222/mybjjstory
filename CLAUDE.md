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
- **Hosting:** Vercel (mybjjstory.no)

## Project Structure
```
app/[locale]/          — All user-facing pages (no locale prefix only for now)
app/auth/              — OAuth callback and error pages
app/i18n/              — next-intl routing and request config
components/            — Client and shared components by feature
lib/supabase/          — Three Supabase clients (client, server, static)
lib/types/             — TypeScript interfaces matching DB schema
messages/              — i18n JSON files (no.json)
supabase/migrations/   — SQL migration files
proxy.ts               — next-intl middleware (NOT middleware.ts)
```

## Key Patterns
- **Server components** fetch data, **client components** handle interactivity
- `export const dynamic = 'force-dynamic'` on auth-protected pages
- `proxy.ts` NOT `middleware.ts` for next-intl in Next.js 16
- Three Supabase clients: `client.ts` (browser), `server.ts` (SSR with cookies), `static.ts` (public reads)
- RLS on all tables — check user_id matches auth.uid()
- Storage paths follow pattern: `{user_id}/{filename}`
- Belt ranks: white, blue, purple, brown, black (standardized slugs)
- Color palette: primary #c9a84c, background #0d0d1a, surface #1a1a2e

## Database Tables
profiles, training_sessions, session_techniques, gradings, media, posts, comments, reactions, follows

## Commands
- `npm run dev` — Start dev server (Turbopack)
- `npm run build` — Production build
- `npx supabase db push` — Push migrations to remote (needs SUPABASE_ACCESS_TOKEN)
- `npx supabase db query --linked "SQL"` — Query remote database
- `npx vercel --prod` — Deploy to production

## Git
- Push to master: `git push origin master`
- GitHub: github.com/Gmannen222/mybjjstory
- Supabase project ref: jgknpmjfqctjycccnbub
