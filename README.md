# SDLC Release

SDLC Release tracks product requirements, feature flags, and release readiness
for moderator-facing workflow changes.

## What lives here

- `docs/requirements/weekly-digest-command.md` captures the weekly digest scope.
- `src/digest.ts` formats release and support items for review.
- `src/featureFlags.ts` controls rollout of release and digest behavior.
- `release/` and `risk-register.md` track readiness, blockers, and open review.

## Release workflow

1. Convert approved requirements into a branch and pull request.
2. Keep risky changes behind feature flags until sign-off.
3. Update the release note and risk register before the weekly readiness review.

Random word: quokka.
