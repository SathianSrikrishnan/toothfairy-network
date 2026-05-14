# Architecture

Tooth Fairy Network is a Next.js app that combines a story-led parent experience with Solana-backed keepsakes.

## Source Of Truth

The canonical product repository is `SathianSrikrishnan/toothfairy-network`.

Older or parallel `sathian-ai` working copies may still contain useful recovery work, legacy routes, or Vercel metadata, but they are reference sources unless a change is intentionally ported into this repository.

Use `codex/*` branches for Codex work. Do not deploy from a dirty or conflicted working copy.

## Request Routing

The app serves multiple public domains from one Vercel project:

- `toothfairy.network` and `www.toothfairy.network` rewrite into `/toothfairy/*`.
- `toothfairy.sathian.ai` also rewrites into `/toothfairy/*`.
- `sathian.ai` continues to serve legacy personal and content routes.

The routing logic lives in `src/middleware.ts`. It also refreshes Supabase auth cookies for TFN app/API routes and applies CORS/rate-limit protections to API routes.

## Product Flow

1. A parent enters through the TFN landing page or Colosseum demo.
2. The family reads a cultural tooth-loss story.
3. The child creates or uploads the tooth moment.
4. The app can optionally polish the drawing through Magic Studio.
5. The parent signs in and creates the keepsake.
6. Server-side minting stores metadata and issues a Solana cNFT.
7. The keepsake page can be shared with family, and gift/deposit flows can attach value to the milestone.

## Frontend

Main app surfaces live in `src/app/toothfairy/`:

- `page.tsx` and `home-client.tsx` render the parent landing experience.
- `colosseum/` contains the public demo story for the sprint.
- `story/` and `stories/` render the story reader and story discovery surfaces.
- `app/` contains the create, draw, preview, auth, dashboard, recover, and gift flows.
- `keepsake/` and `src/app/tooth/[name]/` render shareable keepsake pages.

Reusable UI lives under `src/components/toothfairy/`. Story data lives under `src/data/stories/` and global wall-card data under `src/data/wall-cards/`.

## Backend APIs

TFN APIs live in `src/app/api/toothfairy/`:

- Minting and claim paths: `mint`, `email-escrow-setup`, `claim-profile`, `my-children`
- On-chain helpers: `escrow-init`, `escrow-setup`, `actions/deposit`, `server-deposit`
- Keepsake data: `keepsake/[id]`, `child-lookup`, `gift-receipt`
- Operations: `health`, `setup-tree`, `escrow-viewer`
- Messaging: `welcome-email`, `deposit-email`, `drip-email`
- Media/AI: `enhance`, `colosseum/voiceover`
- Fiat proof path: `onramp`

Shared server and client helpers live in `src/lib/toothfairy/`.

## Solana and Storage

The frontend talks to a deployed Tooth Fairy escrow program:

- Program ID: `FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC`
- Program helpers: `src/lib/toothfairy/program.ts`
- IDL files: `src/lib/toothfairy/idl.json` and `escrow-idl.json`
- cNFT minting: `src/lib/toothfairy/cnft.ts`
- On-chain read models and keepsake data: `src/lib/toothfairy/keepsake-data.ts`

cNFT metadata and images are uploaded through Irys/Arweave via Metaplex Umi. The server wallet signs mint operations so parents do not need to pay minting gas during the main flow.

## Data and Auth

Supabase is used for auth, user/session state, child profile lookup, magic credits, and operational records. The migration files are in `supabase/migrations/`.

Public browser code only uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Server-only routes use `SUPABASE_SERVICE_ROLE_KEY` where elevated access is required.

## Integrations

- Resend sends welcome, deposit, gift, and drip emails.
- FAL powers Magic Studio drawing enhancement.
- ElevenLabs supports Colosseum voiceover generation.
- MoonPay provides the fiat on-ramp proof path.
- Notion and Telegram are optional notification/content tools for legacy surfaces.
- Crossmint helpers remain in the codebase but the active route is disabled.

## Runtime Boundaries

Client-visible values must use `NEXT_PUBLIC_*`. Private keys and provider secrets must stay server-only:

- `TFN_MINT_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `FAL_KEY`
- `MOONPAY_SECRET_KEY`
- `GOOGLE_CLIENT_SECRET`
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `ELEVENLABS_API_KEY`

Use `.env.example` as the public template and `.env.local` for local secrets.

## Infrastructure Roles

- Vercel runs the public Next.js app and should remain the default deploy target.
- Supabase owns auth, database records, and storage-backed app state.
- The VPS/server is optional capacity for long-running jobs, workers, private tools, or media processing that does not fit Vercel serverless functions.

