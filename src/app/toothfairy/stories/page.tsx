import type { CSSProperties } from 'react'
import Link from 'next/link'
import {
  comingSoonTraditions,
  wallCards,
} from '@/data/wall-cards'
import { LIVE_STORIES } from '@/data/stories'

type StoryCardMeta = {
  cover: string
  collector: string
  country: string
  door: string
  bedtimeHook: string
  accent: string
}

type CollectorProfile = {
  name: string
  country: string
  image: string
  storyId: string
  accent: string
  focus: string
  zoom: string
  lead?: boolean
}

type ShelfTeaser = {
  slug: string
  region: string
  characterName: string
  title: string
}

const palette = {
  paper: '#fffaf1',
  cream: '#fbf7ee',
  parchment: '#efe3c8',
  ink: '#11234a',
  inkSoft: '#334260',
  muted: '#687188',
  forest: '#12261f',
  forestSoft: '#1d3a30',
  gold: '#d8a43c',
  goldDeep: '#9b690f',
  rose: '#bd536f',
  teal: '#2f917f',
  border: 'rgba(178, 151, 107, 0.32)',
}

const storyCards: Record<string, StoryCardMeta> = {
  tanda: {
    cover: '/story-assets/tanda/v2/s1-frame-01-cover.png',
    collector: 'Tanda',
    country: 'Network origin',
    door: 'The night the Network woke',
    bedtimeHook:
      'A skipped note sends Tanda looking for the right keepers, because every tooth needs its story.',
    accent: '#d9a441',
  },
  'viking-origin': {
    cover: '/story-assets/viking-origin/v2/s2-frame-01-cover-v3.png',
    collector: "Tanda's father",
    country: 'First Tooth Fee',
    door: 'The first Tooth Fee',
    bedtimeHook:
      'Young Tanda learns why a tiny gift can mark a child growing into something new.',
    accent: '#2f8b78',
  },
  'ratoncito-perez': {
    cover: '/story-assets/ratoncito-perez/v2/rp3-frame-01-two-doors.png',
    collector: 'Ratoncito Perez',
    country: 'Spain',
    door: 'The Toothlight Treaty',
    bedtimeHook:
      'In Madrid, two family traditions learn how to share one child without making either smaller.',
    accent: '#b95a51',
  },
  korea: {
    cover: '/story-assets/korea/v2/kkachi-story-card.png',
    collector: 'Kkachi',
    country: 'South Korea',
    door: 'The roof song',
    bedtimeHook:
      'A rooftop song only works when the old family voice is still alive inside it.',
    accent: '#267f90',
  },
  'waraba-edge-light': {
    cover: '/story-assets/waraba-edge-light/v1/support/s5-landscape-story-card.png',
    collector: 'Waraba',
    country: 'Ethiopia / Harar',
    door: 'The edge of the light',
    bedtimeHook:
      'A child steps past the kitchen glow and finds that courage can walk beside fear.',
    accent: '#a7652e',
  },
  'daga-one-year-wish': {
    cover: '/story-assets/daga-one-year-wish/site/story-06-story-card.png',
    collector: 'Daga',
    country: 'Philippines',
    door: 'The one-year wish',
    bedtimeHook:
      'A roof mouse hides one small tooth until time helps the wish grow ready.',
    accent: '#7b6cb5',
  },
  'anna-bogle': {
    cover: '/story-assets/anna/v2/finals/story7-frame-01-cover.png',
    collector: 'Anna Bogle',
    country: 'Ireland',
    door: 'The gap in the gold',
    bedtimeHook:
      'Rain, bargains, old promises, and a gift that was never meant to be for sale.',
    accent: '#438861',
  },
}

