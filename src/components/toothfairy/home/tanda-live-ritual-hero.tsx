"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { contributionDoor, futureKeeperDoors, openKeeperDoors } from "@/data/toothfairy";
import styles from "./tanda-live-ritual-hero.module.css";

const liveAssetRoot = "/toothfairy/animation/live-hero-v1";
const liveAssetVersion = "asset-fix-2";
const keepsakePreview = "https://gateway.irys.xyz/Z9_aFKhX6xpU1cZvw0h4u3zfJwhfJ1wiBf72KQWGF5k";
const keepsakePreviewFallback = "/toothfairy/visual-system/nft-keepsake-v1.png";

const steps = [
  {
    eyebrow: "01",
    title: "Draw",
    body: "Make the tooth moment theirs.",
    accent: "gold",
    image: "/toothfairy/visual-system/save-moment-v1.png",
    alt: "A tooth, camera, and child drawing arranged as a keepsake activity",
    fit: "cover",
    position: "center",
  },
  {
    eyebrow: "02",
    title: "Light",
    body: "Turn it into a Toothlight.",
    accent: "coral",
    image: "/toothfairy/visual-system/tanda-guide-v1.png",
    alt: "Tanda guiding a magical Toothlight moment",
    fit: "contain",
    position: "center",
  },
  {
    eyebrow: "03",
    title: "Save",
    body: "Keep the wallet parent-controlled.",
    accent: "teal",
    image: "/toothfairy/visual-system/watch-grow-v1.png",
    alt: "A gentle savings chart growing from tooth tokens",
    fit: "cover",
    position: "center",
  },
] as const;

const poses = [
  ["entryUp", "tanda-entry-up.webp"],
  ["entryDown", "tanda-entry-down.webp"],
  ["reach", "tanda-reach.webp"],
  ["grab", "tanda-grab.webp"],
  ["lift", "tanda-lift-tooth.webp"],
  ["phone", "tanda-phone.webp"],
  ["type", "tanda-type.webp"],
  ["carryCoin", "tanda-carry-coin.webp"],
  ["releaseCoin", "tanda-release-coin.webp"],
  ["wave", "tanda-wave.webp"],
  ["exit", "tanda-exit.webp"],
] as const;

const priorityPoses = new Set(["entryUp", "entryDown", "reach", "grab", "lift"]);

const gatewayDoorPositions = [
  { x: 28, y: 70, scale: 1.06 },
  { x: 38, y: 67, scale: 0.98 },
  { x: 48, y: 70, scale: 1.08 },
  { x: 58, y: 66, scale: 0.98 },
  { x: 68, y: 70, scale: 1.06 },
  { x: 42, y: 81, scale: 0.98 },
  { x: 58, y: 81, scale: 0.98 },
] as const;

const futureGatewayPositions = [
  { x: 20, y: 54, scale: 0.78 },
  { x: 79, y: 54, scale: 0.78 },
  { x: 30, y: 43, scale: 0.7 },
  { x: 69, y: 42, scale: 0.7 },
  { x: 49, y: 35, scale: 0.64 },
  { x: 15, y: 65, scale: 0.68 },
  { x: 84, y: 66, scale: 0.68 },
  { x: 39, y: 30, scale: 0.58 },
  { x: 61, y: 30, scale: 0.58 },
] as const;

const contributionDoorPosition = { x: 50, y: 88, scale: 1.02 } as const;

const gatewayDoorThemes = [
  "gatewayDoorTanda",
  "gatewayDoorViking",
  "gatewayDoorPerez",
  "gatewayDoorKkachi",
  "gatewayDoorWaraba",
  "gatewayDoorDaga",
  "gatewayDoorAnna",
] as const;

const gatewayDoorStyle = (
  accent: string,
  index: number,
  position: { x: number; y: number; scale: number },
) => ({
  "--door-accent": accent,
  "--door-index": String(index),
  "--door-x": `${position.x}%`,
  "--door-y": `${position.y}%`,
  "--door-scale": String(position.scale),
}) as CSSProperties;

const gatewayDoorClassName = (index: number) => {
  const theme = gatewayDoorThemes[index] ?? gatewayDoorThemes[0];
  return `${styles.gatewayDoor} ${styles[theme]}`;
};

type MotionDiagnostics = {
  debug: boolean;
  forceMotion: boolean;
  reducedMotion: boolean;
  platform: string;
  maxTouchPoints: number;
};

