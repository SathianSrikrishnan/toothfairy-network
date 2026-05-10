# TFN V2 Visual Frontend Milestone

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring TFN V2 from a working product spine to a visually polished, deployable frontend that can be shown to test users even if the final minting/payment mechanism is still being hardened.

**Architecture:** Keep the current Next.js App Router structure and existing TFN routes. Treat the North Star mockup as a directionally correct product composition, not a literal layout to copy. Polish the entire visible surface around a parent-facing first impression, a coherent magical-financial visual system, and a tighter journey from landing page to mint flow to keepsake/gift/dashboard.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS modules / styled JSX / Tailwind utility classes already in the repo, local image assets, existing Solana/Supabase route surface.

---

## User Feedback To Preserve

The North Star image is not meant literally. It is too crowded, but it contains the elements of a full web product: header, clear hero, parent-child photo, Tanda, NFT keepsake, Smile Fund dashboard, proof strip, how-it-works section, parent benefits, cultural tales, footer, email capture, and Solana credibility.

The current TFN V2 pass is only the first version toward that product. It has the right themes, but the messaging is not yet better than the live deployed site. It feels too literal and too visibly "vibe-coded" in places. It needs a full visual audit, sharper messaging, better iconography, more intentional component design, and more polish before it should be deployed for customer feedback.

The desired next milestone is not "make the code build." It is "make the frontend feel deployable." The site should look ready to show users for everything except the final minting/on-ramp mechanism. The minting mechanism can still be guarded or labeled as preview, but the product shell, story, and parent journey need to feel credible and complete.

Latest correction from Sathian: the text spine is acceptable, roughly a 7-8/10. The main gap is the image system. Every image slot needs to be identified, given a purpose, and either replaced, simplified, or promoted into a consistent visual language. The current page should not be treated as a milestone just because it renders. The "How it works" area should be very simple. The design should move closer to a visually ready product before backend/domain migration.

## Design Ground Truth

TFN is a simple product with a layered story:

- A child loses a tooth.
- A parent helps them mint the memory.
- Family can contribute to a parent-controlled Smile Fund.
- The child learns that small things can compound into something meaningful by around age 10.

The frontend should communicate this without overexplaining. The page should feel like a polished consumer product, not a literal diagram. The fantasy layer should carry delight, while the financial layer should carry trust.

## Visual Direction

The product should sit between:

- Magical folklore: Tanda, tooth fairies, mice, global traditions, bedtime-story warmth.
- Modern financial infrastructure: Solana, transparent custody, parent control, family contributions.
- Global network: a celestial blockchain-like organism connecting traditions around the world.

The celestial network motif matters. It should appear as a subtle background language, especially around the hero, story sections, and the "Tooth Fairy Network" concept. It should not become visual noise.

## Current V2 Assessment

What is working:

- The core route spine exists.
- The landing page has the right product ingredients.
- The mint flow, gift flow, keepsake page, and dashboard now point in the same product direction.
- Age 10, Smile Fund, and family contribution language are aligned.
- Build and TypeScript verification pass.

What is not yet deployable:

- Homepage messaging is still not sharp enough.
- The visual design lacks the polish and hierarchy of the North Star.
- Some UI elements feel generic or placeholder-like.
- Iconography is inconsistent and not yet product-grade.
- Cultural tales are present as a section, but not yet a compelling content universe.
- The flow needs a full user-eye audit, not just a route/build audit.

## Milestone Acceptance Criteria

This milestone is complete when:

1. A parent can understand the product within five seconds of landing on `/toothfairy`.
2. The page feels less crowded than the North Star mockup but retains its product completeness.
3. Header, hero, proof strip, how-it-works, Smile Fund preview, parent benefits, cultural tales, CTA band, and footer feel like one design system.
4. Copy is concise, emotionally clear, and not over-literal.
5. Tanda is present as a brand/story guide without overwhelming the conversion message.
6. The NFT/keepsake and Smile Fund visuals look custom, not placeholder.
7. The gift page and dashboard match the landing page visually.
8. Cultural tales feel like an intentional product pillar, not a decorative carousel.
9. The site is ready for Vercel preview review before production cutover.
10. The minting/payment mechanisms can still be labeled preview, but the frontend should feel ready to show test users.

## Workstream A: Product Messaging Polish

**Files:**
- Modify: `src/app/toothfairy/page.tsx`
- Modify: `src/app/toothfairy/app/page.tsx`
- Modify: `src/app/toothfairy/app/gift/[milestone]/page.tsx`
- Modify: `src/app/toothfairy/app/dashboard/page.tsx`
- Modify: `src/app/toothfairy/keepsake/[id]/page.tsx`

**Tasks:**

1. Compare the current V2 copy against the live site and North Star mockup.
2. Replace literal explanatory copy with short parent-facing product language.
3. Keep one core promise above the fold: a lost tooth becomes a memory, a family gift link, and a first savings lesson.
4. Remove anything that sounds like internal architecture unless it builds trust.
5. Keep transparent fee language in the flow, not in the main emotional pitch.

