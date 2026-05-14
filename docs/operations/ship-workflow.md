# Ship Workflow

This repo uses a small local command bridge for GitHub and Vercel handoff.

Codex can edit, build, and commit inside the workspace. Sathian's terminal owns
the authenticated GitHub and Vercel CLI sessions. The `ship:*` commands turn
that into repeatable steps without manual GitHub clicking.

## Commands

Check local readiness:

```bash
npm run ship:check
```

Push the current branch and open a draft PR:

```bash
npm run ship:draft -- --title "Homepage polish" --body "Short summary"
```

If the build has already been run in the same branch:

```bash
npm run ship:draft -- --skip-build --title "Homepage polish"
```

Inspect the PR, checks, and Vercel preview links:

```bash
npm run ship:status
```

Merge after preview approval:

```bash
npm run ship:merge -- --ready --yes
```

## Guardrails

- `ship:draft` refuses to run from `main`, `master`, or `production`.
- `ship:draft` refuses to run with uncommitted changes.
- `ship:draft` runs `npm run build` unless `--skip-build` is provided.
- `ship:merge` refuses to merge until checks pass.
- `ship:merge` refuses to merge a draft PR unless `--ready --yes` is provided.
- `ship:merge` refuses to merge if no Vercel preview URL is found, unless `--skip-preview` is provided.

## Expected Loop

1. Create a feature branch.
2. Codex edits and commits.
3. Run `npm run ship:draft`.
4. Wait for Vercel Ready.
5. Run `npm run ship:status`.
6. Test the preview URL, including `/toothfairy/app/draw` for draw changes.
7. Run `npm run ship:merge -- --ready --yes` only after approval.
