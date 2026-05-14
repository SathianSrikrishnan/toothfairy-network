# GitHub and Vercel Recovery

Date: 2026-05-14

## Current Local Truth

- Working copy: `C:\Users\sathi\Documents\New project 2\tfn-magic-handoff-live-3`
- Branch: `codex/source-of-truth-cleanup`
- Remote: `https://github.com/SathianSrikrishnan/toothfairy-network.git`
- Latest functional checkpoint: `49130ea feat: add Tooth Fairy site reporting`
- Local status after that checkpoint: clean

## Current Failure Signals

- `git push -u origin codex/source-of-truth-cleanup` cannot connect to `github.com:443` from this Codex workspace.
- Vercel connector `_list_teams` returns an empty team list.
- This local repo is not linked to Vercel; `.vercel/project.json` is absent.

These are plumbing and account-access issues. The branch builds locally and is ready to preview once GitHub and Vercel can see it.

## Recovery Steps

1. From a terminal with GitHub network access, open this repo and push:

```bash
git status
git push -u origin codex/source-of-truth-cleanup
```

2. In Vercel, connect or re-connect GitHub repo `SathianSrikrishnan/toothfairy-network`.

3. Confirm project settings:

- Framework: Next.js
- Production branch: `main`
- Preview branches: enabled
- Root directory: repo root
- Build command: `npm run build`

4. Add preview and production environment variables listed in `docs/operations/deployment-workflow.md`.

5. Create the preview for branch `codex/source-of-truth-cleanup`.

6. After Vercel access is repaired locally, link this working copy:

```bash
vercel link
```

That should create `.vercel/project.json`. Keep that file local unless the team intentionally decides to commit Vercel linkage.

## Done State

- GitHub shows remote branch `codex/source-of-truth-cleanup`.
- Vercel shows a preview deployment for that branch.
- `/toothfairy` loads the animated hero on iPhone and Android.
- Supabase migration `20260514_tfn_site_reporting.sql` is applied before reporting is expected to persist.
