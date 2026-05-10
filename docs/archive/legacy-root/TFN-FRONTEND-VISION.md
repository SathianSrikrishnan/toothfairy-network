# TFN Frontend Vision — For Kai

> What the site needs to look like and feel like. Design direction for the
> IMPECCABLE sweep and story integration.

---

## The Two Modes

The site has two visual modes that should feel like the same world at different times of day.

### Daytime Mode (Landing Page)
- **Theme:** Warm, cream/beige, gold accents
- **Feel:** A beautiful children's bookshop. Inviting, safe, premium.
- **Font:** Serif-influenced for headlines, clean sans for body
- **Colors:** cream (`oklch(97.5% 0.01 80)`), brown text, gold CTAs
- **When:** Landing page, stories globe, about pages
- **IMPECCABLE framework** applies here — clean grid, generous whitespace,
  fade-on-scroll animations, no clutter

### Nighttime Mode (Story + App)
- **Theme:** Deep navy, gold shimmer, teal accents
- **Feel:** Bedtime. A child's bedroom at night, with fairy light.
- **Font:** Plus Jakarta Sans headlines, Manrope body, Lora for story text
- **Colors:** Celestial Ledger system (see tokens.ts)
- **When:** Story player, mint flow, keepsake pages, admin
- **Effects:** Firefly particles, backdrop blur, gold glow, typewriter text

### The Transition
Going from landing page to story should feel like the lights dimming.
The cream fades to navy. Gold stays gold. The world gets quieter and more magical.

---

## Mobile-First Design Principles

1. **Full-bleed images.** No padding on story images. Edge to edge.
2. **One action per screen.** Never show two CTAs competing.
3. **Thumb-reachable controls.** Navigation buttons at bottom, not top.
4. **Large text.** Minimum 16px body, 24px+ headlines. Parents are reading aloud.
5. **Portrait images only.** 3:4 or 9:16. Never landscape. Phone is vertical.
6. **Load in <2 seconds.** Compress images. Use Next.js Image component.
7. **Dark mode default for stories.** It's bedtime.

---

## Page-by-Page Design Notes

### Landing Page (`/toothfairy`)
**Current state:** 7-8/10. Clear, functional, needs polish.

**What to improve:**
- Hero image: replace vibe-coded animation with stunning character-consistent art
- Hero copy: "Your child just lost a tooth. Let's make it the first thing they ever own."
- Stories section: show 3-5 featured stories as beautiful cards, not a list
- CTA: one clear gold button. "Make your child's first keepsake"
- Mobile: hero image + headline should be visible without scrolling
- Remove any technical/blockchain language from this page

### Stories Globe (`/toothfairy/stories`)
**Current state:** Functional but not stunning.

**What to improve:**
- Globe should be the centerpiece, larger on mobile
- Featured story cards below should have beautiful thumbnail images
- "Back" link currently points to `/toothfairy/concept-b` (WRONG — should be `/toothfairy`)
- Stats bar ("50 traditions / 13 stories live") is good, keep it

### Story Player (`/toothfairy/story/[tradition]`)
**Current state:** Working, needs richer content.

**What to improve:**
- Each scene should feel like turning a page in a picture book
- One unique image per 2-3 scenes MINIMUM (no more than 2 scenes per image)
- Progress bars at top (Instagram Stories style) — already implemented
- Typewriter text effect — already implemented
- Tanda mascot floats in bottom-left — keep
- CTA at end: warm bridge, not hard sell

### Mint Flow (`/toothfairy/app`)
**Current state:** Functional, 5-step wizard.

**What to improve:**
- Step 1 (Setup): child name, DOB, photo — clean and simple
- Step 2 (Create): drawing canvas + tooth photo — the child's moment
- Step 3 (Preview): show what the keepsake will look like
- Step 4 (Auth): Google sign-in gate — styled to match fairy theme
- Step 5 (Deposit): fee breakdown visible BEFORE payment
  - "You pay $X / Network fee (2%) -$Y / Saved for [child] $Z"
  - Gift amounts in USD: $5, $10, $25, custom
  - Lock choice: "Save until [child] turns 10 ([date])" or "Gift now"
  - Depositor name field: "From Grandma" / "From Dad"
- Step 6 (Done): Tanda holding the tooth. Shareable keepsake link.

### Keepsake Page (`/tooth/[name]`)
**Current state:** Exists, needs polish.

**What to improve:**
- Hero: the minted keepsake image, large and beautiful
- Below: child name, date, depositor list with amounts
- "Share with family" button (generates gift link)
- Total saved: "$XX saved for [child], unlocking [date]"
- Solscan verification link (small, bottom — for the curious)

---

## The Emotional Arc of the Site

A first-time parent should experience this:

1. **"Oh, this is beautiful"** — Landing page. Premium, warm, trustworthy.
2. **"My kid would love this"** — Stories. Captivating, culturally rich.
3. **"I want to do this with my child"** — Story CTA. Natural, not pushy.
4. **"This is easy"** — Mint flow. 3 minutes, no confusion.
5. **"This is meaningful"** — Keepsake page. Something permanent was made.
6. **"I should tell grandma"** — Share link. The viral loop starts.

Every design decision should serve this arc. If a UI element doesn't help
a parent move through these emotions, it doesn't belong on the page.

---

## What NOT to Do

- Don't show wallet addresses, transaction hashes, or blockchain jargon
- Don't use "Web3," "NFT," "mint," or "token" in parent-facing copy
- Don't add feature flags, toggles, or complexity
- Don't build admin features into the parent flow
- Don't use landscape images on mobile
- Don't add a "Connect Wallet" button on the landing page
- Don't interrupt the story with signup forms
- Don't show loading spinners longer than 2 seconds without a progress message
