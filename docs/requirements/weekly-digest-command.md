# Weekly Digest Command Requirements

## Problem

Moderators want a `/weekly-digest` command that summarizes resolved support issues,
open regressions, and shipped fixes without leaving Discord.

## Acceptance criteria

- Summarize closed issues labeled `support` or `bug` from the last seven days.
- Include open issues labeled `release-blocker`.
- Summarize shipped fixes from merged PRs labeled `fix`, `bug`, or `support`
  from the last seven days.
- Link to each source issue or PR in the digest output.
- Respect `features.weeklyDigest` before responding in production servers.
- Restrict command execution to moderators.
- Return a moderator-only preview that requires confirmation before posting.

## Non-goals

- Do not post automatically without moderator confirmation.
- Do not include private incident notes in public community servers.

## Implementation note

The `/weekly-digest` command entry point lives in `src/weeklyDigestCommand.ts`.
It uses `src/digest.ts` to format the closed support issues, open blockers, and
shipped fixes sections.
