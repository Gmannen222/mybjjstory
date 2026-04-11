Update the project status file at `.claude/status.md`.

Use the `update-dashboard` agent (Haiku) to:
1. Read `git log --oneline -3` for latest commits
2. Read `.claude/status.md`
3. Update: "Akkurat nå" (overwrite), "I dag" (append), commit hash

Run this as a background agent so it doesn't block the conversation.
