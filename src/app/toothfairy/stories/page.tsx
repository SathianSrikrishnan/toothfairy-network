import type { CSSProperties } from 'react'
import Link from 'next/link'
import {
  contributionDoor,
  futureKeeperDoors,
  openKeeperDoors,
  type NetworkDoor,
} from '@/data/toothfairy'

type DoorPoint = {
  x: number
  y: number
  scale: number
}

type KeeperPortrait = {
  name: string
  region: string
  image: string
  href: string
  accent: string
  focus: string
}

const openDoorPoints: DoorPoint[] = [
  { x: 22, y: 72, scale: 1.05 },
  { x: 33, y: 68, scale: 0.98 },
  { x: 45, y: 73, scale: 1.1 },
  { x: 56, y: 67, scale: 0.98 },
  { x: 68, y: 72, scale: 1.05 },
  { x: 40, y: 84, scale: 0.96 },
  { x: 60, y: 84, scale: 0.96 },
]

const futureDoorPoints: DoorPoint[] = [
  { x: 17, y: 54, scale: 0.7 },
  { x: 82, y: 54, scale: 0.7 },
  { x: 29, y: 42, scale: 0.62 },
  { x: 70, y: 41, scale: 0.62 },
  { x: 49, y: 34, scale: 0.56 },
  { x: 14, y: 64, scale: 0.6 },
  { x: 86, y: 65, scale: 0.6 },
  { x: 38, y: 29, scale: 0.52 },
  { x: 62, y: 29, scale: 0.52 },
]

const keeperPortraits: KeeperPortrait[] = [
  {
    name: 'Tanda',
    region: 'Network origin',
    image: '/story-assets/tanda/tf-05-tanda.png',
    href: '/toothfairy/story/tanda',
    accent: '#f0c456',
    focus: '50% 34%',
  },
  {
    name: "Tanda's father",
    region: 'First Tooth Fee',
    image: '/story-assets/viking-origin/v2/s2-frame-03-maker.png',
    href: '/toothfairy/story/viking-origin',
    accent: '#2f8b78',
    focus: '40% 28%',
  },
  {
    name: 'Ratoncito Perez',
    region: 'Spain',
    image: '/story-assets/ratoncito-perez/rp-02-mouse.png',
    href: '/toothfairy/story/ratoncito-perez',
    accent: '#b95a51',
    focus: '48% 62%',
  },
  {
    name: 'Kkachi',
    region: 'South Korea',
    image: '/story-assets/characters/char-kkachi.png',
    href: '/toothfairy/story/korea',
    accent: '#267f90',
    focus: '50% 38%',
  },
  {
    name: 'Waraba',
    region: 'Ethiopia / Harar',
    image: '/story-assets/characters/char-waraba.png',
    href: '/toothfairy/story/waraba-edge-light',
    accent: '#a7652e',
    focus: '50% 30%',
  },
  {
    name: 'Daga',
    region: 'Philippines',
    image: '/story-assets/characters/char-daga.png',
    href: '/toothfairy/story/daga-one-year-wish',
    accent: '#7b6cb5',
    focus: '58% 38%',
  },
  {
    name: 'Anna Bogle',
    region: 'Ireland',
    image: '/story-assets/characters/char-anna-bogle-v2.png',
    href: '/toothfairy/story/anna-bogle',
    accent: '#438861',
    focus: '50% 22%',
  },
]

const doorStyle = (
  door: Pick<NetworkDoor, 'accent'>,
  point: DoorPoint,
  index: number,
) =>
  ({
    '--door-accent': door.accent,
    '--door-x': `${point.x}%`,
    '--door-y': `${point.y}%`,
    '--door-scale': point.scale,
    '--door-index': index,
  }) as CSSProperties

const accentStyle = (accent: string, extra?: Record<string, string>) =>
  ({
    '--accent': accent,
    ...extra,
  }) as CSSProperties

export const metadata = {
  title: 'Story World | Tooth Fairy Network',
  description:
    'Open the Tooth Fairy Network story world and see the next lost-tooth traditions beginning to glow.',
}

