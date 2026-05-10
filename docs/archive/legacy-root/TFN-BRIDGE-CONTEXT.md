# TFN Bridge Context — For Kai

> Generated 2026-04-23 by Pentagon Chief of Staff. This is the full strategic context
> for rebuilding the Tooth Fairy Network frontend experience. Hand this to Kai with
> the 3 story asset folders.

---

## 1. Product Direction (Locked Decisions)

### Core Thesis
TFN teaches kids ownership and sovereignty through the universal ritual of losing teeth.
A parent reads a story with their child. The story compels them to preserve this moment
as a digital keepsake. Family members can gift SOL to the child's escrow. It unlocks
when the child turns 10.

### Key Principles
- **Single tooth = full product.** The product must be compelling at ONE tooth entry.
  The 20-tooth journey is the ceiling, not the floor.
- **Default lock = child's 10th birthday.** "Double digits" is the milestone.
  Sovereignty, ownership, first real crypto moment.
- **No crypto language in parent-facing UI.** "Vault" not "wallet." "Preserved" not
  "staked." Parents see USD, not SOL.
- **Mobile-first.** Parent is doing this at 10pm, one-handed, after putting their kid
  to bed. The tooth is under the pillow. They have 3 minutes of attention.

### Tanda's Character
- Tanda is the protagonist of the Tooth Fairy Network story world
- Theme: sovereignty — she teaches ownership through her own journey
- The Tindora Eye is her symbol (artifact representing self-ownership)
- She's NOT a tour guide explaining the product. She lives a story.
- Gender-ambiguous, hummingbird-sized, character-consistent across all stories

### The Funnel
```
STORY (free, no signup) → CTA ("Make This Real") → MINT (Google Auth + keepsake)
→ DEPOSIT (family gifts SOL) → KEEPSAKE PAGE (shareable, family contributions visible)
```

---

## 2. Story Library Architecture

### Shelves, Not Seasons
Stories are organized by emotional frame, not episode number. Three shelves:

| Shelf | Age Sweet Spot | Emotional Core | Tanda's Role |
|-------|---------------|----------------|--------------|
| **Wonder** | 4-6 | Magic is real, my body is changing | Mysterious, playful, glimpses |
| **Growing Up** | 6-9 | I'm becoming someone, this moment matters | Mentor, shows her own struggles |
| **Sovereignty** | 9-12 | This is mine, I decide what happens | Equal — she hands the kid the keys |

### Design Principle
A family discovers one story at whatever age their kid is. That story is complete,
emotionally satisfying, and ends with a soft CTA. They never feel like they "missed
earlier episodes."

### Story Structure (StoryConfig format)
Each story is a TypeScript file in `src/data/stories/` with this shape:

```typescript
interface StoryScene {
  id: string
  background: string              // path to image in public/story-assets/
  character?: {
    image: string                 // character image path
    position: 'left' | 'center' | 'right'
    enter?: 'left' | 'right' | 'top' | 'bottom' | 'fade'
    exit?: 'left' | 'right' | 'top' | 'bottom' | 'fade'
  }
  dialogue: {
    speaker?: string              // character name (omit for narrator)
    speakerColor?: string         // hex color for speaker name
    text: string                  // the actual dialogue/narration
  }
  isChoice?: boolean              // true for CTA scenes
  choiceText?: string             // CTA button text
  choiceHref?: string             // CTA destination
}

interface StoryConfig {
  id: string                      // URL slug: /toothfairy/story/[id]
  title: string
  region: string
  emoji: string
  color: string                   // theme color (hex)
  description: string
  characterName: string
  scenes: StoryScene[]
  crossReferences: string[]       // other story IDs to recommend
  available: boolean              // false = hidden from UI
}
```

### Wall Card Format (for stories globe)
Each story also needs a wall card entry in `src/data/wall-cards/cards.ts`:

```typescript
{
  id: 'story-slug',
  slug: 'story-slug',
  title: 'Story Title',
  region: 'Country/Region',
  continent: 'Americas' | 'Europe' | 'Asia' | 'Africa' | 'Oceania',
  characterName: 'Character Name',
  image: '/story-assets/[folder]/[hero-image].jpg',
  miniStory: '5-6 sentence hook version of the story',
  theme: 'Primary Theme',
  featured: true,                 // shows as large tile
  linkedFullStory: 'story-slug',  // must match StoryConfig.id
  coordinates: { lat: XX.XX, lng: XX.XX },
  source: 'tfn-story-bible.md / entry name',
}
```

