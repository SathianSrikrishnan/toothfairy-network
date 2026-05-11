"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TFNGlowingToothLogo } from "@/components/toothfairy/brand/tfn-glowing-tooth-logo"

const LINKS = [
  { href: "/toothfairy#how-it-works", label: "How it works" },
  { href: "/toothfairy/stories", label: "Stories" },
] as const

export function TFNHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className="tfn-header"
      style={{
        background: scrolled
          ? "oklch(97.5% 0.01 80 / 0.9)"
          : "oklch(97.5% 0.01 80 / 0.72)",
        backdropFilter: "blur(16px) saturate(150%)",
        WebkitBackdropFilter: "blur(16px) saturate(150%)",
        borderBottom: `1px solid ${scrolled ? "var(--tfn-border)" : "transparent"}`,
      }}
    >
      <div className="tfn-header-inner">
        <Link href="/toothfairy" className="brand no-underline">
          <TFNGlowingToothLogo size={40} />
          <span className="brand-copy">
            <span className="brand-name">
              Tooth Fairy <b>Network</b>
            </span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Tooth Fairy Network">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          <span className="solana-pill">
            <span aria-hidden />
            Built on Solana
          </span>
          <Link href="/toothfairy/app/draw?from=nav" className="header-cta">
            Create a Toothlight
            <span aria-hidden className="cta-arrow" />
          </Link>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        body {
          margin: 0;
        }

        .tfn-header {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          box-sizing: border-box;
          font-family: var(--font-body), Segoe UI, system-ui, sans-serif;
        }

        .tfn-header-inner {
          display: flex;
          width: min(100% - 40px, 1280px);
          height: 72px;
          align-items: center;
          justify-content: space-between;
          margin: 0 auto;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 0.64rem;
          min-width: 0;
          text-decoration: none;
        }

        .brand-copy {
          display: block;
          min-width: 0;
          line-height: 1.05;
        }

        .brand-name {
          position: relative;
          display: block;
          color: #11234a;
          font-family: var(--font-display), Georgia, serif;
          font-size: clamp(1.05rem, 1.45vw, 1.35rem);
          font-weight: 800;
          white-space: nowrap;
        }

        .brand-name b {
          background: linear-gradient(100deg, #0c7d78, #28b99a 38%, #d8a43c 72%, #f06f73);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 800;
        }

        .brand-name::after {
          position: absolute;
          right: -0.1rem;
          bottom: -0.24rem;
          width: 42%;
          height: 0.18rem;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(40, 185, 154, 0.5), rgba(255, 215, 106, 0.72), transparent);
          content: "";
        }

        .nav-actions {
          display: none;
          align-items: center;
          gap: 0.75rem;
          margin-left: clamp(0.85rem, 2vw, 2rem);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.18rem;
          margin-left: auto;
        }

        .nav-link {
          min-height: 34px;
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 0 0.64rem;
          color: #23365f;
          font-size: 0.78rem;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
          transition: background 160ms ease, color 160ms ease;
        }

        .nav-link:hover {
          background: oklch(100% 0 0 / 0.6);
          color: #0c7d78;
        }

        .solana-pill {
          display: inline-flex;
          min-height: 38px;
          align-items: center;
          gap: 0.58rem;
          border: 1px solid var(--tfn-border);
          border-radius: 999px;
          padding: 0 0.86rem;
          color: #23365f;
          background: oklch(100% 0 0 / 0.54);
          font-size: 0.78rem;
          font-weight: 900;
          white-space: nowrap;
        }

        .solana-pill span {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          background: linear-gradient(135deg, #14f195 0%, #9945ff 54%, #14f195 100%);
          box-shadow: 0 6px 16px rgba(20, 241, 149, 0.22);
        }

        .header-cta {
          display: inline-flex;
          min-height: 40px;
          align-items: center;
          gap: 0.55rem;
          border-radius: 999px;
          padding: 0 1.15rem;
          border: 1px solid rgba(40, 185, 154, 0.28);
          background: linear-gradient(135deg, #0f857d, #28b99a 48%, #ffd76a);
          color: #fffaf1;
          font-size: 0.84rem;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 12px 28px rgba(16, 133, 125, 0.24);
          white-space: nowrap;
        }

        .cta-arrow {
          display: inline-block;
          width: 0.46rem;
          height: 0.46rem;
          border-top: 2px solid currentColor;
          border-right: 2px solid currentColor;
          transform: rotate(45deg);
        }

        @media (min-width: 980px) {
          .nav-actions {
            display: flex;
          }
        }

        @media (min-width: 760px) {
          .tfn-header-inner {
            display: grid;
            grid-template-columns: minmax(210px, 1fr) auto minmax(210px, 1fr);
            column-gap: clamp(1rem, 2vw, 2.25rem);
          }

          .brand {
            justify-self: start;
          }

          .desktop-nav {
            justify-self: center;
            margin-left: 0;
          }

          .nav-actions {
            justify-self: end;
            margin-left: 0;
          }
        }

        @media (max-width: 420px) {
          .brand {
            gap: 0.46rem;
          }

          .brand-name {
            font-size: 0.96rem;
          }

          .desktop-nav {
            gap: 0.08rem;
          }

          .nav-link {
            min-height: 32px;
            padding: 0 0.38rem;
            font-size: 0.7rem;
          }
        }

        @media (max-width: 680px) {
          .tfn-header-inner {
            width: min(100% - 28px, 1280px);
          }
        }
      `,
        }}
      />
    </header>
  )
}
