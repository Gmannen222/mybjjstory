Run the full agent team pipeline to build a feature end-to-end. Follow these steps IN ORDER, using the specified agent for each step. Stop and report if any step fails critically.

## Input
The user will describe the feature they want built. Pass this description to each step.

## Pipeline

### Step 1: Plan (plan agent)
Run the **plan** agent to create a technical specification and implementation plan.
- Pass the user's feature description
- The plan agent will analyze the codebase, design the data model, and produce an ordered task list
- Review the plan output — if it's unclear or incomplete, ask the user before proceeding

### Step 2: Implement (frontend-lead + backend-lead agents)
Based on the plan, implement the feature:
- If the plan includes **database changes** (migrations, RLS, new tables): run the **backend-lead** agent first
- Then run the **frontend-lead** agent for UI components and pages
- If the feature is backend-only or frontend-only, skip the irrelevant agent
- Run these agents with the plan output as context

### Step 3: UX Copy (ux-writer agent)
Run the **ux-writer** agent to review and add Norwegian text:
- Check that all new user-facing strings are in `messages/no.json`
- Verify tone, BJJ terminology, and correct æøå usage

### Step 4: Quality Gate
Run these checks sequentially:
```bash
npm run lint
npm run build
npm test --if-present
```
If any fail, fix the issues before continuing.

### Step 5: Review (code-reviewer agent)
Run the **code-reviewer** agent on all changed files:
- TypeScript, security, Supabase patterns, React best practices
- If the review finds issues marked FIKS, go back to Step 2 and fix them before continuing

### Step 6: QA (qa-tester agent)
Run the **qa-tester** agent:
- Verify lint, build, and test pass
- Code analysis for errors and warnings
- If critical issues are found, fix them and re-run QA

### Step 7: UX Review (ux-champion agent)
Run the **ux-champion** agent on the new/changed pages:
- Mobile-first evaluation
- Touch targets, loading states, empty states
- Report findings but don't block the pipeline for non-critical UX issues

### Step 8: Deploy (optional — ask user)
Ask the user if they want to deploy now. If yes:
- Run the **devops** agent to build, push migrations, and deploy to Vercel

## Report
After completing the pipeline, give a summary:
- What was built (files created/changed)
- Lint/Build/Test status
- Review status (approved / issues fixed)
- QA status (pass/fail)
- UX findings (if any)
- Deploy status (if deployed)
