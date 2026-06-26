# Weekly Digest Command Requirements

## Problem

Moderators want a `/weekly-digest` command that summarizes resolved support issues,
open regressions, and shipped fixes without leaving Discord.

## Acceptance criteria

- Summarize closed issues labeled `support` or `bug` from the last seven days.
- Include open issues labeled `release-blocker`.
- Link to each source issue or PR.
- Respect `features.weeklyDigest` before responding in production servers.

## Non-goals

- Do not post automatically without moderator confirmation.
- Do not include private incident notes in public community servers.
