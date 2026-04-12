# Daily Code Review Report — 2026-04-12

**Project:** MyBJJStory  
**Reviewed by:** Security Reviewer, Frontend Consistency Reviewer, Backend Functionality Reviewer  
**Scope:** Full codebase + last 24h changes (16 commits, ~60 files changed)

---

## Executive Summary

The codebase has strong security fundamentals and good architectural consistency. No critical or high-severity issues found. The main areas for improvement are: a race condition in reactions, missing ownership guards on cascading deletes, and ~30 hardcoded Norwegian strings that should be in the i18n file.

**Totals:** 0 Critical | 0 High | 6 Medium | 6 Low

---

## 1. Code Security

**Overall: Good.** All Server Actions authenticate via `getUser()`, all mutations verify ownership, no SQL injection risks, no XSS vectors, and secrets are properly server-only.

### Medium

| # | Issue | File | Description |
|---|-------|------|-------------|
| S1 | IDOR on cascading deletes | `lib/actions/training.ts:172-173` | `session_techniques` and `media` are deleted by `session_id` only, without `user_id` check. Relies entirely on RLS — verify policies exist on those tables. |
| S2 | Unvalidated image_url | `lib/actions/comments.ts:52` | Comment `image_url` accepts any URL. Should validate it starts with the Supabase storage domain to prevent phishing/tracking pixels. |
| S3 | Missing content length limit | `lib/actions/posts.ts:30` | `createPost` has no length limit, while `updatePost` enforces 2000 chars. Should be consistent. |
| S4 | deleteAllData incomplete | `lib/actions/account.ts:32` | Deletes `session_techniques` by `user_id`, but table likely keys on `session_id`. Data may survive account deletion. |

### Low

- Open redirect risk is mitigated with regex validation in auth callback
- No `dangerouslySetInnerHTML` found anywhere
- All `NEXT_PUBLIC_` vars are safe (URL, anon key, VAPID public key)

---

## 2. Code Consistency

**Overall: Mostly consistent.** The ActionResult + useActionState pattern is well-established across 12/13 form components.

### Medium

| # | Issue | File | Description |
|---|-------|------|-------------|
| C1 | AcademyEditForm bypasses pattern | `components/admin/AcademyEditForm.tsx` | Uses direct Supabase client mutation instead of Server Action + ActionResult. Also hardcodes `bg-[#0d0d1a]` instead of `bg-background`. |
| C2 | ActionResult type misplaced | `lib/actions/posts.ts` | Shared `ActionResult` type is defined in posts.ts and imported by all other action files. Should live in `lib/types/`. |

### Low

| # | Issue | Description |
|---|-------|-------------|
| C3 | 30+ hardcoded Norwegian strings | Strings like "Publiser", "Lagrer...", "Avbryt", "Slett gradering" appear directly in components instead of `messages/no.json`. Characters use correct æøå. |
| C4 | Weak typing on avatar beltRank | `AvatarConfigData.beltRank` is `string \| null` but should use the `BeltRank` union type. |
| C5 | FeedbackForm initial state | `{ success: false, error: '' }` — empty string is falsy so unlikely to cause a visible bug, but inconsistent with other forms using `null`. |

---

## 3. Functionality

**Overall: Good.** Migrations are correct, PWA/service worker is properly configured, and uncommitted changes are clean.

### Medium

| # | Issue | File | Description |
|---|-------|------|-------------|
| F1 | Race condition in reactions | `lib/actions/reactions.ts` | Read-then-write pattern (SELECT → DELETE → INSERT). Two rapid clicks can produce duplicate reactions. Should use upsert with `onConflict` or a unique constraint. |
| F2 | Non-atomic technique update | `lib/actions/training.ts:179-200` | Deletes all old techniques then inserts new ones. If insert fails after delete, techniques are lost with no rollback. Should use a transaction/RPC. |

### Low

| # | Issue | File | Description |
|---|-------|------|-------------|
| F3 | Duplicate auth subscriptions | `Header.tsx`, `BottomNav.tsx`, `RealtimeProvider.tsx` | Three independent `onAuthStateChange` listeners on every page. Should lift auth state into shared context. |
| F4 | Missing revalidation on reaction edge case | `lib/actions/reactions.ts` | When changing reaction type, if insert fails after delete, page cache is not invalidated → stale UI. |
| F5 | RealtimeProvider has no error handling | `components/realtime/RealtimeProvider.tsx` | `.then()` chains with no `.catch()` — network errors silently leave presence disabled. |

---

## Positive Findings

- All mutations are authenticated and ownership-verified
- RLS is applied consistently with well-structured policies (including feed privacy)
- `is_admin_user()` correctly uses `SECURITY DEFINER` to avoid RLS loops
- Enum inputs validated against allowlists throughout
- Storage paths use `{user_id}/` prefix for isolation
- PWA caching strategy is correct
- Recent migrations (academy data updates) are clean data-only changes
- Uncommitted diff is clean: accessibility fix (`maximumScale` removal), i18n improvements, nav cleanup

---

## Recommended Priority Order

1. **F1** — Fix reaction race condition (data integrity risk)
2. **S1** — Verify/add RLS on `session_techniques` and `media` tables
3. **S2** — Validate `image_url` domain in comments
4. **S3** — Add content length limit to `createPost`
5. **F2** — Wrap technique update in transaction
6. **C1** — Refactor AcademyEditForm to use Server Action pattern
7. **C3** — Move hardcoded strings to `messages/no.json`
8. **F3** — Consolidate auth subscriptions into shared context