## Workstream B: Visual System Audit

**Files:**
- Modify: `src/app/toothfairy/page.tsx`
- Modify: `src/components/toothfairy/nav/tfn-header.tsx`
- Modify: `src/components/toothfairy/nav/tfn-footer.tsx`
- Modify: `src/components/toothfairy/tokens.ts`
- Modify: `src/app/globals.css`

**Tasks:**

1. Define the final V2 palette: warm cream, deep navy/ink, fairy gold, restrained purple, Solana accent only where useful.
2. Introduce a consistent icon system for benefits and steps.
3. Tighten spacing, border radii, shadows, and card hierarchy.
4. Reduce generic cards and make product surfaces feel designed.
5. Add subtle celestial-network background motifs without overwhelming the hero.
6. Decide whether to keep local fallback fonts for build reliability or add self-hosted brand fonts.

## Workstream C: Landing Page Full Polish

**Files:**
- Modify: `src/app/toothfairy/page.tsx`

**Tasks:**

1. Rebuild the hero around parent-child clarity first.
2. Keep Tanda visible but secondary to the parent-child-tooth moment.
3. Use UI overlays for the NFT keepsake and Smile Fund.
4. Add a cleaner trust/proof strip.
5. Refine the three-step "How It Works" into custom visual cards.
6. Rebuild "Why Parents Love It" with icons, concise benefits, and less literal text.
7. Add a polished CTA band that feels magical but not cluttered.
8. Upgrade cultural tales into a credible content-preview section.
9. Make the footer match the product brand and include email capture cleanly.

## Workstream D: Conversion Surface Polish

**Files:**
- Modify: `src/app/toothfairy/app/page.tsx`
- Modify: `src/app/toothfairy/app/gift/[milestone]/page.tsx`
- Modify: `src/app/toothfairy/keepsake/[id]/page.tsx`
- Modify: `src/app/toothfairy/app/dashboard/page.tsx`

**Tasks:**

1. Make the mint flow feel like the same brand as the homepage.
2. Keep the child activity warm and simple.
3. Keep the parent-controlled financial details trustworthy but not scary.
4. Make the gift page feel shareable to grandparents and family.
5. Make the dashboard look like the product promise fulfilled.
6. Use preview labels only where the mechanism is not final.

## Workstream E: Cultural Tales Product Pillar

**Files:**
- Modify: `src/app/toothfairy/stories/page.tsx`
- Modify: `src/app/toothfairy/story/[tradition]/page.tsx`
- Modify: `src/app/toothfairy/page.tsx`
- Potential create: `docs/content/tfn-cultural-tales-roadmap.md`

**Tasks:**

1. Treat cultural tales as a separate product stream, not a blocker for the first visual polish.
2. Choose the first 5-10 public stories intentionally.
3. Define the recurring lore mechanic: Tanda connects global traditions into the Tooth Fairy Network.
4. Define the quality bar for stories: entertaining for children, shareable for parents, respectful of cultural context.
5. Create a repeatable story brief template before generating dozens of stories.

## Recommended Priority

Do not cut over production yet.

Next best sequence:

1. Create or review the Vercel preview for the current branch.
2. Run a visual audit against the North Star image and current live site.
3. Execute Workstreams A-C first: messaging, visual system, landing page.
4. Then execute Workstream D: conversion surfaces.
5. Then start Workstream E in parallel once the main product shell feels credible.

## Open Decision

The next execution sprint should focus on one of two paths:

- **Path 1: Frontend polish sprint.** Make the site look ready to deploy, with the minting mechanism still labeled preview.
- **Path 2: Content universe sprint.** Build the cultural tales structure and first story set while the current frontend remains rough.

Recommendation: choose Path 1 first. Without a polished product shell, the stories will not land as a business. Once the shell looks credible, cultural tales become a powerful product layer instead of a distraction.

## Sprint Execution Notes

Path 1 is the active sprint. The frontend polish pass now covers the landing page, shared header/footer, mint flow, gift page, keepsake page, dashboard, and shared TFN visual tokens.

Current scope remains frontend-only. Do not perform production cutover, domain reassignment, production Supabase edits, mainnet contract changes, or wallet migration until Sathian explicitly approves that step at cutover time.

Verification run:

- `npx.cmd tsc --noEmit` passes.
- `npm.cmd run build` passes with preview-safe environment values.
- Temporary local route check returns 200 for `/toothfairy`, `/toothfairy/app`, `/toothfairy/app/dashboard`, `/toothfairy/app/gift/preview-id`, and `/toothfairy/keepsake/preview-id`.

Known residual notes:

- Screenshot capture from the sandbox is blocked by browser binary spawn permissions, so final visual review should happen in the in-app browser after restarting the local dev server.
- Build output still includes existing non-fatal warnings from unrelated article/static-cache behavior and a dynamic API route using cookies. These did not fail the build.
