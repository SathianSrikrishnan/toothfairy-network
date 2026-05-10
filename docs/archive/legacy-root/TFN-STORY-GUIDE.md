# TFN Story Integration Guide — For Kai

> How to take Sathian's 3 new stories and wire them into the codebase.

---

## Step 1: Create StoryConfig Files

For each new story, create a file at `src/data/stories/[story-id].ts`:

```typescript
import { StoryConfig } from './types'

const storyName: StoryConfig = {
  id: 'story-id',                    // URL slug — lowercase, hyphens
  title: 'Story Title',
  region: 'Country/Region',
  emoji: '....',
  color: '#HEXCOLOR',                // Theme color for this story
  description: 'One-line description',
  characterName: 'Character Name',
  available: true,
  crossReferences: ['other-story-id', 'another-story-id'],
  scenes: [
    // ACT 1: THE FAMILIAR (3-4 scenes)
    {
      id: 'xx-01',
      background: '/story-assets/[folder]/[image].jpg',
      dialogue: {
        text: "Narrator text goes here.",
      },
    },
    // Character dialogue scene:
    {
      id: 'xx-05',
      background: '/story-assets/[folder]/[image].jpg',
      character: {
        image: '/story-assets/characters/char-[name].jpg',
        position: 'center',
        enter: 'right',              // first appearance animation
      },
      dialogue: {
        speaker: 'Character Name',
        speakerColor: '#HEXCOLOR',
        text: "Character dialogue here.",
      },
    },
    // CTA scene (always last):
    {
      id: 'xx-cta',
      background: '/story-assets/[folder]/[final-image].jpg',
      dialogue: { text: "" },
      isChoice: true,
      choiceText: "Start Your Keepsake",
      choiceHref: "/app",
    },
  ],
}

export default storyName
```

## Step 2: Register in Index

Edit `src/data/stories/index.ts`:

```typescript
import newStory from './new-story-id'

export const ALL_STORIES: StoryConfig[] = [
  // ... existing stories
  newStory,  // Add here
]
```

## Step 3: Add Wall Card

Edit `src/data/wall-cards/cards.ts` — add an entry for each new story:

```typescript
{
  id: 'story-slug',
  slug: 'story-slug',
  title: 'Story Title',
  region: 'Region',
  continent: 'Americas',            // or Europe, Asia, Africa, Oceania
  characterName: 'Name',
  image: '/story-assets/[folder]/[hero].jpg',
  miniStory: 'A 5-6 sentence hook version...',
  theme: 'Primary Theme',
  featured: true,
  linkedFullStory: 'story-slug',    // MUST match StoryConfig.id
  coordinates: { lat: XX.XX, lng: XX.XX },
  source: 'sathian / 2026-04-23',
},
```

## Step 4: Add Images

Place images in `public/story-assets/[story-folder]/`:
- 5+ background images (portrait 3:4 aspect ratio)
- 1 character image in `public/story-assets/characters/char-[name].jpg`

Image naming convention: `[prefix]-[nn]-[description].jpg`
Example: `tf-01-bedroom.jpg`, `kr-03-magpie-descends.jpg`

## Step 5: Verify

```bash
npm run build    # TypeScript clean?
npm run dev      # Visit /toothfairy/story/[new-id] — does it render?
```

---

## Story Writing Guidelines

### Structure: 3 Acts
1. **The Familiar** (3-4 scenes) — Ground the child in something they know.
   "It's nighttime..." / "You just lost a tooth..." / relatable moment.
2. **The Reveal** (6-8 scenes) — The character appears, the magic happens.
   Character has personality. Something is at stake. Not just exposition.
3. **The Invitation** (3-4 scenes) — Bridge to the product.
   Other cultures mentioned. "Every tooth tells a story." Warm CTA.

### Voice Rules
- Second person ("YOUR tooth") for narrator scenes
- Character dialogue: personality, not exposition. They don't explain the product.
- Short sentences. Read-aloud pacing. A 5-year-old is listening.
- Each scene = one thought. Don't cram multiple ideas into one dialogue box.

### What Makes a Story Work
- **Conflict or surprise** — something unexpected happens
- **The child matters** — their tooth is special because of THEM, not the fairy
- **Emotional payoff** — the reader feels something before the CTA
- **Cultural authenticity** — research the real tradition, then add TFN magic

### What Doesn't Work
- Character as tour guide ("Welcome to the Network! Here's how it works!")
- No stakes, no tension, no surprise
- Too many scenes with the same background image
- Crypto/blockchain language in the story text
- Hard-sell CTA ("Buy now!")

---

## Existing Stories in Codebase (13 total)

| ID | Title | Region | Character | Status |
|----|-------|--------|-----------|--------|
| tooth-fairy | The Tooth Fairy | North America | Tooth Fairy / Tanda | Active, best quality |
| ratoncito-perez | Ratoncito Perez | Spain | Perez | Active |
| finland | Hammaskeiju | Finland | Hammaskeiju | Active |
| north-africa | The Sun Prayer | North Africa | The Sun | Active |
| jamaica | The Rolling Calf | Jamaica | Granny | Active |
| korea | The Magpie's Song | South Korea | Kkachi | Active |
| romania | The Crow | Romania | The Crow | Active |
| japan | The Tooth Kami | Japan | Haruki | Active |
| ethiopia | The Hyena's Bargain | Ethiopia | Hyena | Active |
| cherokee | The Beaver Circuit | Cherokee Nation | Beaver | Active |
| ireland | Anna Bogle | Ireland | Anna Bogle | Active |
| italy | The Venice Trio | Italy | Venice Trio | Active |
| babylonia | The Tooth Worm | Babylonia | Tooth Worm | Active |

All stories follow the same 3-act structure and use 5 background images + 1 character
image + shared images. New stories should match this pattern.
