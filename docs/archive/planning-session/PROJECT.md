# Tooth Fairy Network

## What This Is

A digital tooth fairy keepsake platform where parents and children create permanent, shareable mementos of lost teeth — anchored in cultural stories from around the world and minted as cNFTs on Solana. The product is three experiences: an inviting landing page, entertaining cultural tooth-loss stories, and a stunning keepsake page that makes family say "awww." TFN is Sathian's first product launch, entering the Solana ecosystem as the first family-focused crypto product.

## Core Value

When a family member opens a shared keepsake link, they feel genuine delight — "that's so cute and really cool" — and want to share it further. The keepsake page IS the product. Everything else exists to make that moment happen.

## Requirements

### Validated

- ✓ cNFT minting pipeline — server-side via Bubblegum, parents never sign/pay (live on mainnet)
- ✓ Merkle tree deployed — 16,384 capacity, 4+ tokens minted successfully
- ✓ Arweave permanent image storage via Irys
- ✓ Rate limiting and security — 10 mints/hour/IP, origin whitelist, input validation
- ✓ Escrow contract — multi-depositor, time-locks, 7/7 tests passing (devnet)
- ✓ 13 cultural stories written with scene structures and ambient effects
- ✓ StoryPlayer with 6 layout types (cover, narrative, character, dramatic, victory, cta)
- ✓ Impeccable design DNA (.impeccable.md) — Alegreya fonts, OKLCH tokens, dual-theme system
- ✓ Landing page (Concept B) — polished to Impeccable standards, warm cream aesthetic
- ✓ Chain of Teeth animation prototype at /toothfairy/chain

### Active

**Core Product (Priority 1 — ship before anything else)**
- [ ] Keepsake page redesign — stunning, shareable, beautiful card + interactive + social-ready
  - Beautiful card layout matching landing page warmth
  - Child's name, drawing, story origin, mint date
  - Animations that bring it to life
  - Optimized for grandma opening on her phone (fast load, no wallet needed, beautiful OG preview)
- [ ] 5 killer stories polished to genuinely entertaining quality
  - Not AI slop — thoughtful, memorable, culturally authentic
  - Entertaining for children (age 4-9 range)
  - Parents enjoy reading them aloud
  - Shareable as standalone content ("here's a fun story from Nigeria")
- [ ] Drawing canvas — full-screen finger painting experience
  - Large enough for a 4-year-old's fingers
  - Color, label, create something they're proud of
  - The drawing IS the permanence — whatever they make becomes the centerpiece
- [ ] AI enhance (subtle, 10%) — adds a touch of magic linked to the story
  - NOT full transformation — just enough to delight
  - Connected to the story/tradition the child came from
  - The "wow" moment when parent and child see the enhanced version
- [ ] End-to-end parent-child flow working seamlessly
  - Parent reads story → child draws tooth → AI enhances → mint → keepsake page
  - Wallet auth (Phantom) smooth and minimal
  - The whole experience should take ~5 minutes and feel magical

**Design Cohesion (Priority 1.5 — alongside core)**
- [ ] Parent view and child view look cohesive (warm cream / deep indigo / gold connector)
- [ ] Story selector, stories, and keepsake page all match landing page quality
- [ ] Impeccable polish applied across all hot pages (not just landing)

**Smart Contract & Business Model (Priority 2 — after core product)**
- [ ] Full audit of existing escrow contract — verify what was built, identify gaps
- [ ] Pricing model decision — 1% fee vs 0.3 SOL flat fee vs other options
  - Mentor feedback: 2% too rich, market may reject
  - Volume play: low fee, high AUM strategy
  - Need to understand Solana rent costs and margin implications
- [ ] Wire escrow to frontend — deposit UI, claim UI, gallery with depositor breakdown
- [ ] Solana rent cost optimization — explore if rent can be lowered

**Distribution & Growth (Priority 3 — after product is genuinely ready)**
- [ ] Email capture on landing page (simple, immediate)
- [ ] Email distribution system for digital marketing
- [ ] Social media advertising strategy — target parents in specific markets/geographies
- [ ] Instagram/digital channel setup — AI-managed where possible
- [ ] Fiat on-ramp — MoonPay research and integration (gateway for non-crypto parents)

**Content Scale (Priority 4 — ongoing)**
- [ ] Expand to 20-25 polished stories (from current 13, 5 killer first)
- [ ] Story planning on a map — visual layout of traditions globally
- [ ] Character development — memorable, relatable illustrated characters
- [ ] Animation style and theme that's forgiving and consistent
- [ ] Animated video content for marketing and Colosseum submission

