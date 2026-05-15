"use client"

import dynamic from "next/dynamic"

const TandaLiveRitualHero = dynamic(
  () => import("@/components/toothfairy/home/tanda-live-ritual-hero"),
  {
    ssr: false,
    loading: () => <HomeFallback />,
  },
)

function HomeFallback() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "linear-gradient(180deg, #fffaf1, #fbf7ee)",
        color: "#11234a",
        fontFamily: "var(--font-body), Segoe UI, system-ui, sans-serif",
      }}
    >
      <section style={{ maxWidth: 720, textAlign: "center" }}>
        <p
          style={{
            margin: "0 0 0.75rem",
            color: "#9b690f",
            fontSize: "0.78rem",
            fontWeight: 900,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Tooth Fairy Network
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-display), Georgia, serif",
            fontSize: "clamp(2.5rem, 9vw, 5rem)",
            lineHeight: 0.95,
            fontWeight: 800,
          }}
        >
          Turn a lost tooth into your child's first digital wallet.
        </h1>
        <a
          href="/toothfairy/app/draw?from=home"
          style={{
            display: "inline-flex",
            minHeight: 52,
            alignItems: "center",
            justifyContent: "center",
            marginTop: "1.75rem",
            borderRadius: 999,
            padding: "0 1.35rem",
            background: "linear-gradient(135deg, #0f857d, #28b99a 46%, #ffd76a)",
            color: "#fffaf1",
            fontWeight: 900,
            textDecoration: "none",
            boxShadow: "0 12px 28px rgba(216, 164, 60, 0.28)",
          }}
        >
          Create a Toothlight
        </a>
      </section>
    </main>
  )
}

export default function ToothFairyHomeClient() {
  return <TandaLiveRitualHero />
}
