'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  callEnhance,
  getMagicCreditStatus,
  type EnhanceTradition,
  type MagicCreditStatus,
} from '@/lib/toothfairy/enhance-client';
import {
  MAGIC_STYLES,
  STARTER_MAGIC_CREDITS,
  normalizeMagicStyles,
  projectMagicCost,
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
  green: 'oklch(57% 0.11 145)',
  border: 'oklch(88% 0.015 75)',
};

const LATEST_DRAWING_KEY = 'toothfairy-latest-drawing';
const LATEST_ENHANCED_KEY = 'toothfairy-latest-enhanced';
const LATEST_TRADITION_KEY = 'toothfairy-latest-tradition';
const FINAL_DRAWING_KEY = 'toothfairy-final-drawing';
const FLOW_STORAGE_KEY = 'tfn-flow-state';
const MAGIC_RESULTS_KEY = 'toothfairy-magic-results';
const MAGIC_SELECTED_STYLES_KEY = 'toothfairy-magic-selected-styles';

type EnhanceState =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'loading'; styleId: MagicStyleId; index: number; total: number }
  | { kind: 'error'; message: string; retryable: boolean }
  | { kind: 'success' };

interface MagicResult {
  id: string;
  styleId: MagicStyleId;
  enhancedImageUrl: string;
  generationMs: number;
}

function rememberMagicResults(results: MagicResult[]) {
  const first = results[0];
  if (!first?.enhancedImageUrl) return;

  const serialized = JSON.stringify(results);
  try {
    sessionStorage.setItem(MAGIC_RESULTS_KEY, serialized);
    sessionStorage.setItem(LATEST_ENHANCED_KEY, first.enhancedImageUrl);
  } catch {
    // Session storage can be unavailable in private browsing.
  }
  try {
    localStorage.setItem(MAGIC_RESULTS_KEY, serialized);
    localStorage.setItem(LATEST_ENHANCED_KEY, first.enhancedImageUrl);
  } catch {
    // A photo-backed canvas can fill localStorage; sessionStorage carries
    // the immediate handoff into the result page.
  }
}

function signInNextPath() {
  if (typeof window === 'undefined') return '/toothfairy/app/draw/preview';
  return `${window.location.pathname}${window.location.search}`;
}

function startGoogleSignIn() {
  window.location.href = `/api/auth/google?next=${encodeURIComponent(signInNextPath())}`;
}

