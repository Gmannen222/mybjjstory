Run the ship pipeline: build, test, and deploy to production. This is the fast path when code is already reviewed and ready.

## Pipeline

### Step 1: Build Check
Run `npm run build` locally. If the build fails, stop and report errors. Do NOT proceed to deploy with a broken build.

### Step 2: QA Quick Check (qa-tester agent)
Run the **qa-tester** agent for a quick sanity check:
- Build status (from step 1)
- Any critical security issues in changed files
- If critical issues are found, stop and report

### Step 3: Deploy (devops agent)
Run the **devops** agent:
- Push any pending Supabase migrations with `npx supabase db push`
- Deploy to Vercel with `npx vercel --prod`
- Verify the deployment is live

### Step 4: Status Update (update-dashboard agent)
Run the **update-dashboard** agent in the background to update `.claude/status.md`.

## Report
```
## Ship Report

### Build: OK / FEIL
### QA: OK / FEIL  
### Migrations: [pushed/none pending]
### Deploy: [URL] / FEIL
### Status: LIVE / BLOKKERT
```
