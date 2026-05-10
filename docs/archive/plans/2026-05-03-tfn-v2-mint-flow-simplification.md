# TFN V2 Mint Flow Simplification Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the proven TFN V2 mint path feel like one simple family ritual: save the tooth memory, choose the age-10 default, then share the keepsake.

**Architecture:** Keep the current Supabase, Solana, Irys, auth, and mint endpoints untouched. Refactor the parent-facing flow copy, hierarchy, and completion screens inside the existing Next.js app so the product reads as a child’s first digital piggy bank disguised as a magical family ritual.

**Tech Stack:** Next.js App Router, React client components, Supabase Auth, Solana wallet adapter, existing TFN escrow helpers.

---

## Product Rules

- Memory first, money second, blockchain quietly underneath.
- Age 10 is the default and should feel recommended, not technical.
- Keep fees and chain details available, but remove them from the emotional center of the flow.
- Do not touch the deployed contract, database schema, wallet auth, or domain mapping in this pass.
- Keep the flow testable on Vercel Preview before production mapping.

## Task 1: Simplify the Mint Flow

**Files:**
- Modify: `src/app/toothfairy/app/page.tsx`

**Steps:**
1. Rename the visible journey from a five/six-step technical process to three parent-readable stages: `Name`, `Memory`, `Share`.
2. Update setup copy to say what the parent is doing in one sentence.
3. Update preview/save copy to explain that Google sign-in saves the keepsake to the parent account.
4. Simplify the post-mint savings screen so the parent sees three choices:
   - share the keepsake,
   - add a first gift,
   - skip for now.
5. Keep wallet/card gift controls, but move technical fee details into a quieter expandable/secondary area.

## Task 2: Polish the Keepsake Page

**Files:**
- Modify: `src/app/toothfairy/keepsake/[id]/page.tsx`

**Steps:**
1. Make the public page feel like the product artifact, not a technical receipt.
2. Lead with the child’s card, note/story, and a single family action.
3. Keep chain proof and guardian details lower on the page.
4. Add friendly empty/fallback states for test mints with rough images.

## Task 3: Dashboard and Recovery Pass

**Files:**
- Modify: `src/app/toothfairy/app/dashboard/page.tsx`
- Modify: `src/app/toothfairy/recover/page.tsx`

**Steps:**
1. Make the dashboard empty state explain the product in one sentence.
2. Make recovery feel like “find my child’s keepsake,” not a wallet troubleshooting page.
3. Keep connected-wallet behavior intact.

## Task 4: Verification

**Commands:**
- `npx.cmd tsc --noEmit`
- `npm.cmd run build` with required environment variables present.

**Manual Preview Tests:**
- `/toothfairy`
- `/toothfairy/app`
- `/toothfairy/keepsake/<minted-id>`
- `/toothfairy/app/dashboard`
- `/api/toothfairy/health`

**Acceptance Criteria:**
- A non-technical parent can explain the product after one pass through the flow.
- The mint path still works on the protected preview.
- The public share test is deferred until Vercel protection is bypassed or `toothfairy.network` is mapped.