export default function DrawPreviewPage() {
  const router = useRouter();
  const [drawing, setDrawing] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [credits, setCredits] = useState<MagicCreditStatus | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<Set<MagicStyleId>>(
    new Set<MagicStyleId>(['tanda-glow'])
  );
  const [enhanceState, setEnhanceState] = useState<EnhanceState>({
    kind: 'checking',
  });

  useEffect(() => {
    setHydrated(true);
    try {
      const fromLocal = localStorage.getItem(LATEST_DRAWING_KEY);
      const fromSession = sessionStorage.getItem(LATEST_DRAWING_KEY);
      const storedStyles = localStorage.getItem(MAGIC_SELECTED_STYLES_KEY);
      setDrawing(fromLocal || fromSession || null);
      if (storedStyles) {
        const parsed = JSON.parse(storedStyles) as string[];
        const normalized = normalizeMagicStyles(parsed, STARTER_MAGIC_CREDITS);
        if (normalized.length > 0) {
          setSelectedStyles(new Set(normalized));
        }
      }
    } catch {
      try {
        setDrawing(sessionStorage.getItem(LATEST_DRAWING_KEY));
      } catch {
        setDrawing(null);
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadCredits() {
      const outcome = await getMagicCreditStatus();
      if (!mounted) return;
      if (outcome.ok) {
        setAuthenticated(outcome.authenticated);
        setCredits(outcome.credits);
        setEnhanceState({ kind: 'idle' });
      } else {
        setEnhanceState({
          kind: 'error',
          message: 'Magic Studio credits are not ready yet. Try again in a moment.',
          retryable: true,
        });
      }
    }
    loadCredits();
    return () => {
      mounted = false;
    };
  }, []);

  const availableCredits = credits?.remaining ?? STARTER_MAGIC_CREDITS;
  const maxSelectable = authenticated
    ? Math.max(0, Math.min(STARTER_MAGIC_CREDITS, availableCredits))
    : STARTER_MAGIC_CREDITS;
  const selectedCount = selectedStyles.size;
  const projectedCost = useMemo(
    () => projectMagicCost(selectedCount),
    [selectedCount]
  );

  const toggleStyle = (styleId: MagicStyleId) => {
    if (enhanceState.kind === 'loading') return;
    if (maxSelectable <= 0) return;
    setSelectedStyles((prev) => {
      const next = new Set(prev);
      if (next.has(styleId)) {
        next.delete(styleId);
      } else {
        if (next.size >= maxSelectable) return next;
        next.add(styleId);
      }
      const normalized = normalizeMagicStyles(Array.from(next), maxSelectable);
      return new Set(normalized);
    });
  };

  const handleMagic = async () => {
    if (!drawing || !drawing.startsWith('data:image/')) {
      setEnhanceState({
        kind: 'error',
        message: 'Your drawing was lost. Please go back and redraw it.',
        retryable: false,
      });
      return;
    }

    const stylesToGenerate = normalizeMagicStyles(
      Array.from(selectedStyles),
      availableCredits
    );

    if (stylesToGenerate.length === 0) {
      setEnhanceState({
        kind: 'error',
        message: 'Choose at least one magic style.',
        retryable: true,
      });
      return;
    }

    try {
      localStorage.setItem(
        MAGIC_SELECTED_STYLES_KEY,
        JSON.stringify(stylesToGenerate)
      );
    } catch {
      // ignore
    }

    if (!authenticated) {
      startGoogleSignIn();
      return;
    }

    const tradition: EnhanceTradition = (() => {
      try {
        return (
          (localStorage.getItem(LATEST_TRADITION_KEY) as EnhanceTradition) ||
          'default'
        );
      } catch {
        return 'default';
      }
    })();

    const results: MagicResult[] = [];
    let latestCredits = credits;

    for (let index = 0; index < stylesToGenerate.length; index++) {
      const styleId = stylesToGenerate[index];
      setEnhanceState({
        kind: 'loading',
        styleId,
        index: index + 1,
        total: stylesToGenerate.length,
      });

      const outcome = await callEnhance({
        drawingDataUrl: drawing,
        tradition,
        style: styleId,
      });

      if (outcome.ok) {
        results.push({
          id: `${styleId}-${Date.now()}-${index}`,
          styleId,
          enhancedImageUrl: outcome.result.enhancedImageUrl,
          generationMs: outcome.result.generationMs,
        });
        latestCredits = outcome.result.credits ?? latestCredits;
        continue;
      }

      if (outcome.error === 'auth_required') {
        startGoogleSignIn();
        return;
      }

      const messages: Record<string, string> = {
        no_credits: 'This account has used its starter magic credits.',
        rate_limit: `Take a break! You can enhance again in ${outcome.retryAfter ?? 'a few'} seconds.`,
        moderation_block: 'The magic did not settle on this drawing. Try another style.',
        provider_unconfigured:
          'Magic Studio is not connected yet. Your original drawing is still saved.',
        service_unavailable: 'Magic Studio is busy. Please try again.',
        invalid_input: 'Something went wrong with the drawing. Try redoing it.',
        network: 'Check your internet connection and try again.',
        timeout:
          'Magic Studio took too long. Your original drawing is still saved.',
      };

      if (results.length === 0) {
        setEnhanceState({
          kind: 'error',
          message: messages[outcome.error] || messages.service_unavailable,
          retryable: outcome.error !== 'invalid_input',
        });
        return;
      }

      break;
    }

    if (latestCredits) setCredits(latestCredits);

    rememberMagicResults(results);

    setEnhanceState({ kind: 'success' });
    router.push('/toothfairy/app/draw/result');
  };

  const handleKeepOriginal = () => {
    if (!drawing) return;
    try {
      localStorage.setItem(FINAL_DRAWING_KEY, drawing);
      localStorage.setItem(
        FLOW_STORAGE_KEY,
        JSON.stringify({
          previewImage: drawing,
          step: 'setup',
          fromMagicStudio: false,
        })
      );
    } catch {
      // Continue even if storage is constrained; the user can redraw if needed.
    }
    router.push('/toothfairy/app');
  };

  if (!hydrated) return null;

  if (!drawing) {
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
            No drawing yet
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

  const loadingStyle =
    enhanceState.kind === 'loading'
      ? MAGIC_STYLES.find((style) => style.id === enhanceState.styleId)
      : null;

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
            Magic Studio
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              color: c.brown,
              fontSize: '1.85rem',
              lineHeight: 1.05,
              fontWeight: 500,
            }}
          >
            Pick the magic
          </h1>
        </header>

        <div
          className="rounded-2xl overflow-hidden mb-5 relative"
          style={{
            background: c.cream,
            border: `1px solid ${c.goldTint}`,
            boxShadow:
              enhanceState.kind === 'loading'
                ? `0 0 0 3px ${c.gold}, 0 0 40px 8px oklch(72% 0.145 75 / 0.3)`
                : '0 12px 40px oklch(30% 0.035 65 / 0.1)',
            transition: 'box-shadow 0.4s ease',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={drawing}
            alt="Original drawing"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              aspectRatio: '1 / 1',
              objectFit: 'contain',
              background: c.cream,
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-3 mb-4">
          <div
            className="rounded-full px-4 py-2 text-xs"
            style={{
              background: c.goldSoft,
              border: `1px solid ${c.goldTint}`,
              color: c.brown,
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
            }}
          >
            {authenticated
              ? `${availableCredits} credits left`
              : `${STARTER_MAGIC_CREDITS} starter credits`}
          </div>
          <div
            className="text-xs"
            style={{ color: c.brownMuted, fontFamily: 'var(--font-body)' }}
          >
            {selectedCount} selected, about ${projectedCost.toFixed(2)}
          </div>
        </div>

        <div
          className="mb-5 rounded-2xl px-4 py-3 text-xs leading-relaxed"
          style={{
            background: c.cream,
            border: `1px solid ${c.border}`,
            color: c.brownMuted,
            fontFamily: 'var(--font-body)',
          }}
        >
          3 starter credits per parent account. More credit bundles are coming soon.
        </div>

        <section className="grid grid-cols-2 gap-3 mb-6" aria-label="Magic styles">
          {MAGIC_STYLES.map((style) => {
            const active = selectedStyles.has(style.id);
            const disabled =
              !active &&
              selectedStyles.size >= maxSelectable &&
              enhanceState.kind !== 'loading';

            return (
              <button
                key={style.id}
                type="button"
                onClick={() => toggleStyle(style.id)}
                aria-pressed={active}
                disabled={enhanceState.kind === 'loading' || disabled}
                className="text-left active:scale-[0.98]"
                style={{
                  minHeight: 126,
                  borderRadius: 12,
                  padding: '14px 13px',
                  background: active ? c.goldSoft : c.cream,
                  border: `2px solid ${active ? c.gold : c.border}`,
                  color: c.brown,
                  opacity: disabled ? 0.55 : 1,
                  transition: 'border-color 0.2s, background 0.2s, opacity 0.2s',
                }}
              >
                <span
                  className="mb-3 flex items-center justify-center"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: active ? c.gold : c.creamDeep,
                    color: active ? c.cream : c.brownMuted,
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                  aria-hidden
                >
                  {style.shortLabel}
                </span>
                <span
                  className="block mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 17,
                    lineHeight: 1.05,
                    fontWeight: 500,
                  }}
                >
                  {style.label}
                </span>
                <span
                  className="block"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    lineHeight: 1.35,
                    color: c.brownMuted,
                  }}
                >
                  {style.description}
                </span>
              </button>
            );
          })}
        </section>

        {enhanceState.kind === 'loading' && (
          <div
            role="status"
            aria-live="polite"
            className="text-center mb-6 rounded-2xl px-5 py-4"
            style={{ background: c.cream, border: `1px solid ${c.goldTint}` }}
          >
            <p
              style={{
                fontFamily: 'var(--font-display)',
                color: c.brown,
                fontSize: '1.08rem',
                marginBottom: 4,
              }}
            >
              Transforming {loadingStyle?.label ?? 'the drawing'}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: c.brown,
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              Magic is still working
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: c.brownMuted,
                fontSize: 13,
              }}
            >
              {enhanceState.index} of {enhanceState.total}
            </p>
          </div>
        )}

        {enhanceState.kind === 'error' && (
          <div
            className="text-center mb-6 rounded-2xl px-5 py-4"
            style={{ background: c.cream, border: `1px solid ${c.border}` }}
          >
            <p
              className="mb-4"
              style={{
                fontFamily: 'var(--font-body)',
                color: c.brownSoft,
                lineHeight: 1.5,
              }}
            >
              {enhanceState.message}
            </p>
            {enhanceState.retryable && (
              <button
                type="button"
                onClick={handleMagic}
                className="px-6 py-3 rounded-full"
                style={{
                  background: c.gold,
                  color: c.cream,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  border: 'none',
                }}
              >
                Try again
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleMagic}
            disabled={
              selectedStyles.size === 0 ||
              (authenticated && availableCredits <= 0) ||
              enhanceState.kind === 'loading' ||
              enhanceState.kind === 'checking'
            }
            className="w-full rounded-full active:scale-[0.98]"
            style={{
              height: 64,
              background:
                selectedStyles.size > 0 && enhanceState.kind !== 'loading'
                  && (!authenticated || availableCredits > 0)
                  ? c.gold
                  : c.border,
              color: c.cream,
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 500,
              border: 'none',
              boxShadow: '0 4px 24px oklch(72% 0.145 75 / 0.2)',
              opacity: enhanceState.kind === 'checking' ? 0.7 : 1,
            }}
          >
            {authenticated ? 'Make magic' : 'Sign in to make magic'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/toothfairy/app/draw')}
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
            Redraw
          </button>
          <button
            type="button"
            onClick={handleKeepOriginal}
            className="w-full rounded-full active:scale-[0.98]"
            style={{
              height: 56,
              background: c.cream,
              color: c.brown,
              fontFamily: 'var(--font-body)',
              fontSize: 15,
              fontWeight: 600,
              border: `1px solid ${c.border}`,
            }}
          >
            Use original drawing
          </button>
        </div>
      </div>
    </main>
  );
}