const collectors: CollectorProfile[] = [
  {
    name: 'Tanda',
    country: 'Network origin',
    image: '/story-assets/tanda/tf-05-tanda.png',
    storyId: 'tanda',
    accent: '#d9a441',
    focus: '50% 36%',
    zoom: '1.04',
    lead: true,
  },
  {
    name: "Tanda's father",
    country: 'First Tooth Fee',
    image: '/story-assets/viking-origin/v2/s2-frame-03-maker.png',
    storyId: 'viking-origin',
    accent: '#2f8b78',
    focus: '40% 28%',
    zoom: '1.14',
    lead: true,
  },
  {
    name: 'Ratoncito Perez',
    country: 'Spain',
    image: '/story-assets/ratoncito-perez/rp-02-mouse.png',
    storyId: 'ratoncito-perez',
    accent: '#b95a51',
    focus: '36% 64%',
    zoom: '1.74',
    lead: true,
  },
  {
    name: 'Kkachi',
    country: 'South Korea',
    image: '/story-assets/korea/v2/kkachi-collector-card.png',
    storyId: 'korea',
    accent: '#267f90',
    focus: '72% 42%',
    zoom: '1',
  },
  {
    name: 'Waraba',
    country: 'Ethiopia / Harar',
    image: '/story-assets/characters/char-waraba.png',
    storyId: 'waraba-edge-light',
    accent: '#a7652e',
    focus: '50% 28%',
    zoom: '1.08',
  },
  {
    name: 'Daga',
    country: 'Philippines',
    image: '/story-assets/daga-one-year-wish/site/story-06-daga-site-portrait.png',
    storyId: 'daga-one-year-wish',
    accent: '#7b6cb5',
    focus: '68% 44%',
    zoom: '1.16',
  },
  {
    name: 'Anna Bogle',
    country: 'Ireland',
    image: '/story-assets/characters/char-anna-bogle-v2.png',
    storyId: 'anna-bogle',
    accent: '#438861',
    focus: '50% 24%',
    zoom: '1.1',
  },
]

const atlasRoutes = [
  {
    place: 'Madrid, Spain',
    keeper: 'Ratoncito Perez',
    cue: 'A tooth under the pillow becomes a night route through the city.',
  },
  {
    place: 'South Korea',
    keeper: 'Kkachi the Magpie',
    cue: 'A rooftop call turns a lost tooth into a song that remembers its elder voice.',
  },
  {
    place: 'Ethiopia / Harar',
    keeper: 'Waraba',
    cue: 'A child steps to the edge of the light and asks courage to answer back.',
  },
  {
    place: 'Philippines',
    keeper: 'Daga',
    cue: 'A roof mouse hides a wish where only time can open it.',
  },
  {
    place: 'Ireland',
    keeper: 'Anna Bogle',
    cue: 'A gold gift becomes trustworthy again when it points back to the memory.',
  },
]

const wallBySlug = new Map(wallCards.map((card) => [card.slug, card]))
const comingBySlug = new Map(comingSoonTraditions.map((card) => [card.slug, card]))

const shelfItem = (
  slug: string,
  fallback: Omit<ShelfTeaser, 'slug'>,
): ShelfTeaser => {
  const item = wallBySlug.get(slug) ?? comingBySlug.get(slug)

  return {
    slug,
    region: item?.region ?? fallback.region,
    characterName: item?.characterName ?? fallback.characterName,
    title: item?.title ?? fallback.title,
  }
}

const nextShelf = [
  shelfItem('finnish-fairy', {
    region: 'Finland',
    characterName: 'Hammaskeiju',
    title: 'The Tooth Fairy of the Northern Lights',
  }),
  shelfItem('nigerian-stones', {
    region: 'Nigeria',
    characterName: 'The Stone Throwers',
    title: 'Six Stones for a Strong New Tooth',
  }),
  shelfItem('german-zahnfee', {
    region: 'Germany',
    characterName: 'Zahnfee',
    title: 'The Tooth Box on the Bedside Table',
  }),
  shelfItem('indian-sparrow', {
    region: 'India',
    characterName: 'Chidiya the Sparrow',
    title: 'A Rooftop Tooth for the Sparrow',
  }),
  shelfItem('malaysian-soil', {
    region: 'Malaysia',
    characterName: 'The Soil',
    title: 'The Tooth Beneath the Rambutan Tree',
  }),
]

const culturePreview = LIVE_STORIES.map((story) => {
  const meta = storyCards[story.id] ?? storyCards.tanda

  return {
    id: story.id,
    image: meta.cover,
    label: meta.country,
  }
})

const styleVars = (vars: Record<string, string>) => vars as CSSProperties
const storyAccent = (accent: string) => styleVars({ '--accent': accent })

export const metadata = {
  title: 'Tooth Fairy Atlas',
  description:
    'Read Tooth Fairy Network bedtime stories, meet the collectors, and explore tooth traditions from around the world.',
}

