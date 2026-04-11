Toggle the Agent Teams feature on or off.

## Check current status
Read `.claude/settings.local.json` and check if `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is set to `"1"` or `"0"` (or missing).

## Toggle
- If currently `"1"` (enabled): set it to `"0"` and tell the user "Agent Teams er nå DEAKTIVERT. Restart Claude Code for at endringen skal tre i kraft."
- If currently `"0"` or missing (disabled): set it to `"1"` and tell the user "Agent Teams er nå AKTIVERT. Restart Claude Code for at endringen skal tre i kraft."

## What this controls
Explain to the user:
- **Aktivert**: Gir tilgang til `TeamCreate`, `TeamDelete`, `SendMessage` og task-verktøy for å koordinere flere agenter som jobber parallelt på samme oppgave.
- **Deaktivert**: Agenter og slash-kommandoer (`/build-feature`, `/review`, etc.) fungerer fortsatt normalt som subagenter, men uten team-koordinering.
