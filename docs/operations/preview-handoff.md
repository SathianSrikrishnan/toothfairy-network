# Preview Handoff

Date: 2026-05-14

## Current Branch

`codex/source-of-truth-cleanup`

Key local commits on top of `toothfairy-network/main`:

- `e602b18 docs: establish Tooth Fairy source of truth`
- `9d967d1 feat: port Tooth Fairy sharing identity`
- `c9a69b0 fix: render Tooth Fairy hero reliably on mobile`
- `37bcaa3 chore: add preview readiness handoff`
- `49130ea feat: add Tooth Fairy site reporting`

## What Changed

- The repo now identifies as `toothfairy-network`.
- Source-of-truth and deployment workflow docs live in `docs/operations/`.
- Tooth Fairy social sharing metadata and image assets were ported from the `sathian-ai` recovery line.
- The homepage animated hero now renders in the initial HTML instead of waiting for a client-only dynamic chunk.
- The hero CSS has small Safari/WebKit compositing hardening.
- Tooth Fairy pages now send first-party page-view and key-click events to `/api/toothfairy/reporting/event`.
- Supabase reporting migration lives at `supabase/migrations/20260514_tfn_site_reporting.sql`.

## Preview Steps

1. Run `npm run preview:check`.
2. Push `codex/source-of-truth-cleanup` to GitHub.
3. Create or inspect the Vercel preview for that branch.
4. Open `/toothfairy` on iPhone and Android.
5. Confirm the animated hero appears without needing a refresh.
6. If Vercel build fails, check the required environment variables listed in `docs/operations/deployment-workflow.md`.
7. Apply the reporting migration before expecting analytics events to persist.

## Known Access Blockers From Codex

- Local `git push` from this environment could not connect to `github.com:443`.
- Vercel connector access returned no teams.
- This repo is not locally Vercel-linked; `.vercel/project.json` is absent.

These are access/plumbing issues, not code changes in this branch.