const initialMotionDiagnostics: MotionDiagnostics = {
  debug: false,
  forceMotion: false,
  reducedMotion: false,
  platform: "",
  maxTouchPoints: 0,
};

function ToothMark({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 76" fill="none" aria-hidden>
      <path
        d="M32.4 6.8c-9.2 0-16.8 7-17.5 16.4-.4 5.9 1.2 11.1 3.1 16.5 1.5 4.1 2.1 9.8 2.8 15.5.6 5.2 2.5 10 6 10 3 0 4.1-4.2 4.8-10 .3-2.8.8-5.2 1.1-6.3.4 1.1.9 3.5 1.2 6.3.7 5.8 1.8 10 4.8 10 3.6 0 5.4-4.8 6-10 .7-5.7 1.3-11.4 2.8-15.5 1.9-5.4 3.5-10.6 3.1-16.5-.7-9.4-8.7-16.4-18.2-16.4Z"
        fill="url(#liveHeroToothFill)"
        stroke="url(#liveHeroToothStroke)"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      <path d="M20.6 24.7c5.5 3 16.6 3.5 23.7.1" stroke="#fff9d7" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M23.5 18.8c3.2-3.8 9.1-5.5 14.6-3.9" stroke="#ffffff" strokeWidth="2.3" strokeLinecap="round" opacity=".9" />
      <path d="M45.3 36.9c-1 3-1.7 6.4-2.1 10.1" stroke="#f3c762" strokeWidth="1.8" strokeLinecap="round" opacity=".72" />
      <defs>
        <linearGradient id="liveHeroToothFill" x1="18" y1="9" x2="48" y2="67" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="0.46" stopColor="#fff8dd" />
          <stop offset="0.76" stopColor="#f3c762" />
          <stop offset="1" stopColor="#c98924" />
        </linearGradient>
        <linearGradient id="liveHeroToothStroke" x1="19" y1="8" x2="49" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff1af" />
          <stop offset="0.52" stopColor="#d8a43c" />
          <stop offset="1" stopColor="#9c6419" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function TandaLiveRitualHero() {
  const [motionDiagnostics, setMotionDiagnostics] = useState(initialMotionDiagnostics);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateDiagnostics = () => {
      setMotionDiagnostics({
        debug: params.get("motionDebug") === "1",
        forceMotion: params.get("motion") === "force",
        reducedMotion: reducedMotionQuery.matches,
        platform: navigator.platform || "unknown",
        maxTouchPoints: navigator.maxTouchPoints || 0,
      });
    };

    updateDiagnostics();
    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", updateDiagnostics);
    } else {
      reducedMotionQuery.addListener(updateDiagnostics);
    }

    return () => {
      if (typeof reducedMotionQuery.removeEventListener === "function") {
        reducedMotionQuery.removeEventListener("change", updateDiagnostics);
      } else {
        reducedMotionQuery.removeListener(updateDiagnostics);
      }
    };
  }, []);

  return (
    <main className={styles.page}>
      <section
        className={styles.hero}
        aria-label="Tooth Fairy Network homepage ritual preview"
        data-tanda-live-ritual-hero
      >
        <div className={styles.copy}>
          <h1>
            Turn a lost tooth{" "}
            <span>into your child's first digital wallet.</span>
          </h1>
        </div>

        <div
          className={styles.stage}
          aria-label="Tanda flies across the hero image and starts a Smile Fund."
          data-force-motion={motionDiagnostics.forceMotion ? "true" : undefined}
        >
          <div className={styles.familyFrame}>
            <Image
              src="/toothfairy/visual-system/hero-family-v1-no-spark.png"
              alt="A parent and child celebrating a lost tooth"
              fill
              priority
              sizes="(min-width: 1024px) 680px, 94vw"
              className={styles.familyImage}
            />
            <svg
              className={styles.networkBackdrop}
              viewBox="0 0 640 640"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path d="M306 72 C 412 18, 512 62, 616 38" />
              <path d="M336 534 C 426 438, 478 382, 610 332" />
              <path d="M520 92 C 456 184, 466 272, 522 376 S 492 524, 376 604" />
              <circle cx="306" cy="72" r="4.4" />
              <circle cx="430" cy="40" r="3.8" />
              <circle cx="520" cy="74" r="5" />
              <circle cx="616" cy="38" r="5.2" />
              <circle cx="336" cy="534" r="4.2" />
              <circle cx="466" cy="408" r="5.4" />
              <circle cx="610" cy="332" r="4.5" />
              <circle cx="522" cy="376" r="3.8" />
              <circle cx="376" cy="604" r="4.4" />
            </svg>
            <span className={styles.photoWash} aria-hidden />
            <span className={styles.sourceTooth} aria-hidden>
              <ToothMark />
            </span>
          </div>

          <svg className={styles.flightTrails} viewBox="0 0 1000 625" preserveAspectRatio="none" aria-hidden>
            <path className={styles.entryTrail} d="M-120 178 C 18 92, 122 106, 198 176 S 250 214, 296 214" />
            <path className={styles.depositTrail} d="M288 218 C 410 180, 586 226, 790 418" />
          </svg>

          <article className={styles.memoryCard}>
            <div className={styles.memoryArt}>
              <img
                src={keepsakePreview}
                alt=""
                draggable={false}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = keepsakePreviewFallback;
                }}
              />
            </div>
            <p>Toothlight</p>
            <strong>#FDSR</strong>
            <em>First forever memory</em>
          </article>

          <article className={styles.smileCard}>
            <div>
              <p>Little Smile Fund</p>
              <strong>$360</strong>
              <em>6 family gifts saved</em>
            </div>
            <div className={styles.fundBars} aria-hidden>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </article>

          <div className={styles.piggyBank} aria-hidden>
            <span className={styles.pigGlow} />
            <img
              src={`/toothfairy/animation/layered/piggy-cutout-soft-no-coin.png?v=${liveAssetVersion}`}
              alt=""
              draggable={false}
            />
            <span className={styles.slotGlow} />
          </div>

          <div className={styles.tanda} aria-hidden>
            <span className={styles.wingGlow} />
            <span className={styles.phoneScreenGlint} />
            <span className={styles.heldCoinToken}>
              <span />
            </span>
            {poses.map(([name, file]) => (
              <img
                key={file}
                className={`${styles.pose} ${styles[name]}`}
                src={`${liveAssetRoot}/${file}?v=${liveAssetVersion}`}
                alt=""
                draggable={false}
                decoding="async"
                fetchPriority={priorityPoses.has(name) ? "high" : "auto"}
                loading="eager"
              />
            ))}
          </div>

          <span className={styles.phoneGlow} aria-hidden />
          <span className={styles.coinAura} aria-hidden />
          <span className={styles.coinToken} aria-hidden>
            <span />
          </span>
          <div className={styles.sparkles} aria-hidden>
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          {motionDiagnostics.debug ? (
            <aside className={styles.motionDebug} aria-label="Motion diagnostics">
              <strong>Motion debug</strong>
              <span>reduced motion: {motionDiagnostics.reducedMotion ? "yes" : "no"}</span>
              <span>force motion: {motionDiagnostics.forceMotion ? "yes" : "no"}</span>
              <span>platform: {motionDiagnostics.platform}</span>
              <span>touch points: {motionDiagnostics.maxTouchPoints}</span>
            </aside>
          ) : null}
        </div>

        <div className={styles.actions}>
          <a href="/toothfairy/app/draw?from=home" className={styles.primaryAction}>
            Create a Toothlight
            <span aria-hidden />
          </a>
          <a href="#how-it-works" className={styles.secondaryAction}>
            See how it works
          </a>
        </div>
      </section>

      <section id="how-it-works" className={styles.howItWorks} aria-label="How Tooth Fairy Network works">
        <div className={styles.howIntro}>
          <p>How it works</p>
          <h2>
            Draw it. Light it. Save it.
          </h2>
          <span>
            A lost tooth becomes a Toothlight memory, then a first wallet parents control until the child is ready.
          </span>
        </div>

        <div className={styles.stepGrid}>
          {steps.map((step) => (
            <article key={step.title} className={`${styles.stepCard} ${styles[step.accent]}`}>
              <div className={styles.stepMedia}>
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(min-width: 900px) 31vw, 92vw"
                  style={{ objectFit: step.fit, objectPosition: step.position }}
                />
              </div>
              <div className={styles.stepCopy}>
                <p>{step.eyebrow}</p>
                <h3>{step.title}</h3>
                <span>{step.body}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.storyWorld} aria-label="Children's Tooth Fairy Network story gateway">
        <div className={styles.networkShell}>
          <div className={styles.networkIntro}>
            <p>Tanda's Network</p>
            <h2>Tanda is building the Tooth Fairy Network.</h2>
            <span>
              The first keepers have opened their doors into their local traditions.
            </span>
          </div>

          <div className={styles.gatewayScene} aria-label="A vast story world with open and future tooth tradition doors">
            <Image
              src="/story-assets/network/story-world-gateway-v1.png"
              alt="Tanda floating above a vast night sky network of glowing tooth story doors"
              fill
              sizes="(min-width: 1180px) 1180px, 100vw"
              className={styles.gatewayImage}
            />
            <span className={styles.gatewayShade} aria-hidden />
            <svg className={styles.gatewayThreads} viewBox="0 0 1200 720" preserveAspectRatio="none" aria-hidden>
              <path d="M244 396 C 352 330, 440 360, 514 426 S 678 488, 818 386" />
              <path d="M310 504 C 428 452, 530 534, 614 468 S 760 370, 942 418" />
              <path d="M382 276 C 456 218, 560 240, 620 302 S 758 330, 876 244" />
              <path d="M172 484 C 290 600, 420 616, 602 570 S 854 562, 1038 472" />
              <path
                className={styles.gatewayValuePulse}
                d="M982 650 C 850 594, 760 556, 624 492 S 382 424, 236 318"
              />
              <circle className={styles.gatewayNodeA} cx="244" cy="396" r="5" />
              <circle className={styles.gatewayNodeB} cx="514" cy="426" r="6" />
              <circle className={styles.gatewayNodeC} cx="818" cy="386" r="5" />
              <circle className={styles.gatewayNodeD} cx="624" cy="492" r="5.5" />
            </svg>

            <div className={styles.gatewayDoorLayer} aria-label="Open story doors">
              {openKeeperDoors.map((door, index) => {
                const position = gatewayDoorPositions[index] ?? gatewayDoorPositions[0];

                return (
                  <a
                    key={door.id}
                    href={door.href}
                    className={gatewayDoorClassName(index)}
                    style={gatewayDoorStyle(door.accent, index, position)}
                    aria-label={`Read ${door.title}`}
                    title={`${door.title}: ${door.objectName}`}
                  >
                    <span className={styles.gatewayDoorGlow} />
                    <span className={styles.gatewayDoorCharm} />
                    <span className={styles.gatewayDoorNumber}>{index + 1}</span>
                    <span className={styles.gatewayDoorPreview}>
                      <Image
                        src={door.image}
                        alt=""
                        fill
                        sizes="148px"
                      />
                    </span>
                    <span className={styles.gatewayDoorText}>
                      <small>{door.region}</small>
                      <strong>{door.title}</strong>
                    </span>
                  </a>
                );
              })}
            </div>

            <div className={styles.futureGatewayLayer} aria-label="Future story doors">
              {futureKeeperDoors.slice(0, futureGatewayPositions.length).map((door, index) => {
                const position = futureGatewayPositions[index];

                return (
                  <span
                    key={door.id}
                    className={styles.futureGatewayDoor}
                    style={gatewayDoorStyle(door.accent, index, position)}
                    aria-label={`${door.title} is listening`}
                  >
                    <span>{door.region}</span>
                  </span>
                );
              })}
            </div>

            <a
              href={contributionDoor.href}
              className={styles.gatewayContributionDoor}
              style={gatewayDoorStyle(contributionDoor.accent, 10, contributionDoorPosition)}
              aria-label={contributionDoor.title}
            >
              <span>?</span>
              <strong>Your family's door</strong>
            </a>

            <div className={styles.gatewayLegend}>
              <p>The first paths are open.</p>
              <span>Hover a door to follow its thread.</span>
              <a href="/toothfairy/stories">Open the story map</a>
            </div>

          </div>

          <div className={styles.gatewayStoryRail} aria-label="The first open story doors">
            {openKeeperDoors.map((door, index) => (
              <a
                key={door.id}
                href={door.href}
                className={styles.gatewayStoryChip}
                style={gatewayDoorStyle(door.accent, index, gatewayDoorPositions[index] ?? gatewayDoorPositions[0])}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{door.keeper}</strong>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
