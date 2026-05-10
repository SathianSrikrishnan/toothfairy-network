# TFN V2 Data And Infrastructure Handoff

## Product Goal

The next deployable V1 should prove one simple loop:

1. A parent saves a lost tooth memory.
2. The keepsake is minted and stored.
3. The family receives a shareable page.
4. Loved ones can see the Smile Fund context.
5. The parent remains in control until the child is ready.

The marketing page can be polished with representative assets, but the product proof should come from real minted examples as soon as possible.

## Access Principle

Do not paste production secrets into chat.

Use Vercel preview environment variables, Supabase dashboard settings, and local `.env` files for secrets. Codex can inspect code and help verify behavior, but live keys should stay in the actual provider consoles or local environment files.

## Core Preview Secrets

Required before the Vercel preview can mint:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SOLANA_RPC`
- `NEXT_PUBLIC_SOLANA_RPC_URL`
- `TFN_MINT_SECRET_KEY`
- `TFN_MERKLE_TREE`
- `RESEND_API_KEY`

Useful but not required for the first preview mint:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `FAL_KEY`
- `ELEVENLABS_API_KEY`

Keep disabled until the final provider path is implemented:

- `NEXT_PUBLIC_TFN_ENABLE_FIAT_ONRAMP`
- Stripe payment/onramp keys
- Crossmint wallet/signer/webhook keys
- legacy Coinbase onramp keys

## Supabase Objects The Current Code Uses

Tables:

- `tfn_children`
- `tfn_tooth_stories`

Storage:

- `tfn-photos`

Auth:

- Supabase session cookies are required for `/api/toothfairy/mint` and `/api/toothfairy/my-children`.

## On-Chain Objects The Current Code Uses

Program:

- Escrow program id: `FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC`

Minting:

- server mint authority from `TFN_MINT_SECRET_KEY`
- Bubblegum Merkle tree from `TFN_MERKLE_TREE`
- metadata uploaded through Irys/Arweave

Keepsake display:

- milestone PDA
- child profile PDA
- metadata URI
- image URI from metadata
- deposits fetched from escrow program accounts
- optional story from `tfn_tooth_stories`

## Health Gate

Before moving the live domain, the Vercel preview must pass:

- `/api/toothfairy/health`

That endpoint checks:

- server keypair loads;
- server wallet has SOL;
- Irys has upload balance;
- Merkle tree env var exists;
- Supabase can query `tfn_children`;
- escrow program is deployed and executable.

## Real Asset Capture For The First Five Examples

For each minted example, capture:

- child alias;
- keepsake image URL;
- tooth story or note;
- metadata URI;
- mint transaction signature;
- child slug;
- guardian public key;
- child wallet public key;
- child profile PDA;
- milestone PDA;
- keepsake URL;
- any contribution/deposit test data.

Those examples should become the source of truth for the homepage product proof, keepsake preview, and Smile Fund demo.

## Animation Decision

The lightweight V1 animation should be a small looping product metaphor:

- Tanda or a fairy carries a coin;
- the coin drops into a digital piggy bank;
- the bank glows briefly;
- it repeats quietly.

Use this as ambient reinforcement, not a page-level cinematic. A scroll-triggered version can come later after the core funnel works.

## Recommended Order From Here

1. Push the current branch and get a Vercel preview URL.
2. Add preview env vars in Vercel.
3. Run `/api/toothfairy/health` on the preview.
4. Mint one controlled test keepsake.
5. Mint four more representative examples.
6. Replace homepage/product mock data with real example references.
7. Keep fiat/card contributions gated until Stripe/Crossmint is final.
8. Move `toothfairy.network` only after the preview mint path is proven.
