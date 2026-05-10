# TFN V2 Deployment Readiness

## Current Goal

Ship a V1 that is good enough for a small test audience without breaking the existing live product. The public site can be reviewed now, while production wallet, minting, email, and onramp checks stay gated until real environment variables are connected in Vercel preview.

## What Is Ready For Visual Review

- `/toothfairy`: V2 homepage with generated P0 visual assets, product narrative, how-it-works, Smile Fund demo, cultural tales, age-10 education, and CTA path.
- `/toothfairy/visual-system`: asset board with selected V1 contact sheet and the future image-improvement queue.
- `/toothfairy/about`: customer-facing company/about page.
- `/toothfairy/company`: redirect to the canonical about page.
- `/toothfairy/faq`: parent-facing FAQ for product, safety, fees, and launch status.
- `/toothfairy/recover`: parent-facing recovery/support page.
- `/toothfairy/architecture`: security and architecture overview.
- `/toothfairy/stories`: existing story library route.
- `/toothfairy/keepsake/preview`: public keepsake preview route.

## What Is Code-Ready But Requires Real Infrastructure

- Server minting route: `/api/toothfairy/mint`
- Keepsake data route: `/api/toothfairy/keepsake/[id]`
- Escrow setup and server deposit routes:
  - `/api/toothfairy/email-escrow-setup`
  - `/api/toothfairy/escrow-setup`
  - `/api/toothfairy/server-deposit`
- Deposit/welcome emails:
  - `/api/toothfairy/deposit-email`
  - `/api/toothfairy/welcome-email`
  - `/api/toothfairy/drip-email`
- Health check: `/api/toothfairy/health`

## Critical Blockers Before Moving The Live Domain

1. The fiat/card contribution path is not final. The existing `/api/toothfairy/onramp` route is still a Coinbase onramp implementation, while the current business direction is Stripe/Crossmint. The V2 app now gates the card button unless `NEXT_PUBLIC_TFN_ENABLE_FIAT_ONRAMP=true`.
2. Crossmint minting is disabled at `/api/toothfairy/crossmint-mint` and returns `410`. Crossmint smart-wallet creation needs a new explicit server-signer implementation before it becomes part of the product path.
3. `/api/toothfairy/health` must pass in the Vercel preview with real secrets before any production domain switch.
4. The current local dev server can become stale after production builds. If `/toothfairy/app` returns a local 500 after a build, restart the dev server before treating it as a source-code failure.

## Environment Variables Needed In Vercel Preview

Required for the core minting and escrow path:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SOLANA_RPC`
- `NEXT_PUBLIC_SOLANA_RPC_URL`
- `TFN_MINT_SECRET_KEY`
- `TFN_MERKLE_TREE`

Required for emails:

- `RESEND_API_KEY`

Required for image/story enhancement paths:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `FAL_KEY`
- `ELEVENLABS_API_KEY`

Required only when fiat onramp is actually ready:

- `NEXT_PUBLIC_TFN_ENABLE_FIAT_ONRAMP=true`
- Stripe/Crossmint server keys and webhook secrets, once the final provider path is selected and implemented.

Legacy Coinbase onramp variables still appear in the repo:

- `CDP_API_KEY_ID`
- `CDP_API_KEY_SECRET`

These should not be the default V2 path unless we explicitly decide to keep Coinbase.

## Preview Deployment Sequence

1. Push the current `codex/tfnv2` branch.
2. Create a Vercel preview deployment from that branch without moving `toothfairy.network`.
3. Add the real Vercel preview environment variables listed above.
4. Visit `/api/toothfairy/health` on the Vercel preview.
5. If health passes, run one end-to-end test mint with a controlled test child.
6. Test wallet contribution through `/toothfairy/app/gift/[milestone]`.
7. Keep fiat/card contribution gated until Stripe/Crossmint is implemented and tested.
8. Only then decide whether to move `toothfairy.network` to this branch.

## Honest V1 Positioning

This V1 can collect useful feedback on:

- whether parents understand the product quickly;
- whether the keepsake and Smile Fund feel emotionally clear;
- whether the story universe increases trust and curiosity;
- whether the minting and wallet contribution flow works with real infrastructure.

This V1 should not claim that regular card gifts are live until the Stripe/Crossmint rail is actually wired and tested.