export default function StoriesPage() {
  return (
    <main className="story-world-page">
      <section className="world-hero" aria-label="Tooth Fairy Network story world">
        <img
          className="world-backdrop"
          src="/story-assets/network/story-world-gateway-v1.png"
          alt="Tanda looking across a vast glowing network of tooth story doors"
        />
        <span className="world-shade" aria-hidden />
        <svg className="world-thread-map" viewBox="0 0 1200 720" preserveAspectRatio="none" aria-hidden>
          <path d="M196 420 C 318 332, 442 382, 536 438 S 704 494, 868 384" />
          <path d="M278 538 C 414 466, 534 558, 634 478 S 796 374, 1012 420" />
          <path d="M338 282 C 444 218, 560 244, 628 306 S 792 326, 948 236" />
          <path d="M154 490 C 302 610, 476 632, 630 570 S 882 556, 1064 462" />
          <path className="world-value-pulse" d="M1014 650 C 850 594, 748 548, 616 488 S 388 424, 218 318" />
          <circle cx="218" cy="318" r="5" />
          <circle cx="536" cy="438" r="6" />
          <circle cx="868" cy="384" r="5" />
          <circle cx="616" cy="488" r="5.5" />
          <circle cx="1014" cy="650" r="5" />
        </svg>

        <div className="future-door-layer" aria-label="Future story doors">
          {futureKeeperDoors.slice(0, futureDoorPoints.length).map((door, index) => (
            <span
              key={door.id}
              className="future-door"
              style={doorStyle(door, futureDoorPoints[index], index)}
              title={`${door.region}: ${door.title}`}
            />
          ))}
        </div>

        <div className="open-door-layer" aria-label="Open story doors">
          {openKeeperDoors.map((door, index) => {
            const point = openDoorPoints[index] ?? openDoorPoints[0]

            return (
              <Link
                key={door.id}
                href={door.href ?? '/toothfairy/stories'}
                className={`story-door story-door-${index}`}
                style={doorStyle(door, point, index)}
                aria-label={`Open ${door.title}`}
              >
                <span className="story-door-glow" />
                <span className="story-door-charm" />
                <span className="story-door-number">{index + 1}</span>
                <span className="story-door-peek">
                  <img src={door.image} alt="" />
                </span>
                <span className="story-door-tooltip">
                  <small>{door.region}</small>
                  <strong>{door.title}</strong>
                  <em>{door.objectName}</em>
                </span>
              </Link>
            )
          })}
        </div>

        <Link
          href={contributionDoor.href ?? '/toothfairy/stories'}
          className="contribution-door"
          style={doorStyle(contributionDoor, { x: 50, y: 91, scale: 1 }, 12)}
        >
          <span />
          <strong>{contributionDoor.title}</strong>
        </Link>

        <div className="world-copy">
          <p>The Network</p>
          <h1>Join Tanda and the Keepers.</h1>
          <span>
            They follow lost-tooth traditions around the world, opening each one as a living memory for children.
          </span>
        </div>
      </section>

      <section id="open-stories" className="open-stories" aria-label="Open Tooth Fairy stories">
        <div className="section-heading">
          <p>Open traditions</p>
          <h2>Start with Tanda, then follow each local promise.</h2>
        </div>

        <div className="story-grid">
          {openKeeperDoors.map((door, index) => {
            return (
              <Link
                key={door.id}
                href={door.href ?? '/toothfairy/stories'}
                className="story-card"
                style={accentStyle(door.accent)}
              >
                <span className={`card-door card-door-${index}`}>
                  <span className="card-door-charm" />
                  <img src={door.image} alt="" />
                </span>
                <span className="card-copy">
                  <small>{door.region}</small>
                  <strong>{door.title}</strong>
                  <span>{door.readerHook}</span>
                  <b>Open story</b>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="keeper-band" aria-label="Story keepers">
        <div className="section-heading compact">
          <p>Keepers</p>
          <h2>Keepers of tooth traditions around the world.</h2>
        </div>
        <div className="keeper-strip">
          {keeperPortraits.map((keeper) => (
            <Link
              key={keeper.name}
              href={keeper.href}
              className="keeper-token"
              style={accentStyle(keeper.accent, { '--focus': keeper.focus })}
            >
              <span>
                <img src={keeper.image} alt="" />
              </span>
              <strong>{keeper.name}</strong>
              <small>{keeper.region}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="next-doors" aria-label="Future Tooth Fairy Network stories">
        <div className="section-heading">
          <p>Wider world</p>
          <h2>A glimpse of the traditions still waiting.</h2>
        </div>
        <div className="next-door-grid">
          {futureKeeperDoors.slice(0, 9).map((door, index) => (
            <article
              key={door.id}
              className="next-door"
              style={doorStyle(door, futureDoorPoints[index] ?? futureDoorPoints[0], index)}
            >
              <span className="next-door-mark" />
              <small>{door.region}</small>
              <strong>{door.title}</strong>
              <p>{door.readerHook}</p>
            </article>
          ))}
        </div>
      </section>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .story-world-page {
          --night: #06101f;
          --night-2: #0b1a31;
          --paper: #fffaf1;
          --paper-soft: rgba(255, 250, 241, 0.74);
          --gold: #ffd76a;
          --teal: #28b99a;
          --coral: #f06f73;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 18% 8%, rgba(255, 215, 106, 0.16), transparent 26rem),
            radial-gradient(circle at 88% 32%, rgba(40, 185, 154, 0.14), transparent 28rem),
            linear-gradient(180deg, #06101f 0%, #0b1a31 52%, #10180f 100%);
          color: var(--paper);
          font-family: var(--font-body), Segoe UI, system-ui, sans-serif;
        }

        .story-world-page * {
          box-sizing: border-box;
        }

        .story-world-page img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .world-hero {
          position: relative;
          min-height: min(820px, calc(100vh - 72px));
          isolation: isolate;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 250, 241, 0.12);
        }

        .world-backdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
          object-position: center 48%;
          transform: scale(1.015);
        }

        .world-shade {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(circle at 50% 34%, transparent 0 26%, rgba(4, 9, 20, 0.12) 42%, rgba(4, 9, 20, 0.52) 100%),
            linear-gradient(90deg, rgba(4, 9, 20, 0.82), rgba(4, 9, 20, 0.16) 34%, rgba(4, 9, 20, 0.08) 64%, rgba(4, 9, 20, 0.7)),
            linear-gradient(180deg, rgba(4, 9, 20, 0.04), rgba(4, 9, 20, 0.36) 66%, #06101f 100%);
          pointer-events: none;
        }

        .world-thread-map {
          position: absolute;
          inset: 8% 4% 12%;
          z-index: 2;
          width: 92%;
          height: 80%;
          overflow: visible;
          opacity: 0.28;
          pointer-events: none;
          filter: drop-shadow(0 0 18px rgba(255, 215, 106, 0.42));
          transition: opacity 180ms ease, filter 180ms ease;
        }

        .world-thread-map path {
          fill: none;
          stroke: rgba(255, 221, 124, 0.52);
          stroke-dasharray: 8 18;
          stroke-linecap: round;
          stroke-width: 2.3;
          animation: threadFlow 9s linear infinite;
          animation-play-state: paused;
        }

        .world-thread-map path:nth-child(2) {
          stroke: rgba(107, 203, 214, 0.44);
          animation-duration: 11s;
        }

        .world-thread-map path:nth-child(3) {
          stroke: rgba(240, 111, 115, 0.34);
          animation-duration: 12s;
        }

        .world-thread-map path:nth-child(4) {
          stroke: rgba(97, 194, 130, 0.34);
          animation-duration: 14s;
        }

        .world-value-pulse {
          stroke: rgba(255, 246, 191, 0.82) !important;
          stroke-dasharray: 1 34 !important;
          stroke-width: 5 !important;
          opacity: 0;
          filter:
            drop-shadow(0 0 10px rgba(255, 215, 106, 0.74))
            drop-shadow(0 0 24px rgba(40, 185, 154, 0.3));
          animation: valuePulse 11.5s cubic-bezier(.34, .02, .22, 1) infinite !important;
          animation-play-state: paused !important;
        }

        .world-thread-map circle {
          fill: rgba(255, 246, 191, 0.92);
          stroke: rgba(255, 215, 106, 0.72);
          stroke-width: 2;
          transform-box: fill-box;
          transform-origin: center;
          filter: drop-shadow(0 0 12px rgba(255, 215, 106, 0.62));
          animation: nodePulse 7s ease-in-out infinite;
          animation-play-state: paused;
        }

        .world-hero:has(.story-door:hover) .world-thread-map,
        .world-hero:has(.story-door:focus-visible) .world-thread-map {
          opacity: 0.76;
          filter: drop-shadow(0 0 22px rgba(255, 215, 106, 0.52));
        }

        .world-hero:has(.story-door:hover) .world-thread-map path,
        .world-hero:has(.story-door:focus-visible) .world-thread-map path,
        .world-hero:has(.story-door:hover) .world-thread-map circle,
        .world-hero:has(.story-door:focus-visible) .world-thread-map circle,
        .world-hero:has(.story-door:hover) .world-value-pulse,
        .world-hero:has(.story-door:focus-visible) .world-value-pulse {
          animation-play-state: running !important;
        }

        .future-door-layer,
        .open-door-layer {
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
        }

        .story-door,
        .future-door,
        .contribution-door {
          position: absolute;
          left: var(--door-x);
          top: var(--door-y);
          transform: translate(-50%, -50%) scale(var(--door-scale));
        }

        .story-door {
          z-index: 6;
          display: block;
          width: clamp(5.1rem, 8.2vw, 7.8rem);
          aspect-ratio: 0.72 / 1;
          color: var(--paper);
          isolation: isolate;
          pointer-events: auto;
          text-decoration: none;
          transition: transform 180ms ease, filter 180ms ease;
        }

        .story-door::before {
          position: absolute;
          inset: 0;
          z-index: 0;
          border: 1px solid color-mix(in srgb, var(--door-accent) 74%, rgba(255, 250, 241, 0.24));
          border-radius: 999px 999px 8px 8px;
          background:
            radial-gradient(circle at 50% 20%, color-mix(in srgb, var(--door-accent) 38%, transparent), transparent 44%),
            linear-gradient(180deg, rgba(255, 250, 241, 0.1), rgba(4, 9, 20, 0.72)),
            rgba(5, 10, 22, 0.54);
          box-shadow:
            0 0 0 1px rgba(255, 250, 241, 0.08),
            0 0 26px color-mix(in srgb, var(--door-accent) 42%, transparent),
            0 18px 32px rgba(0, 0, 0, 0.26);
          content: "";
        }

        .story-door::after {
          position: absolute;
          inset: -9%;
          z-index: -1;
          border: 1px solid color-mix(in srgb, var(--door-accent) 44%, transparent);
          border-radius: inherit;
          box-shadow: 0 0 24px color-mix(in srgb, var(--door-accent) 36%, transparent);
          content: "";
          opacity: 0.4;
          transform: scale(0.96);
          animation: doorBreath 7s ease-in-out infinite;
          animation-delay: calc(var(--door-index) * -0.62s);
        }

        .story-door-1::before {
          border-radius: 26px 26px 8px 8px;
          clip-path: polygon(50% 0, 94% 14%, 100% 100%, 0 100%, 6% 14%);
        }

        .story-door-2::before {
          border-radius: 54% 54% 12px 12px / 46% 46% 12px 12px;
        }

        .story-door-3::before {
          border-radius: 12px 12px 8px 8px;
          clip-path: polygon(50% 0, 96% 24%, 94% 100%, 6% 100%, 4% 24%);
        }

        .story-door-4::before {
          border-radius: 48% 54% 12px 10px / 34% 45% 12px 10px;
        }

        .story-door-5::before {
          border-radius: 46% 46% 10px 10px;
          background:
            radial-gradient(circle at 72% 22%, rgba(255, 250, 241, 0.22), transparent 24%),
            radial-gradient(circle at 50% 20%, color-mix(in srgb, var(--door-accent) 38%, transparent), transparent 44%),
            linear-gradient(180deg, rgba(255, 250, 241, 0.1), rgba(4, 9, 20, 0.72));
        }

        .story-door-6::before {
          border-radius: 999px 999px 22px 22px;
          background:
            repeating-radial-gradient(circle at 50% 28%, color-mix(in srgb, var(--door-accent) 20%, transparent) 0 3px, transparent 3px 9px),
            linear-gradient(180deg, rgba(255, 250, 241, 0.1), rgba(4, 9, 20, 0.72));
        }

        .story-door:hover,
        .story-door:focus-visible {
          filter: drop-shadow(0 0 28px color-mix(in srgb, var(--door-accent) 55%, transparent));
          transform: translate(-50%, -56%) scale(calc(var(--door-scale) * 1.08));
        }

        .story-door-glow {
          position: absolute;
          inset: 14%;
          z-index: 1;
          border-radius: inherit;
          background: radial-gradient(circle at 50% 36%, color-mix(in srgb, var(--door-accent) 42%, transparent), transparent 68%);
          filter: blur(7px);
          opacity: 0.74;
          pointer-events: none;
        }

        .story-door-number {
          position: absolute;
          left: 50%;
          top: 17%;
          z-index: 4;
          display: grid;
          width: 1.55rem;
          height: 1.55rem;
          place-items: center;
          border: 1px solid rgba(255, 250, 241, 0.44);
          border-radius: 50%;
          background: rgba(5, 10, 22, 0.78);
          color: #fff7c4;
          font-size: 0.72rem;
          font-weight: 950;
          transform: translateX(-50%);
        }

        .story-door-peek {
          position: absolute;
          left: 50%;
          bottom: 14%;
          z-index: 3;
          width: 56%;
          aspect-ratio: 1;
          overflow: hidden;
          border: 1px solid rgba(255, 250, 241, 0.22);
          border-radius: 50%;
          background: rgba(255, 250, 241, 0.08);
          box-shadow: 0 0 18px color-mix(in srgb, var(--door-accent) 28%, transparent);
          transform: translateX(-50%);
        }

        .story-door-charm,
        .card-door-charm {
          position: absolute;
          z-index: 5;
          left: 50%;
          top: 42%;
          display: block;
          width: 1.36rem;
          height: 1.36rem;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .story-door-charm::before,
        .story-door-charm::after,
        .card-door-charm::before,
        .card-door-charm::after {
          position: absolute;
          content: "";
        }

        .story-door-0 .story-door-charm::before,
        .card-door-0 .card-door-charm::before {
          inset: 7% 22% 6%;
          border: 2px solid color-mix(in srgb, var(--door-accent) 74%, #fffaf1);
          border-radius: 52% 52% 46% 46%;
          box-shadow: 0 0 12px color-mix(in srgb, var(--door-accent) 60%, transparent);
        }

        .story-door-1 .story-door-charm::before,
        .card-door-1 .card-door-charm::before {
          left: 0;
          right: 0;
          top: 50%;
          height: 2px;
          background: color-mix(in srgb, var(--door-accent) 76%, #fffaf1);
          box-shadow: 0 -5px 0 rgba(255, 250, 241, 0.28), 0 5px 0 rgba(255, 250, 241, 0.28);
        }

        .story-door-2 .story-door-charm::before,
        .card-door-2 .card-door-charm::before {
          inset: 12%;
          border: 2px solid color-mix(in srgb, var(--door-accent) 72%, #fffaf1);
          border-radius: 50%;
          background: rgba(255, 250, 241, 0.12);
        }

        .story-door-3 .story-door-charm::before,
        .card-door-3 .card-door-charm::before {
          left: 47%;
          top: 0;
          width: 2px;
          height: 100%;
          border-radius: 999px;
          background: color-mix(in srgb, var(--door-accent) 70%, #fffaf1);
          transform: rotate(28deg);
          box-shadow: 6px 2px 0 -1px rgba(255, 250, 241, 0.34);
        }

        .story-door-4 .story-door-charm::before,
        .card-door-4 .card-door-charm::before {
          inset: 18% 4%;
          border-radius: 42% 58% 48% 52%;
          background: color-mix(in srgb, var(--door-accent) 64%, #fffaf1);
          box-shadow: inset 0 0 0 2px rgba(4, 9, 20, 0.32);
        }

        .story-door-5 .story-door-charm::before,
        .card-door-5 .card-door-charm::before {
          inset: 4%;
          border-radius: 50%;
          background: color-mix(in srgb, var(--door-accent) 58%, #fffaf1);
        }

        .story-door-5 .story-door-charm::after,
        .card-door-5 .card-door-charm::after {
          inset: -2% 12% 8% 28%;
          border-radius: 50%;
          background: #06101f;
        }

        .story-door-6 .story-door-charm::before,
        .card-door-6 .card-door-charm::before {
          inset: 9%;
          border: 2px solid color-mix(in srgb, var(--door-accent) 74%, #fffaf1);
          border-radius: 50%;
          box-shadow: inset 0 0 0 3px rgba(255, 250, 241, 0.18);
        }

        .story-door-tooltip {
          position: absolute;
          left: 50%;
          bottom: calc(100% + 0.55rem);
          z-index: 20;
          display: grid;
          width: min(13.5rem, 42vw);
          gap: 0.18rem;
          border: 1px solid color-mix(in srgb, var(--door-accent) 44%, rgba(255, 250, 241, 0.12));
          border-radius: 8px;
          background: rgba(4, 9, 20, 0.86);
          box-shadow: 0 18px 34px rgba(0, 0, 0, 0.32);
          padding: 0.64rem 0.7rem;
          opacity: 0;
          pointer-events: none;
          transform: translate(-50%, 0.24rem);
          transition: opacity 160ms ease, transform 160ms ease;
        }

        .story-door:hover .story-door-tooltip,
        .story-door:focus-visible .story-door-tooltip {
          opacity: 1;
          transform: translate(-50%, 0);
        }

        .story-door-tooltip small {
          color: var(--door-accent);
          font-size: 0.62rem;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .story-door-tooltip strong {
          color: var(--paper);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.08rem;
          line-height: 1;
        }

        .story-door-tooltip em {
          color: var(--paper-soft);
          font-size: 0.74rem;
          font-style: normal;
          line-height: 1.25;
        }

        .future-door {
          z-index: 4;
          display: block;
          width: clamp(2rem, 4.2vw, 3.6rem);
          aspect-ratio: 0.74 / 1;
          border: 1px solid color-mix(in srgb, var(--door-accent) 38%, rgba(255, 250, 241, 0.12));
          border-radius: 999px 999px 5px 5px;
          background:
            radial-gradient(circle at 50% 28%, color-mix(in srgb, var(--door-accent) 30%, transparent), transparent 56%),
            rgba(4, 9, 20, 0.48);
          box-shadow: 0 0 18px color-mix(in srgb, var(--door-accent) 22%, transparent);
          opacity: 0.78;
          pointer-events: auto;
          animation: futureListen 9s ease-in-out infinite;
          animation-delay: calc(var(--door-index) * -0.8s);
        }

        .contribution-door {
          z-index: 7;
          display: grid;
          width: clamp(7.3rem, 11vw, 9.4rem);
          min-height: 5.2rem;
          place-items: center;
          border: 1px solid rgba(255, 215, 106, 0.5);
          border-radius: 999px 999px 9px 9px;
          background:
            repeating-linear-gradient(135deg, rgba(255, 215, 106, 0.12) 0 1px, transparent 1px 12px),
            rgba(4, 9, 20, 0.68);
          color: var(--paper);
          gap: 0.2rem;
          padding: 0.68rem;
          pointer-events: auto;
          text-align: center;
          text-decoration: none;
          box-shadow:
            0 0 0 1px rgba(255, 250, 241, 0.08),
            0 0 26px rgba(255, 215, 106, 0.24);
        }

        .contribution-door span {
          display: grid;
          width: 1.55rem;
          height: 1.55rem;
          place-items: center;
          border: 1px solid rgba(255, 250, 241, 0.38);
          border-radius: 50%;
        }

        .contribution-door span::before {
          color: var(--gold);
          content: "?";
          font-weight: 950;
        }

        .contribution-door strong {
          color: var(--paper);
          font-size: 0.77rem;
          line-height: 1.1;
        }

        .world-copy {
          position: absolute;
          left: clamp(1.25rem, 5vw, 4.5rem);
          top: clamp(5rem, 12vh, 8rem);
          z-index: 10;
          display: grid;
          width: min(31rem, calc(100% - 2.5rem));
          gap: 0.8rem;
        }

        .world-copy p,
        .section-heading p {
          margin: 0;
          color: var(--gold);
          font-size: 0.74rem;
          font-weight: 950;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .world-copy h1,
        .section-heading h2 {
          margin: 0;
          color: var(--paper);
          font-family: var(--font-display), Georgia, serif;
          font-weight: 850;
          letter-spacing: 0;
          line-height: 0.98;
          text-wrap: balance;
        }

        .world-copy h1 {
          font-size: clamp(3rem, 7vw, 5.8rem);
        }

        .world-copy > span {
          max-width: 29rem;
          color: rgba(255, 250, 241, 0.8);
          font-size: clamp(1rem, 1.7vw, 1.15rem);
          line-height: 1.55;
        }

        .open-stories,
        .keeper-band,
        .next-doors {
          width: min(100% - 2.5rem, 1180px);
          margin: 0 auto;
          padding: clamp(3.5rem, 7vw, 5.6rem) 0;
        }

        .section-heading {
          display: grid;
          max-width: 46rem;
          gap: 0.72rem;
          margin-bottom: 1.4rem;
        }

        .section-heading.compact {
          max-width: 62rem;
        }

        .section-heading h2 {
          font-size: clamp(2rem, 4vw, 3.2rem);
        }

        .story-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 0.78rem;
        }

        .story-card {
          display: grid;
          min-height: 24rem;
          grid-template-rows: minmax(9rem, 1fr) auto;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--accent) 42%, rgba(255, 250, 241, 0.12));
          border-radius: 8px;
          background:
            linear-gradient(160deg, color-mix(in srgb, var(--accent) 15%, transparent), transparent 54%),
            rgba(255, 250, 241, 0.065);
          color: var(--paper);
          text-decoration: none;
          box-shadow: 0 22px 48px rgba(0, 0, 0, 0.2);
          transition: border-color 180ms ease, transform 180ms ease, background 180ms ease;
        }

        .story-card:hover,
        .story-card:focus-visible {
          border-color: color-mix(in srgb, var(--accent) 78%, #fffaf1);
          background:
            linear-gradient(160deg, color-mix(in srgb, var(--accent) 24%, transparent), transparent 58%),
            rgba(255, 250, 241, 0.09);
          transform: translateY(-4px);
        }

        .card-door {
          position: relative;
          display: grid;
          min-height: 11rem;
          place-items: center;
          overflow: hidden;
          background: #06101f;
        }

        .card-door::before {
          position: absolute;
          inset: 0;
          z-index: 2;
          background:
            linear-gradient(180deg, transparent 42%, rgba(4, 9, 20, 0.72)),
            radial-gradient(circle at 50% 34%, transparent 0 26%, rgba(4, 9, 20, 0.24) 58%, rgba(4, 9, 20, 0.66));
          content: "";
        }

        .card-door img {
          position: absolute;
          inset: 0;
          z-index: 1;
          object-position: center;
          transform: scale(1.04);
        }

        .card-door-charm {
          top: 50%;
          z-index: 3;
          width: 2rem;
          height: 2rem;
          filter: drop-shadow(0 0 16px color-mix(in srgb, var(--accent) 72%, transparent));
        }

        .card-copy {
          display: grid;
          gap: 0.4rem;
          padding: 0.92rem 0.88rem 1rem;
        }

        .card-copy small {
          color: var(--accent);
          font-size: 0.64rem;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .card-copy strong {
          color: var(--paper);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.28rem;
          line-height: 1.02;
        }

        .card-copy em {
          color: rgba(255, 250, 241, 0.58);
          font-size: 0.8rem;
          font-style: normal;
          line-height: 1.2;
        }

        .card-copy span {
          color: rgba(255, 250, 241, 0.76);
          font-size: 0.88rem;
          line-height: 1.36;
        }

        .card-copy b {
          width: fit-content;
          margin-top: 0.24rem;
          border-bottom: 1px solid var(--accent);
          color: var(--paper);
          font-size: 0.78rem;
          font-weight: 950;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .keeper-band {
          border-top: 1px solid rgba(255, 250, 241, 0.12);
          border-bottom: 1px solid rgba(255, 250, 241, 0.12);
        }

        .keeper-strip {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 0.75rem;
        }

        .keeper-token {
          display: grid;
          gap: 0.44rem;
          align-content: start;
          color: var(--paper);
          text-align: center;
          text-decoration: none;
        }

        .keeper-token span {
          position: relative;
          display: block;
          aspect-ratio: 1;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--accent) 46%, rgba(255, 250, 241, 0.16));
          border-radius: 50%;
          background:
            radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%),
            rgba(255, 250, 241, 0.06);
          box-shadow: 0 0 22px color-mix(in srgb, var(--accent) 20%, transparent);
        }

        .keeper-token img {
          object-position: var(--focus);
          transform: scale(1.04);
        }

        .keeper-token strong {
          color: var(--paper);
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1rem, 1.6vw, 1.25rem);
          line-height: 1;
        }

        .keeper-token small {
          color: rgba(255, 250, 241, 0.62);
          font-size: 0.76rem;
          line-height: 1.15;
        }

        .next-door-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.78rem;
        }

        .next-door {
          position: relative;
          min-height: 10rem;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--door-accent) 34%, rgba(255, 250, 241, 0.1));
          border-radius: 8px;
          background:
            radial-gradient(circle at 88% 8%, color-mix(in srgb, var(--door-accent) 24%, transparent), transparent 40%),
            rgba(255, 250, 241, 0.045);
          padding: 1rem 1rem 1.05rem;
          box-shadow: 0 18px 38px rgba(0, 0, 0, 0.16);
        }

        .next-door-mark {
          position: absolute;
          right: 0.9rem;
          top: 0.9rem;
          width: 2.2rem;
          aspect-ratio: 0.74 / 1;
          border: 1px solid color-mix(in srgb, var(--door-accent) 48%, rgba(255, 250, 241, 0.16));
          border-radius: 999px 999px 5px 5px;
          background:
            radial-gradient(circle at 50% 28%, color-mix(in srgb, var(--door-accent) 30%, transparent), transparent 56%),
            rgba(4, 9, 20, 0.5);
          box-shadow: 0 0 18px color-mix(in srgb, var(--door-accent) 22%, transparent);
        }

        .next-door small {
          display: block;
          margin-right: 3rem;
          color: var(--door-accent);
          font-size: 0.64rem;
          font-weight: 950;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .next-door strong {
          display: block;
          max-width: 18rem;
          margin-top: 0.46rem;
          color: var(--paper);
          font-family: var(--font-display), Georgia, serif;
          font-size: 1.35rem;
          line-height: 1.05;
        }

        .next-door p {
          max-width: 25rem;
          margin: 0.6rem 0 0;
          color: rgba(255, 250, 241, 0.68);
          font-size: 0.9rem;
          line-height: 1.42;
        }

        @keyframes threadFlow {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -52; }
        }

        @keyframes valuePulse {
          0%, 54% { opacity: 0; stroke-dashoffset: 70; }
          60%, 75% { opacity: 1; }
          88%, 100% { opacity: 0; stroke-dashoffset: -190; }
        }

        @keyframes nodePulse {
          0%, 100% { opacity: .58; transform: scale(.84); }
          44%, 58% { opacity: 1; transform: scale(1.22); }
        }

        @keyframes doorBreath {
          0%, 100% { opacity: .28; transform: scale(.96); }
          50% { opacity: .68; transform: scale(1.06); }
        }

        @keyframes futureListen {
          0%, 100% { opacity: .48; transform: translate(-50%, -50%) scale(var(--door-scale)); }
          50% { opacity: .9; transform: translate(-50%, -52%) scale(calc(var(--door-scale) * 1.08)); }
        }

        @media (max-width: 1080px) {
          .story-grid,
          .keeper-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .story-grid {
            gap: 0.9rem;
          }

          .story-card {
            min-height: 22rem;
          }

          .next-door-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .world-hero {
            min-height: 740px;
          }

          .world-backdrop {
            object-position: 54% 50%;
          }

          .world-copy {
            top: 4.25rem;
          }

          .world-copy h1 {
            font-size: clamp(2.55rem, 14vw, 4.2rem);
          }

          .world-copy > span {
            max-width: 23rem;
          }

          .world-thread-map {
            inset: 20% -12% 7%;
            width: 124%;
            height: 73%;
          }

          .story-door {
            width: clamp(4rem, 14vw, 5.4rem);
          }

          .story-door-tooltip {
            display: none;
          }

          .future-door {
            width: clamp(1.7rem, 7vw, 2.4rem);
          }

          .contribution-door {
            top: 91% !important;
            width: 7.1rem;
          }

          .story-grid,
          .keeper-strip,
          .next-door-grid {
            grid-template-columns: 1fr;
          }

          .keeper-token {
            grid-template-columns: 4.8rem minmax(0, 1fr);
            align-items: center;
            text-align: left;
          }

          .keeper-token small {
            grid-column: 2;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .story-world-page *,
          .story-world-page *::before,
          .story-world-page *::after {
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 1ms !important;
          }
        }
      `,
        }}
      />
    </main>
  )
}
