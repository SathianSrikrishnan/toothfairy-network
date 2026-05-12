# Tooth Fairy Network

Tooth Fairy Network turns a child's lost tooth into a family keepsake: a short cultural story, a drawing or photo moment, an optional AI polish step, and a permanent Solana cNFT record that family can revisit or gift into.

This repo contains the public web app used for the Colosseum build sprint. It also still serves a few legacy `sathian.ai` routes, but the main product surface is `toothfairy.network`.

## Colosseum Review Links

- Live product: https://toothfairy.network
- Final pitch and build walkthrough page: https://toothfairy.network/colosseum-frontier-2026/final/index.html
- Pitch video: https://toothfairy.network/colosseum-frontier-2026/final/tooth-fairy-network-pitch.mp4
- Build walkthrough video: https://toothfairy.network/colosseum-frontier-2026/final/tooth-fairy-network-build-walkthrough.mp4

This repository is the cleaned public source/codebase prepared for Colosseum review. The live deployment at `toothfairy.network` originated from the earlier deployment pipeline while this repo was prepared for public reviewer access. The codebase here contains the Tooth Fairy Network product surfaces, Solana minting and escrow paths, story experience, README, architecture notes, setup guidance, and safety notes for review.

## Product Surfaces

- `toothfairy.network` -> landing page for parents
- `/toothfairy/colosseum` -> Colosseum demo and narrative entry point
- `/toothfairy/app` -> parent-child keepsake creation flow
- `/toothfairy/story/[tradition]` -> story reader
- `/toothfairy/keepsake/[id]` and `/tooth/[name]` -> shareable keepsake views
- `/api/toothfairy/*` -> minting, gift, auth, health, email, and on-ramp APIs

## Stack

- Next.js 14 App Router
- React 18 and Tailwind CSS
- Solana Web3.js, Anchor, Metaplex Bubblegum, and Irys/Arweave metadata storage
- Supabase auth and persistence
- Resend email notifications
- FAL-powered Magic Studio image enhancement
- MoonPay on-ramp proof path
- Remotion Colosseum storyboard/video tooling

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000/toothfairy`.

For production parity, fill in the Solana, Supabase, and provider keys in `.env.local`. Keep real credentials out of git.

## Verification

```bash
npm run build
```

There is no package-level test script yet. Targeted checks live in `tests/` and are run directly during feature work when relevant.

## Repo Map

- `src/app/toothfairy/` - TFN pages, Colosseum surfaces, app flow, story reader, admin and keepsake routes
- `src/app/api/toothfairy/` - TFN API routes
- `src/components/toothfairy/` - product UI, app flow components, story components, and visual system pieces
- `src/data/stories/` - story configs
- `src/data/wall-cards/` - global story wall data
- `src/lib/toothfairy/` - Solana, cNFT, escrow, auth, image enhancement, and keepsake helpers
- `public/story-assets/` - story artwork and character assets
- `supabase/` - database migrations
- `src/remotion/colosseum/` - Colosseum storyboard/video composition code
- `docs/archive/` - older launch notes, planning docs, and root setup files retained for historical context

## Safety Notes

- Never commit `.env`, `.env.local`, private keys, wallet seeds, API keys, or service-role credentials.
- Do not run production deploy commands from this repo without an explicit approval.
- Treat `TFN_MINT_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and provider API keys as server-only secrets.
- The companion on-chain program lives in the separate `toothfairy-contracts` repo.

