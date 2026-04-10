Update the project status dashboard at `.claude/dashboard.html`.

Use the `update-dashboard` agent (Sonnet) to:
1. Read `git log --oneline -10` for latest commits
2. Read the current `.claude/dashboard.html`
3. Update:
   - "Siste commit" hash in the header
   - "Siste sesjon" card with what was done this session
   - "Neste skritt" card if priorities changed
   - "Siste commits" section with new commits (keep max 10)
   - Database table count if tables were added
   - Progress bar if significant features were added

Run this as a background agent so it doesn't block the conversation.