**Platform & Scale (Priority 5 — post-traction)**
- [ ] Personalized permanent links (toothfairy.network/child-name-id)
- [ ] Solana mobile app — first family-focused app in the Solana store
- [ ] Multi-chain exploration (Base/React network) based on business strategy
- [ ] Physical NFC coin upsell — tap to open keepsake link
- [ ] Dashboard and admin interface
- [ ] Profile editing (child name, DOB, photo)
- [ ] Push notifications for new deposits

### Out of Scope

- Full Fabric.js canvas (stickers, layers, fairy drag-and-drop) — v2 after traction proves demand
- React Native app — PWA first, native later
- AI art transformation (drawing → fairy creature) — blocked on Tanda LoRA, defer
- Staking yield integration (jitoSOL) — requires regulatory clarity
- Blog/content distribution community — test with direct marketing first
- Team hiring — solo + Claude until product-market fit proven
- sathian.ai redesign — downstream of TFN, not the other way around

## Context

**Origin:** Started as a project on sathian.ai, evolved through the Solana hackathon (Colosseum) into a standalone business. The hackathon and timeline served as a catalyst to advance from hobby to real product.

**Current state (April 2026):** MVP is live on mainnet with working cNFT pipeline. Impeccable design system applied to landing page and story infrastructure. 13 stories written with scene structures. However, the keepsake page (the actual product people share) looks nothing like the polished landing page. Parent/child views are incohesive. Stories need depth and genuine entertainment value.

**Grant rejections:** Solana Foundation, Coinbase (fiat on-ramp), and Superteam Canada all rejected. Signal: the product wasn't genuinely ready, and positioning wasn't sharp enough. The rejections are a calibration point — no more submitting until the product speaks for itself.

**The moat:** Cultural stories done with genuine care and depth. 105 traditions researched, 50-70 strong enough for full stories. Each story requires 1-4 hours of thoughtful crafting — human-AI collaboration, not pure generation. This is the barrier to entry competitors can't replicate in a weekend.

**User insight (from Sathian's children):** Kids love the AI enhance moment — drawing something and watching it transform. The drawing experience needs to be full-screen, finger-friendly, and the result needs to feel precious. Parents enjoy reading stories aloud. The parent-child co-creation is the magic — not a solo experience for either.

**Revenue model:**
- Phase 1: Free cNFT to onboard (TFN absorbs cost ~$0.06-0.36/tooth)
- Phase 2: Optional SOL deposits → TFN takes fee (under review: 1% vs flat fee)
- Unit economics: 20 teeth × deposit × fee = lifetime value per child
- Goal: high volume, low fee, build AUM

**Go-to-market thinking:**
- Stories as lead generation: "Here's an interesting story you can read with your child"
- Target markets by geography — Nigerian parents, Indian parents, etc. via digital marketing
- Superteam meetups for in-person feedback and crypto-native early adopters
- Digital outreach for scale — social media ads, email marketing, parent communities
- In-person serves feedback; digital serves scale

## Constraints

- **Hard deadline**: Colosseum hackathon submission by May 4, 2026 (video + demo showing progress and product)
- **Solo + Claude**: One founder, one AI builder. Execution capacity is the bottleneck.
- **Budget**: ~$300 flexible for tools and services. Don't skip something useful to save $20.
- **Solana-first**: Committed to Solana ecosystem, Phantom wallets, Metaplex Bubblegum. Multi-chain later as business strategy dictates.
- **Server wallet**: ~0.22 SOL remaining. Needs top-up before heavy minting.
- **Trust deficit**: Previous work (contract, grant apps) was accepted without verification. All prior work must be audited before building on top of it.
- **No fake timelines**: Plans sequence by dependency, not calendar dates. Only hard dates are external deadlines.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| TFN is a standalone product, not a sathian.ai feature | Needs its own legs, own brand, own business structure | — Pending (still hosted on sathian.ai route) |
| Quality over speed — don't rush for Superteam | 300 users with a great product beats a rushed demo. Take the extra time. | — Pending |
| 5 killer stories > 50 mediocre ones | Thoughtful moat > volume. Each story 1-4hrs of real craft. | — Pending |
| Fee model under review (was 2%) | Mentor says 2% too rich. Exploring 1%, 0.3 SOL flat, or other. Volume play. | — Pending |
| Skip codebase mapping | Deep context from conversation + memory files sufficient for GSD init | ✓ Good |
| Fiat on-ramp deferred to post-core | Superteam/crypto crowd has Phantom. Non-crypto parents need it later. MoonPay is the path. | — Pending |
| Smart contract audit before building on it | Grant rejection + no verification = can't trust what exists. Audit first. | — Pending |
| No calendar-based plans | Sequence by dependency. Claude executes fast when properly aligned. Dates only for external deadlines. | ✓ Good |

---
*Last updated: 2026-04-10 after initialization*