export default function StoriesPage() {
  return (
    <main className="atlas-page">
      <section className="atlas-hero">
        <div className="hero-copy">
          <p className="eyebrow">Tooth Fairy Atlas</p>
          <h1>Seven keepers. Seven ways to make magic from a lost tooth.</h1>
          <p>
            Start with Tanda, then follow the old promises behind lost-tooth
            traditions from every corner of the world.
          </p>
          <div className="hero-actions">
            <Link href="#begin-reading">Read the stories</Link>
            <Link href="#atlas">Explore the atlas</Link>
          </div>
        </div>

        <div className="hero-gallery" aria-label="Storybook world preview">
          <figure className="gallery-main">
            <img src="/story-assets/viking-origin/vo-01-village.png" alt="" />
          </figure>
          <figure className="gallery-tanda">
            <img src="/story-assets/tanda/tf-05-tanda.png" alt="" />
          </figure>
          <figure className="gallery-perez">
            <img src="/story-assets/ratoncito-perez/v2/rp3-frame-10-tanda-arrives.png" alt="" />
          </figure>
        </div>
      </section>

      <section id="begin-reading" className="story-shelf">
        <div className="section-kicker">
          <p className="eyebrow">Start here</p>
          <h2>Seven bedtime stories now open the Tooth Fairy Network.</h2>
          <p>
            Begin with the three origin stories, then keep going as the Network
            grows through rooftops, kitchens, old bargains, hidden wishes, and
            family promises.
          </p>
        </div>

        <div className="featured-grid">
          {LIVE_STORIES.map((story) => {
            const meta = storyCards[story.id] ?? storyCards.tanda

            return (
              <Link
                key={story.id}
                href={`/toothfairy/story/${story.id}`}
                className="feature-card"
                style={storyAccent(meta.accent)}
                aria-label={`Read ${story.title}`}
              >
                <span className="feature-image">
                  <img src={meta.cover} alt="" />
                </span>
                <span className="feature-copy">
                  <small>{meta.country}</small>
                  <strong>{meta.door}</strong>
                  <span>{meta.bedtimeHook}</span>
                  <b>Read</b>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section id="atlas" className="map-section">
        <div className="section-kicker centered">
          <p className="eyebrow">Explore the world</p>
          <h2>Every tooth tradition opens a door to culture.</h2>
          <p>
            The Network starts with bedtime, then opens into the ways families
            mark a loose tooth: luck, courage, patience, memory, and growing up.
          </p>
        </div>

        <div className="map-panel">
          <div className="atlas-board" aria-label="Story atlas route board">
            <div className="atlas-board-top">
              <div>
                <span>50+</span>
                <p>global traditions ready to become family story nights</p>
              </div>
              <b>Doorways into culture</b>
            </div>
            <div className="atlas-routes">
              {atlasRoutes.map((route, index) => (
                <article key={route.place}>
                  <small>{String(index + 1).padStart(2, '0')}</small>
                  <div>
                    <span>{route.place}</span>
                    <strong>{route.keeper}</strong>
                    <p>{route.cue}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="map-copy">
            <p className="eyebrow">Why it matters</p>
            <h3>Each doorway keeps its own rule, voice, and place.</h3>
            <p>
              These bedtime stories do not flatten the old rituals into one
              fairy tale. Tanda helps children visit each tradition as its own
              little world, then come back with a story they can read together.
            </p>
            <div className="culture-strip" aria-label="Live story doorway preview">
              {culturePreview.map((tile) => (
                <span key={tile.id}>
                  <img src={tile.image} alt="" />
                  <small>{tile.label}</small>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="atlas-ledger-heading">
          <p className="eyebrow">Coming stories</p>
          <h3>More keepers are waiting on the next shelf.</h3>
          <p>
            These are the next simple story cards: a glimpse of the wider world
            without turning the Atlas into an inventory.
          </p>
        </div>

        <div className="atlas-ledger">
          {nextShelf.map((item) => (
            <Link
              key={item.slug}
              href={`/toothfairy/stories/${item.slug}`}
              className="ledger-row"
            >
              <span>{item.region}</span>
              <strong>{item.characterName}</strong>
              <small>{item.title}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="collector-section" aria-label="Meet the Collectors">
        <div className="collector-shell">
          <div className="collector-intro">
            <p className="eyebrow">Meet the Collectors</p>
            <h2>The Network is alive because they are.</h2>
            <p>
              Each collector carries a different doorway into the same hidden
              world. Follow the face, open the story, and let the tooth story
              begin.
            </p>
          </div>

          <div className="collector-faces">
            {collectors.map((collector) => (
              <Link
                key={collector.name}
                href={`/toothfairy/story/${collector.storyId}`}
                className={`collector-face${collector.lead ? ' collector-face-lead' : ''}`}
                style={styleVars({
                  '--accent': collector.accent,
                  '--focus': collector.focus,
                  '--zoom': collector.zoom,
                })}
              >
                <span className="face-image">
                  <img src={collector.image} alt="" />
                </span>
                <span className="face-label">
                  <strong>{collector.name}</strong>
                  <small>{collector.country}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .atlas-page {
          --paper: ${palette.paper};
          --cream: ${palette.cream};
          --parchment: ${palette.parchment};
          --ink: ${palette.ink};
          --ink-soft: ${palette.inkSoft};
          --muted: ${palette.muted};
          --forest: ${palette.forest};
          --forest-soft: ${palette.forestSoft};
          --gold: ${palette.gold};
          --gold-deep: ${palette.goldDeep};
          --rose: ${palette.rose};
          --teal: ${palette.teal};
          --border: ${palette.border};
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 84% 8%, rgba(216, 164, 60, 0.16), transparent 24rem),
            linear-gradient(90deg, rgba(17, 35, 74, 0.045) 1px, transparent 1px),
            linear-gradient(180deg, #fffaf1 0%, #fbf7ee 52%, #f1e5cd 100%);
          background-size: auto, 58px 58px, auto;
          color: var(--ink);
          font-family: var(--font-body), Segoe UI, system-ui, sans-serif;
        }

        .atlas-page * {
          box-sizing: border-box;
        }

        .atlas-page img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .atlas-hero,
        .story-shelf,
        .map-section,
        .collector-section {
          width: min(100% - 40px, 1200px);
          margin: 0 auto;
        }

        .atlas-hero {
          display: grid;
          gap: 3.5rem;
          align-items: center;
          min-height: min(780px, calc(100vh - 72px));
          padding: 72px 0 58px;
        }

        .eyebrow {
          margin: 0 0 0.82rem;
          color: var(--gold-deep);
          font-size: 0.74rem;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3 {
          margin: 0;
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          letter-spacing: 0;
        }

        h1 {
          max-width: 820px;
          font-size: clamp(3.05rem, 7vw, 6rem);
          line-height: 0.9;
        }

        h2 {
          max-width: 820px;
          font-size: clamp(2.2rem, 4.4vw, 4rem);
          line-height: 0.96;
        }

        h3 {
          font-size: clamp(1.45rem, 2.4vw, 2rem);
          line-height: 1.04;
        }

        p {
          color: var(--ink-soft);
          line-height: 1.6;
        }

        .hero-copy > p,
        .section-kicker > p:not(.eyebrow),
        .map-copy > p:not(.eyebrow),
        .atlas-ledger-heading > p,
        .collector-intro > p:not(.eyebrow) {
          max-width: 700px;
          margin: 1rem 0 0;
          font-size: 1.08rem;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.82rem;
          margin-top: 1.65rem;
        }

        .hero-actions a,
        .feature-copy b {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0 1.15rem;
          font-weight: 950;
          text-decoration: none;
        }

        .hero-actions a:first-child,
        .feature-copy b {
          background: linear-gradient(135deg, var(--gold), #efc56d);
          color: #2c2148;
          box-shadow: 0 18px 42px rgba(151, 102, 12, 0.18);
        }

        .hero-actions a:not(:first-child) {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.66);
          color: var(--ink);
        }

        .hero-gallery {
          position: relative;
          min-height: 570px;
        }

        .hero-gallery:before {
          position: absolute;
          inset: 9% 8% 7%;
          border-radius: 8px;
          background:
            radial-gradient(circle at 72% 16%, rgba(216, 164, 60, 0.22), transparent 18rem),
            linear-gradient(135deg, var(--forest), var(--forest-soft));
          box-shadow: 0 34px 80px rgba(18, 38, 31, 0.2);
          content: '';
        }

        figure {
          margin: 0;
        }

        .gallery-main,
        .gallery-tanda,
        .gallery-perez {
          position: absolute;
          overflow: hidden;
          border: 1px solid rgba(255, 250, 241, 0.42);
          border-radius: 8px;
          background: var(--paper);
          box-shadow: 0 24px 56px rgba(18, 38, 31, 0.2);
        }

        .gallery-main {
          inset: 2% 16% 12% 3%;
        }

        .gallery-tanda {
          right: 0;
          top: 14%;
          width: 42%;
          aspect-ratio: 3 / 4;
        }

        .gallery-perez {
          left: 5%;
          bottom: 0;
          width: 34%;
          aspect-ratio: 3 / 4;
        }

        .gallery-main:after,
        .gallery-tanda:after,
        .gallery-perez:after {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 48%, rgba(18, 38, 31, 0.42));
          content: '';
        }

        .atlas-board-top span {
          display: block;
          color: var(--forest);
          font-family: var(--font-display), Georgia, serif;
          font-size: 4.2rem;
          font-weight: 950;
          line-height: 0.85;
        }

        .story-shelf,
        .map-section,
        .collector-section {
          border-top: 1px solid var(--border);
          padding: 68px 0;
        }

        .section-kicker.centered {
          max-width: 790px;
          margin: 0 auto;
          text-align: center;
        }

        .section-kicker.centered h2,
        .section-kicker.centered p {
          margin-left: auto;
          margin-right: auto;
        }

        .featured-grid {
          display: grid;
          gap: 1rem;
          margin-top: 2rem;
        }

        .feature-card {
          display: grid;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.86);
          color: inherit;
          text-decoration: none;
          box-shadow: 0 20px 46px rgba(48, 38, 24, 0.08);
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
        }

        .feature-card:hover {
          border-color: color-mix(in srgb, var(--accent) 48%, var(--border));
          box-shadow: 0 30px 66px rgba(48, 38, 24, 0.13);
          transform: translateY(-4px);
        }

        .feature-image {
          position: relative;
          display: block;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          background: var(--parchment);
        }

        .feature-image:after {
          position: absolute;
          inset: auto 0 0;
          height: 44%;
          background: linear-gradient(180deg, transparent, rgba(18, 38, 31, 0.5));
          content: '';
        }

        .feature-copy {
          display: grid;
          gap: 0.62rem;
          padding: 1.05rem;
        }

        .feature-copy small,
        .ledger-row span,
        .collector-face small {
          color: var(--gold-deep);
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .feature-copy strong {
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.55rem, 2.6vw, 1.92rem);
          line-height: 0.98;
        }

        .feature-copy span {
          color: var(--ink-soft);
          line-height: 1.48;
        }

        .feature-copy b {
          justify-self: start;
          min-height: 40px;
          margin-top: 0.3rem;
          padding: 0 0.92rem;
          font-size: 0.84rem;
          font-style: normal;
        }

        .map-panel {
          display: grid;
          gap: 1.4rem;
          align-items: stretch;
          margin-top: 2.1rem;
          border: 1px solid rgba(255, 250, 241, 0.24);
          border-radius: 8px;
          background:
            radial-gradient(circle at 30% 42%, rgba(216, 164, 60, 0.18), transparent 18rem),
            linear-gradient(135deg, var(--forest), var(--forest-soft));
          color: var(--paper);
          padding: 1.2rem;
          box-shadow: 0 28px 80px rgba(18, 38, 31, 0.18);
        }

        .atlas-board {
          position: relative;
          display: grid;
          gap: 1.1rem;
          min-height: 470px;
          align-content: space-between;
          overflow: hidden;
          border: 1px solid rgba(255, 250, 241, 0.16);
          border-radius: 8px;
          background:
            linear-gradient(135deg, rgba(255, 250, 241, 0.1), transparent 32%),
            linear-gradient(180deg, rgba(255, 250, 241, 0.06), rgba(255, 250, 241, 0.02));
          padding: clamp(1rem, 2.3vw, 1.45rem);
        }

        .atlas-board:before {
          position: absolute;
          inset: -20% -8% auto auto;
          width: 62%;
          aspect-ratio: 1;
          border: 1px solid rgba(255, 250, 241, 0.12);
          border-radius: 999px;
          background: radial-gradient(circle, rgba(216, 164, 60, 0.2), transparent 64%);
          content: '';
        }

        .atlas-board-top,
        .atlas-routes {
          position: relative;
          z-index: 1;
        }

        .atlas-board-top {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          justify-content: space-between;
        }

        .atlas-board-top span {
          color: var(--paper);
          font-size: clamp(4.4rem, 8vw, 6.8rem);
        }

        .atlas-board-top p {
          max-width: 300px;
          margin: 0.7rem 0 0;
          color: rgba(255, 250, 241, 0.82);
          font-weight: 900;
          line-height: 1.32;
        }

        .atlas-board-top b {
          display: inline-flex;
          border: 1px solid rgba(255, 250, 241, 0.2);
          border-radius: 999px;
          background: rgba(255, 250, 241, 0.1);
          color: var(--paper);
          padding: 0.5rem 0.72rem;
          font-size: 0.72rem;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .atlas-routes {
          display: grid;
          gap: 0.62rem;
        }

        .atlas-routes article {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 0.78rem;
          border: 1px solid rgba(255, 250, 241, 0.14);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.08);
          padding: 0.78rem;
        }

        .atlas-routes small {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border-radius: 999px;
          background: rgba(216, 164, 60, 0.2);
          color: var(--paper);
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .atlas-routes span {
          display: block;
          color: rgba(255, 250, 241, 0.72);
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .atlas-routes strong {
          display: block;
          margin-top: 0.18rem;
          color: var(--paper);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.28rem;
          line-height: 1;
        }

        .atlas-routes p {
          margin: 0.32rem 0 0;
          color: rgba(255, 250, 241, 0.82);
          font-size: 0.92rem;
          line-height: 1.36;
        }

        .map-copy {
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.94);
          padding: clamp(1.15rem, 2.4vw, 1.8rem);
        }

        .map-copy h3,
        .map-copy p {
          color: var(--ink);
        }

        .culture-strip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.55rem;
          margin-top: 1.3rem;
        }

        .culture-strip span {
          position: relative;
          display: grid;
          aspect-ratio: 1;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--parchment);
        }

        .culture-strip span:after {
          position: absolute;
          inset: auto 0 0;
          height: 46%;
          background: linear-gradient(180deg, transparent, rgba(18, 38, 31, 0.72));
          content: '';
        }

        .culture-strip small {
          position: absolute;
          left: 0.48rem;
          right: 0.48rem;
          bottom: 0.45rem;
          z-index: 1;
          color: var(--paper);
          font-size: 0.58rem;
          font-weight: 950;
          letter-spacing: 0.11em;
          line-height: 1.05;
          text-transform: uppercase;
        }

        .atlas-ledger-heading {
          max-width: 760px;
          margin-top: 2.35rem;
        }

        .atlas-ledger {
          display: grid;
          gap: 0;
          margin-top: 1rem;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.78);
        }

        .ledger-row {
          display: grid;
          gap: 0.4rem;
          min-height: 94px;
          align-items: center;
          border-bottom: 1px solid var(--border);
          color: inherit;
          padding: 1rem;
          text-decoration: none;
          transition: background 180ms ease;
        }

        .ledger-row:last-child {
          border-bottom: 0;
        }

        .ledger-row:hover {
          background: rgba(216, 164, 60, 0.12);
        }

        .ledger-row strong {
          color: var(--ink);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.34rem;
          line-height: 1;
        }

        .ledger-row small {
          color: var(--ink-soft);
          font-size: 0.95rem;
          line-height: 1.36;
        }

        .collector-section {
          padding-bottom: 88px;
          width: min(100% - 40px, 1360px);
        }

        .collector-shell {
          position: relative;
          display: grid;
          gap: 2rem;
          overflow: hidden;
          border-radius: 8px;
          background:
            linear-gradient(90deg, rgba(8, 20, 32, 0.9) 0%, rgba(8, 20, 32, 0.66) 46%, rgba(8, 20, 32, 0.22) 100%),
            radial-gradient(circle at 76% 18%, rgba(216, 164, 60, 0.22), transparent 21rem),
            url('/story-assets/shared/shared-night-sky.jpg');
          background-position: center;
          background-size: cover;
          color: var(--paper);
          padding: clamp(1rem, 3vw, 2.3rem);
          box-shadow: 0 30px 82px rgba(18, 38, 31, 0.22);
        }

        .collector-shell:after {
          position: absolute;
          inset: 1rem;
          border: 1px solid rgba(255, 250, 241, 0.14);
          border-radius: 8px;
          pointer-events: none;
          content: '';
        }

        .collector-intro {
          position: relative;
          z-index: 1;
          max-width: 620px;
        }

        .collector-intro h2,
        .collector-intro p {
          color: var(--paper);
        }

        .collector-intro .eyebrow {
          color: #f2c86f;
        }

        .collector-faces {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.9rem;
        }

        .collector-face {
          position: relative;
          display: grid;
          min-height: 300px;
          overflow: hidden;
          border: 1px solid rgba(255, 250, 241, 0.22);
          border-radius: 8px;
          background: rgba(255, 250, 241, 0.1);
          color: var(--paper);
          isolation: isolate;
          text-decoration: none;
          transition: transform 220ms ease, border-color 220ms ease;
        }

        .collector-face:hover {
          border-color: color-mix(in srgb, var(--accent) 72%, rgba(255, 250, 241, 0.4));
          transform: translateY(-4px);
        }

        .collector-face-lead {
          min-height: 360px;
        }

        .face-image {
          position: absolute;
          inset: 0;
          z-index: -1;
          background: var(--forest);
        }

        .face-image img {
          object-position: var(--focus);
          transform: scale(var(--zoom));
          transform-origin: var(--focus);
        }

        .collector-face:after {
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(180deg, rgba(8, 20, 32, 0.08), rgba(8, 20, 32, 0.72)),
            linear-gradient(0deg, rgba(8, 20, 32, 0.5), transparent 54%);
          content: '';
        }

        .face-label {
          align-self: end;
          display: grid;
          gap: 0.2rem;
          padding: 1rem;
        }

        .face-label strong {
          color: var(--paper);
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.38rem, 2.5vw, 2.08rem);
          line-height: 0.98;
        }

        .face-label small {
          color: #f2c86f;
        }

        @media (min-width: 760px) {
          .atlas-hero {
            grid-template-columns: 0.92fr 1fr;
          }

          .featured-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .map-panel {
            grid-template-columns: minmax(0, 1fr) 0.72fr;
          }

          .atlas-ledger {
            grid-template-columns: repeat(5, minmax(0, 1fr));
          }

          .ledger-row {
            border-right: 1px solid var(--border);
            border-bottom: 0;
          }

          .ledger-row:last-child {
            border-right: 0;
          }

          .collector-faces {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .collector-face-lead:first-child,
          .collector-face:nth-child(4),
          .collector-face:nth-child(7) {
            grid-column: span 2;
          }
        }

        @media (min-width: 1040px) {
          .featured-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .collector-shell {
            grid-template-columns: 0.29fr 0.71fr;
            align-items: end;
          }
        }

        @media (max-width: 760px) {
          .atlas-hero,
          .story-shelf,
          .map-section,
          .collector-section {
            width: min(100% - 28px, 1200px);
          }

          .atlas-hero {
            min-height: auto;
            padding-top: 46px;
          }

          .hero-gallery {
            min-height: 430px;
          }

          .gallery-main {
            inset: 5% 5% 18% 0;
          }

          .gallery-tanda {
            right: 0;
            top: 8%;
            width: 42%;
          }

          .gallery-perez {
            left: 0;
            bottom: 0;
            width: 42%;
          }

          .atlas-board-top {
            display: grid;
          }

          .atlas-board-top b {
            justify-self: start;
          }

          .culture-strip {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          h1 {
            font-size: clamp(2.7rem, 17vw, 4rem);
          }

          h2 {
            font-size: clamp(2rem, 12vw, 3rem);
          }

          .hero-actions a {
            width: 100%;
          }

          .collector-faces {
            grid-template-columns: 1fr;
          }

          .collector-face,
          .collector-face-lead {
            min-height: 300px;
          }
        }
          `,
        }}
      />
    </main>
  )
}
