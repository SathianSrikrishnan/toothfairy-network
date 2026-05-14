# Source Of Truth

Date: 2026-05-14

## Decision

`SathianSrikrishnan/toothfairy-network` is the canonical Tooth Fairy Network product repository.

The `sathian-ai` repository and local `sathian-ai` copies are reference/recovery sources until useful work is explicitly ported here.

## Active Local Working Copy

Current cleanup branch:

`C:\Users\sathi\Documents\New project 2\tfn-magic-handoff-live-3`

Branch:

`codex/source-of-truth-cleanup`

## Rules

- Use `main` as the clean baseline unless a release branch is chosen later.
- Use `codex/*` branches for Codex work.
- Do not deploy from a dirty or conflicted working copy.
- Do not copy files from old clones without recording the source.
- Do not move secrets into docs or commits.
- Treat temporary deployment folders as artifacts, not source.

## Recovery Sources

Useful reference folders observed during reset:

- `tfnv2\repos\sathian-ai` - Vercel-linked, but conflicted.
- `codex-homepage-polish-work` - clean homepage polish reference in `sathian-ai` history.
- `toothfairy-homepage-polish-deploy` - clean homepage polish reference in `toothfairy-network` history.

## Next Cleanup Checks

1. Confirm GitHub account/repo ownership and push access.
2. Confirm Vercel project linkage for this repo.
3. Confirm Supabase project and environment variable completeness.
4. Compare latest hero/logo work from `sathian-ai` against this repo.
5. Start homepage animation changes only after the desired baseline is clear.
