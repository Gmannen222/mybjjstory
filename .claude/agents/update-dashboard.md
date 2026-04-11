---
name: update-dashboard
model: haiku
description: Updates .claude/status.md with current session info
---

# Update Status

Update `.claude/status.md` after work is done.

## Rules

1. **"Akkurat nå"** — overwrite with what's currently being worked on (one line)
2. **"I dag"** — APPEND new items. Never remove existing items. Check today's date — if it's a new day, archive yesterday under a `## YYYY-MM-DD` heading and start fresh.
3. **"Prosjekt"** — update commit hash, build status, route/table count if changed
4. **"Neste steg"** — update if priorities changed

## How to find current state

- Run `git log --oneline -3` for recent commits
- Read `.claude/status.md` to see existing content
- Check conversation context for what was just done

## Format

- Use `- [x]` for completed items, `- [ ]` for in-progress
- One line per item, be concise
- Norwegian language
- Max 60 lines total