### Image Requirements Per Story
- **5 unique background images minimum** (one per act beat)
- **1 character image** (in `/story-assets/characters/`)
- **Shared images** available at `/story-assets/shared/`:
  - `shared-night-sky.jpg`
  - `shared-network-station.jpg`
  - `shared-multiple-collectors.jpg`
  - `shared-family-connected.jpg`
  - `shared-finale-teenager.jpg`
- **Aspect ratio:** Portrait (3:4) for mobile. NOT landscape.
- **Style:** Character-consistent via Loom/CC. NOT watercolor/Ghibli.

---

## 3. The 4 Core Pages

The entire product is 4 pages. Everything else is infrastructure.

### Page 1: Home/Landing
- URL: `toothfairy.network` (rewrites to `/toothfairy`)
- Purpose: Emotional hook. "Your child just lost a tooth."
- Current: cream/beige theme with gold accents (IMPECCABLE design framework)
- CTA: "Make your child's first keepsake" → goes to story selector or directly to app

### Page 2: Story
- URL: `toothfairy.network/story/[tradition]`
- Purpose: Parent reads with child. Child is captivated. Ends with soft CTA.
- Format: Full-screen, portrait, swipe-to-advance (Instagram Stories style)
- Dark/night mode (it's bedtime)
- Typewriter text effect, firefly particles, progress bars
- CTA at end: "Start Your Keepsake" → `/app`

### Page 3: Mint/Workflow (The App)
- URL: `toothfairy.network/app`
- Purpose: Create the keepsake. Child name, photo, drawing canvas.
- Steps: Setup → Create → Preview → Auth Gate → Mint → Done
- Google Auth gate between preview and mint (email capture + anti-spam)
- Server-side mint — parent does NOT need a wallet
- No mention of crypto, blockchain, or wallets on this page

### Page 4: Keepsake + Gift
- URL: `toothfairy.network/tooth/[name]`
- Purpose: The artifact. Family contributions. Share link.
- Shows: minted keepsake image, child name, depositor list, total saved
- "Share with family" link → anyone can deposit
- Gift amounts: $5, $10, $25 (USD, not SOL)
- Lock display: "Saved until [child]'s 10th birthday ([date])"

---

## 4. Design System: Celestial Ledger

The TFN design system is called "Celestial Ledger" — "Linear meets Bedtime Story."
Technical polish wrapped in dreamlike atmosphere.

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| bg | `#0d1228` | Deepest navy — base layer |
| surface | `#151a31` | Card backgrounds |
| gold | `#f0c456` | CTAs, headlines, fairy magic |
| heroGold | `#ffe3a5` | Shimmer text effects |
| teal | `#5adace` | Progress, active states, data |
| text | `#dde1ff` | Primary text (moonlight) |
| muted | `#d1c5b0` | Secondary text |
| pearl | `#FFF8F0` | Warm white (tooth pearl) |
| ember | `#ffb8b8` | Warm accents |

### Typography
- **Headlines:** Plus Jakarta Sans (700, 800)
- **Body:** Manrope (400-700)
- **Story text:** Lora (400-600, italic available)

### Visual Effects
- Ghost borders (`rgba(78, 70, 54, 0.15)` — never solid 1px)
- Gold glow on CTAs: `0 4px 24px rgba(240, 196, 86, 0.2)`
- Firefly particles (gold + teal, animated opacity)
- Backdrop blur on cards: `blur(24px)`

### Landing Page Theme (IMPECCABLE)
The landing page (`/toothfairy`) uses a warm cream/beige theme:
| Token | Value |
|-------|-------|
| cream | `oklch(97.5% 0.01 80)` |
| brown | `oklch(30% 0.035 65)` |
| gold | `oklch(72% 0.145 75)` |

This is the "daytime" theme. Stories and app use the dark "nighttime" Celestial Ledger theme.

---

## 5. Technical Architecture

### Stack
- Next.js 14 (App Router)
- Solana Wallet Adapter (Phantom)
- Anchor client for escrow contract
- Metaplex Bubblegum (cNFT minting)
- Supabase (auth)
- Resend (transactional email)
- Vercel hosting

### Smart Contract
- Program ID: `FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC`
- Deployed on Solana mainnet
- 2% deposit fee (sacred — do not change)
- 10% early withdrawal penalty (change to 5% queued, not approved)
- Lock periods: immediate, 3yr, 5yr, 7yr, 10yr, 15yr, custom timestamp
- Multi-depositor: anyone can deposit to any child's milestone
- 7-day refund window for depositors

### Key API Routes
| Route | Purpose |
|-------|---------|
| `/api/toothfairy/mint` | Server-subsidized cNFT mint (main path) |
| `/api/toothfairy/escrow-setup` | Create child profile + milestone (wallet users) |
| `/api/toothfairy/email-escrow-setup` | Server-side escrow for email users |
| `/api/toothfairy/server-deposit` | Deposit after Coinbase Onramp payment |
| `/api/toothfairy/actions/deposit` | Solana Actions/Blinks for social sharing |
| `/api/toothfairy/welcome-email` | Welcome email via Resend |
| `/api/toothfairy/deposit-email` | Deposit confirmation email via Resend |
| `/api/toothfairy/health` | Liveness check |
| `/api/toothfairy/escrow-viewer` | Read-only admin view of all on-chain data |
| `/api/auth/google` | Google OAuth initiation |

### Domain Routing
- `toothfairy.network/*` → rewrites to `/toothfairy/*` via middleware
- `sathian.ai/*` → serves personal hub at root
- Both served from same Vercel project (`sathian-ai`)

---

## 6. What's Been Done (April 2026)

### Merged PRs
- PR #2: Deposit flow — fee disclosure before payment, confirmation email, mobile Coinbase redirect
- PR #3: Wall card Tanda link fix (was 404)
- PR #4: Escrow viewer admin page at `/toothfairy/admin/escrow-viewer`

### Fixed Issues
- Wallet adapter TypeScript errors (React 18 vs adapter types)
- Crossmint route disabled (returns 410 Gone — was exposing collection internals)
- Auth bypass for localhost testing (`?skip_auth=true` on localhost only)

### Live Features
- 53 child profiles on-chain, 31 deposits, 4.59 SOL total
- 13 story configs in StoryConfig format (tooth-fairy, korea, finland, etc.)
- 50+ tradition wall cards on stories globe (13 active, 40 coming-soon)
- Google OAuth gate
- Welcome email on signup
- Deposit confirmation email

---

## 7. What Needs to Happen for Friday (April 25)

1. **3 new stories integrated** — your new stories from Loom/CC need to be wired into
   StoryConfig format and deployed
2. **IMPECCABLE design sweep** — landing page and story pages polished
3. **End-to-end test** with fresh Google account (incognito)
4. **5-user test** — real parents, real feedback
5. **MoonPay/Coinbase Onramp** — fiat payment path for non-crypto users

---

## 8. File Structure Reference

```
src/
  app/
    toothfairy/
      page.tsx              — Landing page (IMPECCABLE cream theme)
      stories/
        page.tsx            — Stories globe + wall cards
        [slug]/page.tsx     — Individual story detail / coming-soon
      story/
        page.tsx            — Story selector (13 traditions)
        [tradition]/page.tsx — Story player (StoryConfig-driven)
      app/
        page.tsx            — Main mint/deposit flow (6 steps)
        layout.tsx          — Wallet adapter providers
        dashboard/page.tsx  — View child profiles after mint
        gift/[milestone]/   — Public gift/deposit link
        recover/page.tsx    — Re-access existing profiles
      admin/
        escrow-viewer/      — Admin dashboard (read-only)
  data/
    stories/                — StoryConfig files (one per tradition)
    wall-cards/             — Globe marker data (active + coming-soon)
  components/
    toothfairy/
      tokens.ts             — Design system (colors, typography, effects)
      story/StoryPlayer.tsx — Story playback component
      app/parent-flow.tsx   — Parent-facing mint flow
      auth-gate.tsx         — Google OAuth + magic link
  lib/
    toothfairy/
      escrow.ts             — Client-side escrow helpers
      escrow-idl.json       — Anchor IDL for contract
      cnft.ts               — cNFT minting helpers
      crossmint.ts          — Crossmint integration (disabled)
      rate-limit.ts         — Rate limiting
public/
  story-assets/             — All story images by tradition
    tooth-fairy/            — 5 images (tf-01 through tf-05)
    korea/                  — 5 images
    finland/                — 5 images
    ... (one folder per tradition)
    characters/             — Character images (char-*.jpg)
    shared/                 — Shared backgrounds (night sky, network station, etc.)
  stories/
    episode-1/              — Old Tanda episode images (deprecated)
  toothfairy/
    tanda.png               — Tanda mascot image
```
