---
name: update-dashboard
model: sonnet
description: Updates the project status dashboard HTML file with current session info
---

# Update Project Dashboard

You are responsible for updating the project status dashboard at `.claude/dashboard.html`.

## What to update

1. **Header meta**: Update "Siste commit" hash and date
2. **"Siste sesjon" card**: Replace items with what was done in this session (use status-dot classes: `done`, `active`, `pending`)
3. **"Neste skritt" card**: Update with current next priorities
4. **"Siste commits" section**: Add new commits at top, keep max 10
5. **Database card**: Update table count and tags if tables were added
6. **Progress bar**: Adjust percentage if significant features were added
7. **Any other changed info**: routes count, tech stack additions, etc.

## How to find current state

- Run `git log --oneline -10` for recent commits
- Check the todo list or conversation context for what was worked on
- Read the current dashboard.html first to understand the structure

## Rules

- Keep the same HTML/CSS structure — only update content
- Use Norwegian for all labels
- Be concise in descriptions (1 line per item)
- Do NOT add new CSS or change the layout
