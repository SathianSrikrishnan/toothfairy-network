# Deployment Workflow

Date: 2026-05-14

## Plain-English Loop

Idea -> clean branch -> local check -> push to GitHub -> Vercel preview -> approval -> production deploy.

## Default Roles

- GitHub: source of truth and review history.
- Vercel: public Next.js deployment.
- Supabase: auth, database, and app records.
- VPS/server: optional compute for background work or internal tooling.

## Before Any Preview Deploy

1. Confirm the local path is this repository.
2. Confirm the branch name.
3. Confirm there are no unresolved conflicts.
4. Run the best available local check.
5. Push the branch.
6. Create or inspect the Vercel preview.
7. Record the preview URL in the task notes or pull request.

## Before Production

1. Confirm the preview was approved.
2. Confirm the exact commit to ship.
3. Confirm Vercel production target and branch.
4. Confirm required environment variables exist in production.
5. Promote the approved preview or deploy production from the approved branch.
6. Record what shipped.

## Vercel Linkage Checklist

This local copy currently needs Vercel linkage confirmed.

Current access finding:

- The Codex Vercel connector can list no teams in this session.
- The old `sathian-ai` Vercel project ID returned `403 Forbidden` from this session.
- Fixing Vercel access/linkage is required before Codex can inspect deploys or create reliable previews from here.

Capture these values after linking:

- Vercel project name:
- Vercel team/org:
- Production branch:
- Production domain:
- Preview deploy behavior:
- Node version:
- Build command:

## Supabase Checklist

Capture these values without storing secrets:

- Supabase project name:
- Supabase project URL:
- Auth providers enabled:
- Migration files applied through:
- Required preview env vars present:
- Required production env vars present:

Current local finding:

- `next build` compiles but fails during page-data collection when Supabase URL/key values are absent.
- Minimum build-time variables must include `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Server-only Supabase routes also expect `SUPABASE_SERVICE_ROLE_KEY` when elevated access is used.
- `/api/voice/conversation` currently instantiates OpenAI at module load, so `OPENAI_API_KEY` is also required during build unless that route is refactored to lazy-load the client.
- `/api/voice/speak` currently instantiates ElevenLabs at module load, so `ELEVENLABS_API_KEY` is also required during build unless that route is refactored to lazy-load the client.
- With safe placeholder values for Supabase, OpenAI, and ElevenLabs, `npm.cmd run build` exits successfully in this Windows workspace.
- The placeholder build still logs dummy-config warnings from article fetching and bigint native bindings; these are not currently fatal.

## VPS Use Criteria

Use the VPS when the work needs one of these:

- long-running process
- scheduled worker outside Vercel limits
- private internal tool
- media generation or batch processing
- self-hosted service that should not live in the public app

Avoid using the VPS for the public homepage unless there is a specific reason. Vercel is simpler for the public Next.js site.
