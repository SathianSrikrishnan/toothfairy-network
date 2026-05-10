# TFN V2 Preview Readiness

Date: 2026-05-01
Branch: `codex/tfnv2`
Workspace: `C:\Users\sathi\Documents\New project 2\tfnv2\repos\sathian-ai`

## Current State

The local TFN V2 pass now has the core customer loop in place:

- `/toothfairy`: parent-facing landing page with the simple promise: mint a memory, invite family, start the Smile Fund.
- `/toothfairy/app`: mint/conversion flow framed as a parent-child activity, with the current deployed 2% contract fee disclosed and the target 1% fee called out as a future contract change.
- `/toothfairy/app/gift/[milestone]`: family contribution page reframed as a Smile Fund gift link, with Phantom/SOL labeled as preview mode and card checkout marked as the next integration.
- `/toothfairy/keepsake/[id]`: shareable keepsake page with Smile Fund panel and family CTA.
- `/toothfairy/app/dashboard`: parent control room for memories, gifts, balance, and family sharing.

No production cutover has been performed. The old deployment/domain should remain untouched until the Vercel preview is reviewed.

## Verification

Fresh checks run after the latest edits:

- `npx.cmd tsc --noEmit` passed.
- `npm.cmd run build` passed with dummy preview environment values.

The build no longer depends on remote Google Font fetches. Font variables now use local fallback stacks so sandboxed/local builds and Vercel previews are less fragile.

## Expected Build Warnings

The production build logs several warnings that do not currently block TFN V2 preview:

- Non-TFN voice API routes require real `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `FAL_KEY`, and `ELEVENLABS_API_KEY` values.
- Old article/studio routes log cache/revalidation warnings when using dummy local env values.
- The admin escrow viewer can log external RPC fetch failures in a restricted network sandbox.
- `bigint` falls back to pure JS bindings locally.

These should be separated from true TFN V2 blockers during preview review.

## Preview Environment Needed

For a Vercel preview that can exercise the real TFN flow, confirm these env vars are present in the Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SOLANA_RPC` or `NEXT_PUBLIC_SOLANA_RPC_URL`
- `TFN_MINT_SECRET_KEY`
- `TFN_MERKLE_TREE`
- `RESEND_API_KEY`
- `CROSSMINT_SERVER_KEY`

For non-TFN site routes to build cleanly without dummy values:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `FAL_KEY`
- `ELEVENLABS_API_KEY`

## Still Not Done

These are intentionally not done in this pass:

- No production domain reassignment.
- No production Supabase edits.
- No mainnet contract change from 2% to 1%.
- No early-withdrawal penalty change from 10% to 5%.
- No Stripe card/on-ramp implementation yet.
- No Crossmint smart-wallet signer rewrite yet.
- No end-to-end real wallet mint test in this Codex sandbox.

## Next Review Sequence

1. Restart the local dev server and review:
   - `http://127.0.0.1:3005/toothfairy`
   - `http://127.0.0.1:3005/toothfairy/app`
   - `http://127.0.0.1:3005/toothfairy/app/dashboard`
2. Create a Vercel preview from `codex/tfnv2` using existing preview env values.
3. Test one full wallet-backed mint on preview.
4. Share the generated keepsake/gift link with 1-2 internal testers.
5. Only after preview approval, decide whether to point `toothfairy.network` at TFN V2.

## Local Git Note

Codex could not stage this branch from the sandbox because Windows denied writes inside `.git`:

`fatal: Unable to create '.git/index.lock': Permission denied`

The working tree files are updated. Staging/committing should be run from a normal user terminal or after repairing `.git` ACLs.
