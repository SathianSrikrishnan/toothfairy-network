"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

const storyCards = [
  {
    chapter: "Chapter 1",
    title: "Tanda and the Night the Network Woke",
    body: "A skipped bedtime note wakes the Toothlight and sends Tanda looking for the other keepers.",
    image: "/story-assets/tanda/v2/s1-frame-01-cover.png",
    alt: "Tanda flying above a moonlit town as glowing teeth connect the first Tooth Fairy Network routes",
    href: "/toothfairy/story/tanda",
    position: "center",
  },
  {
    chapter: "Chapter 2",
    title: "Tanda Fae and the Tooth Fee",
    body: "A father by the sea turns a small tooth into proof of growing up.",
    image: "/story-assets/viking-origin/v2/s2-frame-01-cover-v3.png",
    alt: "Young Tanda holding a glowing tooth beside her father in a Norse shipyard",
    href: "/toothfairy/story/viking-origin",
    position: "center",
  },
  {
    chapter: "Chapter 3",
    title: "Ratoncito Perez and the Toothlight Treaty",
    body: "A child with two true family traditions asks Perez and Tanda not to make her choose.",
    image: "/story-assets/ratoncito-perez/v2/rp3-frame-01-two-doors.png",
    alt: "Tanda and Ratoncito Perez meeting on a Madrid rooftop under moonlight",
    href: "/toothfairy/story/ratoncito-perez",
    position: "center 38%",
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

      <section className={styles.storyWorld} aria-label="Tooth Fairy Network stories">
        <div className={styles.storyIntro}>
          <p>Stories from around the world</p>
          <h2>Tanda is building the Tooth Fairy Network.</h2>
          <span>
            Start with Tanda, then follow the old promises behind lost-tooth traditions from every corner of the world.
          </span>
        </div>

        <div className={styles.storyStrip}>
          {storyCards.map((story) => (
            <a key={story.title} href={story.href} className={styles.storyCard}>
              <div className={styles.storyImage}>
                <Image
                  src={story.image}
                  alt={story.alt}
                  fill
                  sizes="(min-width: 900px) 360px, 92vw"
                  style={{ objectPosition: story.position }}
                />
              </div>
              <span>{story.chapter}</span>
              <h3>{story.title}</h3>
              <p>{story.body}</p>
            </a>
          ))}
        </div>

        <a href="/toothfairy/stories" className={styles.storyAction}>
          Explore global tooth traditions
        </a>
      </section>
    </main>
  );
}
