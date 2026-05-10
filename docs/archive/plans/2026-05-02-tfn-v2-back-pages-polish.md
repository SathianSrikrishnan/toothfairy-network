# TFN V2 Back Pages Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the non-homepage TFN V2 routes feel like a coherent deployable product surface before production infrastructure migration.

**Architecture:** Keep the public homepage as the source visual language, then add or replace lightweight App Router pages for company/about, FAQ, recovery/support, and security/architecture. Avoid touching smart-contract code in this pass; production wiring remains gated by health checks and Vercel preview secrets.

**Tech Stack:** Next.js App Router, React Server Components where possible, existing TFN header/footer layout, CSS-in-JSX for scoped page polish, existing generated visual assets.

---

### Task 1: Route Coverage Lock

**Files:**
- Create: `src/app/toothfairy/about/page.tsx`
- Create: `src/app/toothfairy/company/page.tsx`
- Modify: `src/app/toothfairy/network/about/page.tsx`
- Create: `src/app/toothfairy/faq/page.tsx`
- Create: `src/app/toothfairy/recover/page.tsx`

**Steps:**
1. Add `/toothfairy/about` as the canonical customer-facing company/about page.
2. Add `/toothfairy/company` and `/toothfairy/network/about` as redirects to `/toothfairy/about`.
3. Add `/toothfairy/faq` with parent-facing questions covering product, safety, fees, age 10, Solana, NFTs, and what is/not live in V1.
4. Add `/toothfairy/recover` as a parent-facing recovery/help page with links to the wallet recovery tool.
5. Keep `/toothfairy/app/recover` as the technical wallet recovery surface.

### Task 2: Security And Architecture Page

**Files:**
- Modify: `src/app/toothfairy/architecture/page.tsx`

**Steps:**
1. Replace the iframe-only page with a polished V2 “Security and Architecture” page.
2. Cover parent control, cNFT keepsake, Supabase sidecar data, Solana escrow, email, and deployment readiness.
3. Be honest that fiat/card contributions are gated until Stripe/Crossmint is tested.

### Task 3: Navigation Cleanup

**Files:**
- Modify: `src/components/toothfairy/nav/tfn-header.tsx`
- Modify: `src/components/toothfairy/nav/tfn-footer.tsx`

**Steps:**
1. Point `About` to `/toothfairy/about`.
2. Add/ensure footer links for FAQ, Recover, Security, Mint Keepsake, Dashboard, Cultural Tales.
3. Avoid linking parents to internal/admin pages as primary support links.

### Task 4: Product Preview Copy Corrections

**Files:**
- Modify: `src/app/toothfairy/keepsake/preview/page.tsx`

**Steps:**
1. Align copy to the current age-10 default, not the older age-18 language.
2. Keep the visual simple and customer-facing.

### Task 5: Verification

**Commands:**
- `npx.cmd tsc --noEmit`
- `npm.cmd run build` with preview-safe dummy env vars
- Route smoke check for `/toothfairy`, `/toothfairy/about`, `/toothfairy/company`, `/toothfairy/faq`, `/toothfairy/recover`, `/toothfairy/architecture`, `/toothfairy/keepsake/preview`

**Expected:**
- Typecheck exits 0.
- Build exits 0.
- Routes return 200 or redirect intentionally.
