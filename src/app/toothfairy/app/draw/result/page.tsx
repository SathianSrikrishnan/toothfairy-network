'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MAGIC_STYLES,
  getMagicStyle,
  type MagicStyleId,
} from '@/lib/toothfairy/magic-studio';

const c = {
  cream: 'oklch(97.5% 0.01 80)',
  creamDeep: 'oklch(95% 0.015 75)',
  brown: 'oklch(30% 0.035 65)',
  brownSoft: 'oklch(42% 0.03 65)',
  brownMuted: 'oklch(58% 0.025 65)',
  gold: 'oklch(72% 0.145 75)',
  goldSoft: 'oklch(72% 0.145 75 / 0.15)',
  goldTint: 'oklch(72% 0.145 75 / 0.25)',
  border: 'oklch(88% 0.015 75)',
};

const LATEST_DRAWING_KEY = 'toothfairy-latest-drawing';
const LATEST_ENHANCED_KEY = 'toothfairy-latest-enhanced';
const FINAL_DRAWING_KEY = 'toothfairy-final-drawing';
const MAGIC_RESULTS_KEY = 'toothfairy-magic-results';
const FLOW_STORAGE_KEY = 'tfn-flow-state';

interface MagicResult {
  id: string;
  styleId: MagicStyleId;
  enhancedImageUrl: string;
  generationMs: number;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

function generateSparkles(count: number, width: number, height: number): Sparkle[] {
  const result: Sparkle[] = [];
  for (let i = 0; i < count; i++) {
    result.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: 6 + Math.random() * 8,
      delay: Math.random() * 600,
    });
  }
  return result;
}

function parseMagicResults(raw: string | null): MagicResult[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as MagicResult[];
    return parsed.filter((item) => item?.enhancedImageUrl && item?.styleId);
  } catch {
    return [];
  }
}

function readMagicResults(): MagicResult[] {
  try {
    const localResults = parseMagicResults(localStorage.getItem(MAGIC_RESULTS_KEY));
    if (localResults.length > 0) return localResults;

    const sessionResults = parseMagicResults(sessionStorage.getItem(MAGIC_RESULTS_KEY));
    if (sessionResults.length > 0) return sessionResults;

    const fallback =
      localStorage.getItem(LATEST_ENHANCED_KEY) ||
      sessionStorage.getItem(LATEST_ENHANCED_KEY);
    if (fallback) {
      return [
        {
          id: 'legacy-result',
          styleId: 'tanda-glow',
          enhancedImageUrl: fallback,
          generationMs: 0,
        },
      ];
    }
  } catch {
    // ignore corrupt localStorage
  }
  return [];
}

function readOriginalDrawing(): string | null {
  try {
    return (
      localStorage.getItem(LATEST_DRAWING_KEY) ||
      sessionStorage.getItem(LATEST_DRAWING_KEY) ||
      localStorage.getItem(FINAL_DRAWING_KEY) ||
      sessionStorage.getItem(FINAL_DRAWING_KEY)
    );
  } catch {
    try {
      return (
        sessionStorage.getItem(LATEST_DRAWING_KEY) ||
        sessionStorage.getItem(FINAL_DRAWING_KEY)
      );
    } catch {
      return null;
    }
  }
}

