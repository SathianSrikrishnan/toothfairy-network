# sathian-ai

Next.js app serving two public products:

- **sathian.ai** — personal hub and portfolio
- **toothfairy.network** — Tooth Fairy Network frontend

TFN is on Solana mainnet. Frontend wires against the escrow contract at `FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC` (see companion repo `toothfairy-contracts`).

## Stack

- Next.js (App Router — verify version in `package.json`)
- Solana Wallet Adapter
- Metaplex Bubblegum (cNFTs, compressed tree minting)
- Anchor client for on-chain interaction
- Vercel hosting

## Commands

- `npm install` — first-time setup
- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — lint check
- `npm run test` — run tests (if configured)

## Working rules

- This is a **public** repo. Never commit `.env*`, private keys, wallet seeds, API keys, or any credential. If you see one in a diff, stop and flag it.
- Never run `vercel --prod` or any production deploy without explicit approval in chat.
- Branch from `main`. Work on `feat/*` or `fix/*` branches. Never push directly to `main`.
- Never modify the platform fee structure (2% deposit / 10% early withdrawal) without explicit approval.
- When wiring new on-chain calls, read `../toothfairy-contracts/` first to understand the instruction signature.
- One task at a time. No drive-by refactors.

## Current priority

**Escrow-to-frontend wiring for the "Deposit Your First Tooth" flow.** This is the critical path for the Solana Foundation pitch.

## Context pointers

- User-global context: `~/.claude/CLAUDE.md`
- Companion repo: `../toothfairy-contracts/`
- Story/creative bible and unit economics: TFN Bridge (Google Drive) — paste on request

## Reporting

When completing a task, report:

```
What I did: <changes, file paths>
What I verified: <tests, commands, exit codes>
What I did NOT do: <deferred / out of scope>
Open questions: <decisions needed>
```
