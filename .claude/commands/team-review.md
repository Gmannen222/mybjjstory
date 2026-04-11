Run the full review pipeline with three specialist agents in sequence. Use this after implementing changes to get comprehensive feedback before deploying.

## Pipeline

### Step 1: Code Review (code-reviewer agent)
Run the **code-reviewer** agent on all files changed in this session:
- TypeScript typing, React/Next.js patterns, Supabase usage
- Security: no hardcoded secrets, input validation, RLS coverage
- Style consistency with existing codebase
- Report findings with line numbers and severity

### Step 2: QA (qa-tester agent)
Run the **qa-tester** agent:
- Run `npm run build` and report any errors
- Check for unused imports, missing error handling
- Validate auth guards on protected pages
- Report structured QA findings

### Step 3: UX Review (ux-champion agent)
Run the **ux-champion** agent on changed pages/components:
- Mobile-first evaluation (touch targets, one-handed use)
- Loading states and empty states
- Visual consistency with design system
- Accessibility concerns

## After all three agents complete

Summarize findings in a unified report:

```
## Team Review

### Code Review: [GODKJENT / X FEIL]
[Key findings]

### QA: [BUILD OK / FEIL]
[Key findings]

### UX: [Score/findings]
[Key findings]

### Anbefalte tiltak
1. [Prioritized action items]
```

If there are critical issues (KRITISK or FIKS), list them first and recommend fixing before deploy.