export default function DrawResultPage() {
  const router = useRouter();
  const [original, setOriginal] = useState<string | null>(null);
  const [results, setResults] = useState<MagicResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    setHydrated(true);
    if (typeof window !== 'undefined' && window.matchMedia) {
      reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    try {
      setOriginal(readOriginalDrawing());
      setResults(readMagicResults());
    } catch {
      // Private browsing
    }
  }, []);

  useEffect(() => {
    if (results.length === 0 || !hydrated) return;
    setRevealed(false);
    setShowButtons(false);
    setSparkles([]);

    if (reducedMotion.current) {
      setRevealed(true);
      setShowButtons(true);
      return;
    }

    const t1 = setTimeout(() => {
      setRevealed(true);
      const frame = frameRef.current;
      if (frame) {
        setSparkles(generateSparkles(10, frame.offsetWidth, frame.offsetHeight));
      }
    }, 180);
    const t2 = setTimeout(() => setShowButtons(true), 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [results.length, selectedIndex, hydrated]);

  const selected = results[selectedIndex] ?? null;
  const selectedStyle = useMemo(
    () => getMagicStyle(selected?.styleId),
    [selected?.styleId]
  );

  const handleKeep = () => {
    const finalImage = selected?.enhancedImageUrl || original || '';
    if (!finalImage) return;
    const flowState = JSON.stringify({
      previewImage: finalImage,
      step: 'setup',
      fromMagicStudio: true,
    });
    try {
      sessionStorage.setItem(FINAL_DRAWING_KEY, finalImage);
      sessionStorage.setItem(FLOW_STORAGE_KEY, flowState);
      if (selected?.enhancedImageUrl) {
        sessionStorage.setItem(LATEST_ENHANCED_KEY, selected.enhancedImageUrl);
      }
    } catch {
      // Session storage is best-effort.
    }
    try {
      if (selected?.enhancedImageUrl) {
        localStorage.removeItem(LATEST_DRAWING_KEY);
      }
      localStorage.setItem(FINAL_DRAWING_KEY, finalImage);
      localStorage.setItem(FLOW_STORAGE_KEY, flowState);
      if (selected?.enhancedImageUrl) {
        localStorage.setItem(LATEST_ENHANCED_KEY, selected.enhancedImageUrl);
      }
    } catch {
      // ignore
    }
    router.push('/toothfairy/app');
  };

  if (!hydrated) return null;

  if (!selected) {
    return (
      <main
        className="min-h-screen w-full flex items-center justify-center px-5"
        style={{ background: c.creamDeep }}
      >
        <div
          className="max-w-md w-full rounded-2xl px-8 py-12 text-center"
          style={{ background: c.cream, border: `1px solid ${c.border}` }}
        >
          <p
            style={{
              fontFamily: 'var(--font-display)',
              color: c.brown,
              fontSize: '1.5rem',
              fontWeight: 500,
              marginBottom: '1rem',
            }}
          >
            No magic drawing found
          </p>
          <button
            type="button"
            onClick={() => router.push('/toothfairy/app/draw')}
            className="px-6 py-3 rounded-full"
            style={{
              background: c.gold,
              color: c.cream,
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              border: 'none',
            }}
          >
            Start drawing
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full" style={{ background: c.creamDeep }}>
      <div className="max-w-md mx-auto px-5 py-10">
        <header className="text-center mb-6">
          <p
            className="text-xs uppercase mb-2"
            style={{
              fontFamily: 'var(--font-body)',
              color: c.gold,
              letterSpacing: '0.2em',
              fontWeight: 600,
            }}
          >
            Tooth Fairy Network
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              color: c.brown,
              fontSize: '1.8rem',
              lineHeight: 1.05,
              fontWeight: 500,
            }}
          >
            Choose the keepsake
          </h1>
        </header>

        <div
          ref={frameRef}
          className="rounded-2xl overflow-hidden mb-5 relative"
          style={{
            background: c.cream,
            border: `1px solid ${c.goldTint}`,
            boxShadow: '0 12px 40px oklch(30% 0.035 65 / 0.1)',
            aspectRatio: '1 / 1',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {original && (
            <img
              src={original}
              alt="Original drawing"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                background: c.cream,
                zIndex: 1,
              }}
            />
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected.enhancedImageUrl}
            alt={`${selectedStyle.label} keepsake`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              background: c.cream,
              zIndex: showOriginal && original ? 0 : 2,
              opacity: !original || (revealed && !showOriginal) ? 1 : 0,
              transition: reducedMotion.current
                ? 'opacity 0.1s'
                : 'opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {sparkles.map((s) => (
            <span
              key={s.id}
              className="absolute pointer-events-none"
              style={{
                left: s.x,
                top: s.y,
                width: s.size,
                height: s.size,
                zIndex: 3,
                color: c.gold,
                animation: `tfnRevealSparkle 1s cubic-bezier(0.16, 1, 0.3, 1) ${s.delay}ms forwards`,
                opacity: 0,
                filter: 'drop-shadow(0 0 4px oklch(72% 0.145 75 / 0.6))',
              }}
            >
              <svg width="100%" height="100%" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          ))}

          <style jsx>{`
            @keyframes tfnRevealSparkle {
              0% { opacity: 0; transform: scale(0.3); }
              30% { opacity: 1; transform: scale(1.3); }
              100% { opacity: 0; transform: scale(0.8) translateY(-12px); }
            }
          `}</style>
        </div>

        <div className="text-center mb-5">
          <p
            style={{
              fontFamily: 'var(--font-display)',
              color: c.brown,
              fontSize: '1.15rem',
              lineHeight: 1.2,
              marginBottom: 4,
            }}
          >
            {selectedStyle.label}
          </p>
          {original && (
            <button
              type="button"
              onPointerDown={() => setShowOriginal(true)}
              onPointerUp={() => setShowOriginal(false)}
              onPointerLeave={() => setShowOriginal(false)}
              className="text-sm underline"
              style={{
                fontFamily: 'var(--font-body)',
                color: c.brownMuted,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Hold to see original
            </button>
          )}
        </div>

        {results.length > 1 && (
          <div className="grid grid-cols-3 gap-2 mb-6" aria-label="Generated styles">
            {results.map((result, index) => {
              const style = getMagicStyle(result.styleId);
              const active = index === selectedIndex;
              return (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-pressed={active}
                  className="rounded-2xl active:scale-95"
                  style={{
                    minHeight: 58,
                    background: active ? c.goldSoft : c.cream,
                    border: `2px solid ${active ? c.gold : c.border}`,
                    color: active ? c.brown : c.brownMuted,
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    padding: '8px 6px',
                  }}
                >
                  {style.shortLabel}
                </button>
              );
            })}
          </div>
        )}

        <div
          className="flex flex-col gap-3"
          style={{
            opacity: showButtons ? 1 : 0,
            transform: showButtons ? 'translateY(0)' : 'translateY(16px)',
            transition: reducedMotion.current
              ? 'opacity 0.1s'
              : 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <button
            type="button"
            onClick={handleKeep}
            className="w-full rounded-full active:scale-[0.98]"
            style={{
              height: 64,
              background: c.gold,
              color: c.cream,
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 500,
              border: 'none',
              boxShadow: '0 4px 24px oklch(72% 0.145 75 / 0.2)',
            }}
          >
            Keep this one
          </button>
          <button
            type="button"
            onClick={() => router.push('/toothfairy/app/draw/preview')}
            className="w-full rounded-full active:scale-[0.98]"
            style={{
              height: 56,
              background: 'transparent',
              color: c.brown,
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 600,
              border: `1px solid ${c.border}`,
            }}
          >
            Try more styles
          </button>
        </div>
      </div>
    </main>
  );
}
