# Project History

Tooth Fairy Network started as a small `sathian.ai` experiment and became a standalone family product during the 2026 Solana Colosseum sprint.

## Origin

The first idea was simple: a child loses a tooth, a parent preserves the moment, and family can gather around it. The crypto layer is deliberately quiet in the parent experience. The product language is about ownership, memory, and a child's first meaningful digital object.

## Colosseum Sprint

The Colosseum sprint pushed the project from concept into a public demo:

- A polished TFN landing page and Colosseum narrative surface
- Story-driven onboarding for cultural tooth-loss traditions
- A parent-child keepsake creation flow
- Server-side Solana cNFT minting through Metaplex Bubblegum
- Supabase-backed auth and profile persistence
- Shareable keepsake pages
- Email and gift/deposit proof paths
- Remotion storyboard tooling for demo video work

## Product Lessons

The strongest signal came from the parent-child moment, not the infrastructure. Kids respond to creating the drawing and seeing it become special. Parents respond to a keepsake that feels beautiful enough to share with family. That makes the keepsake page and story quality the center of the product.

The public repo now reflects that thesis: code first, reviewer-friendly documentation at the root, and older planning notes moved to `docs/archive/`.

## Current State

The app is a Next.js production web app with active TFN routes, story content, Solana integration, Supabase integration, and Colosseum demo surfaces. Some legacy `sathian.ai` routes remain in the same deployment because this product began inside that app.

## Near-Term Priorities

- Keep the parent-facing language free of blockchain jargon.
- Tighten the keepsake creation path until it feels fast and obvious on mobile.
- Continue improving the strongest stories before expanding the full tradition library.
- Audit and document the on-chain contract integration before making fee or custody changes.
- Keep public repo presentation clean as the project moves from hackathon sprint to product.

