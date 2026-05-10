# TFN V2 Image System Brief

## Purpose

The Tooth Fairy Network homepage should not feel like a collection of unrelated AI images. Each visual slot has a job:

- Explain the product in seconds.
- Keep Tanda present without making the page feel like a cartoon-only brand.
- Separate the emotional ritual from the financial mechanics.
- Introduce the global network/celestial blockchain motif.
- Make cultural tales feel like a content product, not decoration.

The current code now uses the first generated P0 asset set for the homepage. These assets are good enough for a V1 review, but not final brand canon.

## Visual Principles

- Parent-first clarity above the fold. The child/tooth moment must be instantly legible.
- Tanda is the guide, not the main conversion object.
- The Smile Fund dashboard and NFT keepsake should look like product UI, not screenshots from another app.
- "How it works" should use simple product illustrations, not busy scenes.
- Cultural tale cards can be richer and more storybook-like because that is where the content universe lives.
- The celestial network motif should appear in hero atmosphere, network band, and story universe moments.

## Slot Map

| Priority | Slot | Current asset | Current problem | Target direction |
| --- | --- | --- | --- | --- |
| P0 | Hero family/tooth photo | `/toothfairy/visual-system/hero-family-v1.png` | Good enough for V1; crop and diversity can improve later. | Warm parent-child photo: child holding lost tooth or drawing, parent nearby, calm home light, no busy background. |
| P0 | Tanda guide | `/toothfairy/visual-system/tanda-guide-v1.png` | Good enough for V1; needs character-model consistency before story production. | Transparent or clean-background Tanda in a simple hovering/pointing pose, brown hair, white dress, pastel wings, small shoulder bag. |
| P0 | NFT keepsake object | `/toothfairy/visual-system/nft-keepsake-v1.png` | Good enough for V1; generated text should become HTML/UI in final canon. | Custom premium keepsake card: glowing tooth, child drawing, handwritten note, Solana mint badge, no fake unreadable UI clutter. |
| P0 | Smile Fund dashboard | `/toothfairy/visual-system/smile-dashboard-v1.png` | Good enough for V1; final should be recreated as editable UI where possible. | Clean dashboard mock: balance, contribution list, growth line, age-10 unlock marker, family contributors. |
| P0 | How it works, step 1 | `/toothfairy/visual-system/save-moment-v1.png` | Good enough for V1; polish later for exact crop and lighting consistency. | Icon/mini-illustration: camera, tooth photo, child drawing. No scene background. |
| P0 | How it works, step 2 | `/toothfairy/visual-system/invite-family-v1.png` | Good enough for V1; improve family diversity and reduce avatar specificity later. | Icon/mini-illustration: family nodes sending tiny gift to one heart/fund. |
| P0 | How it works, step 3 | `/toothfairy/visual-system/watch-grow-v1.png` | Good enough for V1; keep age-10 marker but simplify if it feels too finance-heavy. | Icon/mini-illustration: bars or line chart, small SOL mark, age-10 milestone. |
| P1 | Network story band | `/fairy-assets/fairy-network-sky.jpg` | Strong concept but more fantasy than product. | Celestial blockchain organism: fairies moving through a connected network of glowing nodes above homes. |
| P1 | Cultural tales banner | `/story-assets/shared/shared-multiple-collectors.jpg` | Good concept but busy. | Wide cinematic banner showing Tanda meeting multiple traditions, composed with open space for text. |
| P1 | Tale cards | Existing story assets | Some are inconsistent in style and crop. | Consistent storybook thumbnails for first 10-15 stories, each with a clear cultural setting and main character. |
| P1 | Final CTA image | `/story-assets/shared/shared-network-station.jpg` | Conceptually right, but may feel dark/heavy if overused. | Polished glowing tooth/network station with warmer contrast and a clear CTA-safe crop. |
| P2 | Header/footer logo | Inline SVG | Functional but not a finished brand mark. | Clean tooth mark with subtle star, navy/purple/gold palette, usable at favicon and nav sizes. |

## First Asset Generation Prompts

### Hero Parent-Child Photo

Create a warm premium consumer website hero image for Tooth Fairy Network. A parent and a 6-8 year old child sit together in soft morning home light. The child proudly shows a newly lost tooth and a small crayon drawing. The parent smiles gently, close and supportive. Realistic lifestyle photography with magical but subtle golden dust near the tooth. No text, no UI, no logos. Composition leaves clean negative space on the left for website headline. Warm cream, navy, soft gold, restrained purple accents.

### Tanda Guide Character

Create a consistent full-body character reference for Tanda, the Tooth Fairy Network guide. Brown wavy hair, warm expressive face, white layered dress, pastel translucent butterfly wings with pink, gold, and blue shimmer, small brown crossbody pouch, tooth pendant necklace. Friendly, intelligent, slightly mischievous, child-safe, premium 3D storybook style. Pose: hovering and gesturing toward a glowing tooth. Clean transparent-style light background, no text.

### NFT Keepsake Object

Create a premium product mockup of a "Tooth Memory NFT" keepsake card. It includes a glowing tooth artifact, a small child smile photo, a crayon tooth drawing, and a handwritten note from family. The card feels magical, warm, and trustworthy, like a collectible memory object rather than a crypto trading card. Include subtle Solana-inspired accent colors only as small details. No fake readable text except "Tooth Memory" and "#1024".

### Smile Fund Dashboard

Create a clean parent-facing dashboard mockup for a child's Smile Fund. Show "Little Smile Fund", 12.45 SOL, a calm upward growth line, family contribution count, and an age 10 unlock milestone. Warm cream UI, deep navy text, soft green growth accents, subtle purple/gold details. Make it feel safe, simple, and premium. No noisy data tables. No unrelated crypto jargon.

### Celestial Network Banner

Create a wide cinematic banner showing the Tooth Fairy Network as a celestial blockchain. At night, small fairies and folklore collectors fly between glowing nodes above homes around the world. A glowing tooth sits at the center like a memory being recorded. The network should feel magical, organized, and modern, not chaotic. Deep navy sky, fairy gold, subtle Solana teal/purple accents. Leave room on the left for text.

## Acceptance Criteria

An image is ready to use when:

1. A parent understands what it shows in under two seconds.
2. It does not contain malformed hands, teeth, UI labels, flags, or unreadable fake text in important areas.
3. The crop works at desktop and mobile aspect ratios.
4. It matches the TFN palette: cream, deep navy, restrained purple, fairy gold, small green/Solana accents.
5. It either supports conversion or supports lore. If it does neither, it should not be on the homepage.

## Current Implementation Note

The homepage now uses the generated V1 visual strategy:

- Generated parent-child hero for fast product comprehension.
- Generated Tanda guide image as a secondary story cue.
- Generated mini-illustrations for the three-step sequence.
- Generated product mock panels for NFT keepsake and Smile Fund.
- Existing network/story assets for lore sections.

This is the right bridge state for V1 testing. The next visual leap comes from generating variants only for the weakest slots after user feedback, not from delaying the whole site.

## Review Surface

The visual production board now lives at:

`/toothfairy/visual-system`

This route is the working contact sheet for asset production. It shows the selected V1 contact sheet, names every priority image slot, shows the current placeholder/current asset, explains the gap, and gives the generation prompt plus acceptance criteria.

Use this order:

1. Review `/toothfairy` with the selected V1 assets in place.
2. Use `/toothfairy/visual-system` to mark any image as keep, close, or reject.
3. Generate variants only for close/reject slots.
4. Keep one consistent Tanda style and one consistent product UI style.
5. Run final homepage polish and preview deployment.
