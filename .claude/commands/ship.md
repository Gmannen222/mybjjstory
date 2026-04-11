Run the ship pipeline: lint, build, test, and deploy to production. This is the fast path when code is already reviewed and ready.

## Pipeline

### Step 1: Quality Gate
Run all checks sequentially. Stop at first failure:
```bash
npm run lint
npm run build
npm test --if-present
```
If any check fails, stop and report errors. Do NOT proceed to deploy.

### Step 2: QA Quick Check (qa-tester agent)
Run the **qa-tester** agent for a quick sanity check:
- Confirm lint/build/test results from step 1
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

### Lint: OK / FEIL
### Build: OK / FEIL
### Test: OK / FEIL / ingen tester
### Migrations: [pushed/none pending]
### Deploy: [URL] / FEIL
### Status: LIVE / BLOKKERT
```
