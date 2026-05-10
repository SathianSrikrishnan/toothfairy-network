# TFN V2 Product Spine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the local TFN v2 preview feel like one coherent product: a lost-tooth keepsake, a family contribution link, and a parent-controlled Smile Fund children can understand by age 10.

**Architecture:** Keep the current Next.js app and clean mirror intact. Prioritize visible page polish first, then carry the same language and actions into mint, dashboard, gift, and keepsake pages.

**Tech Stack:** Next.js App Router, React, TypeScript, local image assets, existing Solana/Supabase/Crossmint route surface.

---

### Task 1: Landing Page Product Clarity

**Files:**
- Modify: `src/app/toothfairy/page.tsx`

**Steps:**
1. Add a stronger celestial-network layer using existing local assets.
2. Add parent-facing value panels above the hero fold.
3. Add a simple visual product loop: lost tooth, Tanda, NFT memory, Smile Fund.
4. Keep CTAs pointed to `/toothfairy/app`.
5. Run `npx.cmd tsc --noEmit`.

### Task 2: Conversion Flow Clarity

**Files:**
- Modify: `src/app/toothfairy/app/page.tsx`

**Steps:**
1. Make the opening mint screen match the landing promise.
2. Reduce old crypto-heavy wording where the parent needs plain language.
3. Keep age 10 as the suggested default.
4. Confirm the generated share URL points to `/toothfairy/app/gift/[milestone]`.
5. Run `npx.cmd tsc --noEmit`.

### Task 3: Family Contribution Spine

**Files:**
- Modify: `src/app/toothfairy/app/gift/[milestone]/page.tsx`
- Modify: `src/app/toothfairy/keepsake/[id]/page.tsx`
- Modify: `src/components/toothfairy/keepsake/share-buttons.tsx`

**Steps:**
1. Make the gift page feel like adding to a child’s Smile Fund, not a crypto payment page.
2. Make the keepsake page a shareable family landing page.
3. Keep current Phantom path as preview mode and label card checkout as next integration.
4. Run `npx.cmd tsc --noEmit`.

### Task 4: Verify Preview

**Files:**
- No code changes unless verification exposes a bug.

**Steps:**
1. Run TypeScript.
2. Run a local route check for `/toothfairy`, `/toothfairy/app`, `/toothfairy/app/dashboard`, and `/toothfairy/keepsake/not-a-real-id`.
3. Run production build with local dummy preview env.
4. Report production blockers separately from code blockers.
