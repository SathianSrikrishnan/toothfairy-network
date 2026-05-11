'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  BRUSH_DEFAULT_SIZE_INDEX,
  BRUSH_SIZES,
  type BrushSizeIndex,
  type BrushTool,
  type Point,
  eraserStroke,
  strokeForTool,
} from '@/lib/toothfairy/brush-tools';
import { exportDrawing, type ExportedDrawing } from '@/lib/toothfairy/canvas-export';

const c = {
  cream:      'oklch(97.5% 0.01 80)',
  creamDeep:  'oklch(95% 0.015 75)',
  brown:      'oklch(30% 0.035 65)',
  brownSoft:  'oklch(42% 0.03 65)',
  brownMuted: 'oklch(58% 0.025 65)',
  gold:       'oklch(72% 0.145 75)',
  goldLight:  'oklch(82% 0.1 78)',
  goldSoft:   'oklch(72% 0.145 75 / 0.15)',
  border:     'oklch(88% 0.015 75)',
  shadow:     'oklch(30% 0.035 65 / 0.08)',
};

const SWATCHES = [
  { name: 'cream',    hex: '#fdf8ee' },
  { name: 'magenta',  hex: '#d8388a' },
  { name: 'gold',     hex: '#d9a44a' },
  { name: 'sky',      hex: '#4aa8d9' },
  { name: 'mint',     hex: '#5dd9a5' },
  { name: 'lavender', hex: '#a487d9' },
  { name: 'coral',    hex: '#f17855' },
  { name: 'white',    hex: '#ffffff' },
  { name: 'black',    hex: '#1a1410' },
  { name: 'pink',     hex: '#f4a6c8' },
];

const TOOL_ORDER: BrushTool[] = ['pencil', 'crayon', 'marker'];

export interface DrawingCanvasV2Ref {
  toDataURL: () => string | null;
  exportDrawing: () => ExportedDrawing | null;
  clear: () => void;
  hasStrokes: () => boolean;
}

export interface DrawingCanvasV2Props {
  onDone: (dataUrl: string) => void;
  onBack?: () => void;
  initialBackground?: string | null;
  topAction?: ReactNode;
}

interface Sparkle {
  id: number;
  x: number; // pixels relative to the canvas element (client coords)
  y: number;
  createdAt: number;
}

const SPARKLE_LIFETIME_MS = 800;
const SPARKLE_CAP = 10;

type PointerId = number;

const CANVAS_RESOLUTION = 1024;
const UNDO_CAP = 30;
const TOUCH_POINTER_ID = -1;

const DrawingCanvasV2 = forwardRef<DrawingCanvasV2Ref, DrawingCanvasV2Props>(
  function DrawingCanvasV2({ onDone, onBack, initialBackground, topAction }, ref) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const activePointerRef = useRef<PointerId | null>(null);
    const activeTouchIdRef = useRef<number | null>(null);
    const lastPosRef = useRef<Point | null>(null);
    const undoStackRef = useRef<ImageData[]>([]);
    const strokeCountRef = useRef(0);

    const [tool, setTool] = useState<BrushTool>('pencil');
    const [sizeIndex, setSizeIndex] = useState<BrushSizeIndex>(
      BRUSH_DEFAULT_SIZE_INDEX.pencil
    );
    const [color, setColor] = useState<string>(SWATCHES[8].hex);
    const [eraser, setEraser] = useState(false);
    const [hasStrokes, setHasStrokes] = useState(false);
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);
    const [doneAnimating, setDoneAnimating] = useState(false);
    const sparkleIdRef = useRef(0);
    const reducedMotionRef = useRef(false);

    useEffect(() => {
      if (typeof window !== 'undefined' && window.matchMedia) {
        reducedMotionRef.current = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;
      }
    }, []);

    const spawnSparkles = useCallback(
      (clientX: number, clientY: number, containerEl: HTMLDivElement) => {
        if (reducedMotionRef.current) return;
        const rect = containerEl.getBoundingClientRect();
        const localX = clientX - rect.left;
        const localY = clientY - rect.top;
        const count = 1 + Math.floor(Math.random() * 2); // 1 or 2 per stroke
        const next: Sparkle[] = [];
        for (let i = 0; i < count; i++) {
          next.push({
            id: ++sparkleIdRef.current,
            x: localX + (Math.random() - 0.5) * 8,
            y: localY + (Math.random() - 0.5) * 8,
            createdAt: Date.now(),
          });
        }
        setSparkles((prev) => {
          const merged = [...prev, ...next];
          const now = Date.now();
          const filtered = merged.filter(
            (s) => now - s.createdAt < SPARKLE_LIFETIME_MS
          );
          return filtered.slice(-SPARKLE_CAP);
        });
      },
      []
    );

    // GC sparkles on a tick (animations continue via CSS but we need to remove stale ones)
    useEffect(() => {
      if (sparkles.length === 0) return;
      const timer = setTimeout(() => {
        const now = Date.now();
        setSparkles((prev) =>
          prev.filter((s) => now - s.createdAt < SPARKLE_LIFETIME_MS)
        );
      }, SPARKLE_LIFETIME_MS + 50);
      return () => clearTimeout(timer);
    }, [sparkles]);

    // Current brush size derived from tool + size index
    const currentSize = BRUSH_SIZES[tool][sizeIndex];

    // ── Canvas init ─────────────────────────────────────────────
    const fillBackground = useCallback((ctx: CanvasRenderingContext2D) => {
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = c.cream;
      ctx.fillRect(0, 0, CANVAS_RESOLUTION, CANVAS_RESOLUTION);
      ctx.restore();
    }, []);

    const initCanvas = useCallback(
      (canvas: HTMLCanvasElement | null) => {
        if (!canvas) return;
        canvas.width = CANVAS_RESOLUTION;
        canvas.height = CANVAS_RESOLUTION;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        fillBackground(ctx);
        undoStackRef.current = [];
        strokeCountRef.current = 0;
        setHasStrokes(false);
      },
      [fillBackground]
    );

    useEffect(() => {
      initCanvas(canvasRef.current);
    }, [initCanvas]);

    // Optional initial background image
    useEffect(() => {
      if (!initialBackground) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        fillBackground(ctx);
        const scale = Math.max(
          CANVAS_RESOLUTION / img.width,
          CANVAS_RESOLUTION / img.height
        );
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (CANVAS_RESOLUTION - w) / 2, (CANVAS_RESOLUTION - h) / 2, w, h);
        undoStackRef.current = [];
        strokeCountRef.current = 1;
        setHasStrokes(true);
      };
      img.src = initialBackground;
    }, [initialBackground, fillBackground]);

    // ── Imperative API ──────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      toDataURL: () => canvasRef.current?.toDataURL('image/png') ?? null,
      exportDrawing: () =>
        canvasRef.current ? exportDrawing(canvasRef.current) : null,
      clear: () => initCanvas(canvasRef.current),
      hasStrokes: () => strokeCountRef.current > 0,
    }));

    // ── Pointer → canvas coord mapping ──────────────────────────
    const getCanvasPos = (clientX: number, clientY: number): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * CANVAS_RESOLUTION;
      const y = ((clientY - rect.top) / rect.height) * CANVAS_RESOLUTION;
      return { x, y };
    };

    // ── Palm rejection guard ────────────────────────────────────
    const shouldRejectPointer = (e: React.PointerEvent): boolean => {
      // Mobile browsers do not report finger geometry consistently enough for
      // palm rejection. Let touch input draw; the canvas boundary handles scroll.
      if (e.pointerType === 'touch') return false;
      return false;
    };

    const pushUndo = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      try {
        const snapshot = ctx.getImageData(0, 0, CANVAS_RESOLUTION, CANVAS_RESOLUTION);
        undoStackRef.current.push(snapshot);
        if (undoStackRef.current.length > UNDO_CAP) {
          undoStackRef.current.shift();
        }
      } catch {
        // getImageData can throw on tainted canvas — ignore, user loses undo for this stroke
      }
    };

    const handleUndo = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const snapshot = undoStackRef.current.pop();
      if (snapshot) {
        ctx.putImageData(snapshot, 0, 0);
        strokeCountRef.current = Math.max(0, strokeCountRef.current - 1);
        setHasStrokes(strokeCountRef.current > 0);
      }
    };

    const handleClear = () => {
      initCanvas(canvasRef.current);
    };

    const beginStrokeAt = (clientX: number, clientY: number): boolean => {
      const canvas = canvasRef.current;
      if (!canvas) return false;
      const pos = getCanvasPos(clientX, clientY);
      if (!pos) return false;

      pushUndo();
      lastPosRef.current = pos;

      // Draw a tiny dot at the start so a single-tap is visible
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (eraser) {
          eraserStroke(ctx, pos, pos, currentSize);
        } else {
          strokeForTool(tool, ctx, pos, pos, currentSize, color);
        }
      }
      return true;
    };

    const continueStrokeAt = (clientX: number, clientY: number): void => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const pos = getCanvasPos(clientX, clientY);
      if (!pos) return;

      const from = lastPosRef.current ?? pos;
      if (eraser) {
        eraserStroke(ctx, from, pos, currentSize);
      } else {
        strokeForTool(tool, ctx, from, pos, currentSize, color);
      }
      lastPosRef.current = pos;
    };

    const finishStrokeAt = (clientX?: number, clientY?: number): void => {
      activePointerRef.current = null;
      activeTouchIdRef.current = null;
      lastPosRef.current = null;
      strokeCountRef.current += 1;
      setHasStrokes(true);

      // Sparkle feedback at the stroke end point
      if (
        typeof clientX === 'number' &&
        typeof clientY === 'number' &&
        containerRef.current &&
        !eraser
      ) {
        spawnSparkles(clientX, clientY, containerRef.current);
      }
    };

    // ── Pointer handlers ────────────────────────────────────────
    const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (shouldRejectPointer(e)) return;
      if (activePointerRef.current !== null) return; // already tracking a pointer

      const canvas = canvasRef.current;
      if (!canvas) return;
      if (!beginStrokeAt(e.clientX, e.clientY)) return;

      activePointerRef.current = e.pointerId;
      if (e.pointerType !== 'touch') {
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {
          // capture failure is non-fatal
        }
      }
    };

    const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (activePointerRef.current !== e.pointerId) return;
      if (shouldRejectPointer(e)) return;

      continueStrokeAt(e.clientX, e.clientY);
    };

    const finishStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (activePointerRef.current !== e.pointerId) return;
      finishStrokeAt(e.clientX, e.clientY);
      try {
        canvasRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        // non-fatal
      }
    };

    const touchFromList = (
      list: React.TouchList,
      identifier: number | null
    ): React.Touch | null => {
      if (identifier === null) return list[0] ?? null;
      for (let i = 0; i < list.length; i += 1) {
        if (list[i].identifier === identifier) return list[i];
      }
      return null;
    };

    const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (activePointerRef.current !== null) return;
      const touch = e.changedTouches[0];
      if (!touch) return;
      e.preventDefault();
      if (!beginStrokeAt(touch.clientX, touch.clientY)) return;
      activePointerRef.current = TOUCH_POINTER_ID;
      activeTouchIdRef.current = touch.identifier;
    };

    const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (activePointerRef.current !== TOUCH_POINTER_ID) return;
      const touch = touchFromList(e.changedTouches, activeTouchIdRef.current);
      if (!touch) return;
      e.preventDefault();
      continueStrokeAt(touch.clientX, touch.clientY);
    };

    const onTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (activePointerRef.current !== TOUCH_POINTER_ID) return;
      const touch = touchFromList(e.changedTouches, activeTouchIdRef.current);
      e.preventDefault();
      finishStrokeAt(touch?.clientX, touch?.clientY);
    };

    // ── Done button ─────────────────────────────────────────────
    const handleDone = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Brief celebration: gold pulse + subtle scale on the canvas frame,
      // then export + navigate.
      if (reducedMotionRef.current) {
        const exported = exportDrawing(canvas);
        onDone(exported.dataUrl);
        return;
      }

      setDoneAnimating(true);
      window.setTimeout(() => {
        const exported = exportDrawing(canvas);
        onDone(exported.dataUrl);
      }, 1200);
    };

    // ── Render ──────────────────────────────────────────────────
    return (
      <div
        ref={containerRef}
        className="drawing-shell fixed inset-0"
        style={{
          background: c.creamDeep,
          display: 'grid',
          gridTemplateRows: 'auto minmax(0, 1fr) auto',
          boxSizing: 'border-box',
          touchAction: 'auto',
          zIndex: 80,
          height: '100dvh',
          minHeight: '100vh',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Top bar */}
        <header
          className="drawing-header flex items-center justify-between px-4"
          style={{
            height: 60,
            background: c.cream,
            borderBottom: `1px solid ${c.border}`,
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="drawing-back-button flex items-center justify-center rounded-full active:scale-95"
            style={{
              width: 48,
              height: 48,
              background: 'transparent',
              color: c.brown,
              fontSize: 24,
              lineHeight: 1,
              border: 'none',
            }}
          >
            ←
          </button>
          <h1
            className="drawing-title text-lg"
            style={{
              fontFamily: 'var(--font-display)',
              color: c.brown,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              flex: '1 1 auto',
              minWidth: 0,
              textAlign: 'center',
            }}
          >
            Start with a photo or draw anything.
          </h1>
          <div
            className="drawing-top-action flex items-center justify-end"
            style={{ minWidth: 'max-content', flexShrink: 0 }}
          >
            {topAction}
          </div>
          <button
            type="button"
            onClick={handleDone}
            disabled={!hasStrokes}
            className="header-done phone-done-anchor rounded-full active:scale-[0.98]"
            style={{
              minWidth: 64,
              height: 42,
              background: hasStrokes ? c.gold : c.border,
              color: c.cream,
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              fontWeight: 600,
              border: 'none',
              padding: '0 0.9rem',
              opacity: hasStrokes ? 1 : 0.6,
            }}
            aria-label="Done drawing"
          >
            Done
          </button>
        </header>

        {/* Canvas area */}
        <div
          className="drawing-canvas-area flex items-center justify-center p-3 relative"
          style={{
            background: c.creamDeep,
            touchAction: 'auto',
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div
            className="drawing-stage relative flex flex-col items-center gap-3"
            style={{
              minWidth: 260,
              maxWidth: '100%',
            }}
          >
            <div
              className="relative"
              style={{
                width: '100%',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
                aspectRatio: '1 / 1',
                borderRadius: 16,
                overflow: 'visible',
                transform: doneAnimating ? 'scale(1.015)' : 'scale(1)',
                transition: 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: doneAnimating
                  ? `0 0 0 4px ${c.gold}, 0 0 48px 8px oklch(72% 0.145 75 / 0.5)`
                  : `inset 0 0 0 1px ${c.border}, 0 8px 32px ${c.shadow}`,
                animation: doneAnimating
                  ? 'tfn-done-fade 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                  : undefined,
              }}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full rounded-2xl select-none"
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  background: c.cream,
                  touchAction: 'none',
                  imageRendering: 'crisp-edges',
                  cursor: 'crosshair',
                  borderRadius: 16,
                }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={finishStroke}
                onPointerCancel={finishStroke}
                onPointerLeave={finishStroke}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchEnd}
              />
            </div>
          </div>

          {/* Sparkle overlay — absolute positioned relative to the full canvas area */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
          >
            {sparkles.map((s) => (
              <span
                key={s.id}
                style={{
                  position: 'absolute',
                  left: s.x - 6,
                  top: s.y - 6,
                  width: 12,
                  height: 12,
                  color: c.gold,
                  animation: 'tfn-sparkle 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  filter: 'drop-shadow(0 0 4px oklch(72% 0.145 75 / 0.6))',
                  pointerEvents: 'none',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            ))}
          </div>

          <style jsx global>{`
            .drawing-header {
              position: relative;
            }
            .drawing-title {
              left: 50%;
              max-width: min(52vw, 540px);
              pointer-events: none;
              position: absolute;
              transform: translateX(-50%);
              white-space: nowrap;
              width: max-content;
            }
            .drawing-top-action {
              margin-left: auto;
            }
            .drawing-canvas-area {
              padding: 0.65rem 0.75rem;
            }
            .drawing-stage {
              width: min(92vw, 720px);
            }
            .color-row {
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
              flex-wrap: nowrap !important;
              justify-content: center !important;
              overflow-x: auto;
              touch-action: pan-x;
            }
            .color-row::-webkit-scrollbar {
              display: none;
            }
            .utility-action {
              flex: 0 0 52px;
            }
            .header-done {
              align-items: center;
              display: flex;
              flex-shrink: 0;
              justify-content: center;
            }
            .phone-done-anchor {
              flex: 0 0 auto;
            }
            .drawing-toolbar {
              flex: 0 0 auto;
              overflow: visible;
              touch-action: auto;
            }
            .drawing-control-row {
              flex-wrap: nowrap !important;
              overflow-x: auto;
              scrollbar-width: none;
              touch-action: pan-x;
            }
            .drawing-control-row::-webkit-scrollbar {
              display: none;
            }
            .color-strip {
              flex: 0 0 auto;
            }
            .action-group {
              flex-shrink: 0;
            }
            .mobile-scroll-cue {
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              width: 1.25rem;
              pointer-events: none;
              background: linear-gradient(
                90deg,
                oklch(97.5% 0.01 80 / 0),
                ${c.cream}
              );
            }
            @media (max-width: 540px) {
              .drawing-shell {
                height: 100dvh !important;
                min-height: 100dvh !important;
                max-height: 100dvh !important;
                overflow: hidden !important;
              }
              .drawing-header {
                align-content: center;
                flex-wrap: wrap;
                gap: 0.25rem !important;
                height: auto !important;
                min-height: 88px !important;
                padding-left: 0.55rem !important;
                padding-right: 0.55rem !important;
                padding-top: 0.3rem !important;
                padding-bottom: 0.35rem !important;
              }
              .drawing-back-button {
                flex: 0 0 40px;
                height: 40px !important;
                order: 1;
                width: 40px !important;
              }
              .drawing-title {
                flex: 1 1 0 !important;
                font-size: 0.95rem !important;
                line-height: 1.05 !important;
                left: auto;
                max-width: none;
                order: 2;
                padding-inline: 0.25rem;
                position: static;
                transform: none;
                white-space: normal;
                width: auto;
              }
              .drawing-top-action {
                flex: 1 0 100% !important;
                justify-content: center !important;
                margin-left: 0;
                min-width: 0 !important;
                order: 4;
              }
              .photo-action-pill {
                border-radius: 16px !important;
                padding: 2px !important;
              }
              .photo-action-button {
                height: 38px !important;
                width: 54px !important;
              }
              .photo-action-button svg {
                height: 19px !important;
                width: 19px !important;
              }
              .drawing-canvas-area {
                align-items: flex-start !important;
                padding: 0.45rem 0.5rem 0.25rem !important;
                overflow: hidden !important;
              }
              .drawing-stage {
                width: min(92vw, 410px, calc(100dvh - 224px));
                gap: 0;
              }
              .drawing-toolbar {
                padding-left: 0.25rem !important;
                padding-right: 0.25rem !important;
                padding-top: 0.35rem !important;
                padding-bottom: 0.35rem !important;
              }
              .drawing-control-row {
                flex-wrap: nowrap;
                gap: 0.1rem;
                justify-content: center !important;
                margin-bottom: 0 !important;
                overflow-x: visible;
                scrollbar-width: none;
                touch-action: pan-x;
              }
              .drawing-control-row::-webkit-scrollbar {
                display: none;
              }
              .tool-group,
              .size-group,
              .action-group {
                gap: 0.1rem;
              }
              .tool-button,
              .size-button {
                width: 38px !important;
                height: 38px !important;
                border-width: 1.5px !important;
              }
              .tool-button svg {
                width: 25px;
                height: 25px;
              }
              .color-strip {
                margin-bottom: 0.25rem;
              }
              .color-row {
                flex-flow: row nowrap !important;
                gap: 0.28rem !important;
                justify-content: center !important;
                margin-bottom: 0 !important;
                overflow-x: visible !important;
                padding-bottom: 0;
              }
              .color-swatch {
                width: 28px !important;
                height: 28px !important;
                flex: 0 0 28px;
                border-width: 2px !important;
              }
              .utility-action {
                width: 44px !important;
                height: 38px !important;
                flex-basis: 44px;
                font-size: 9.5px !important;
                border-width: 1.5px !important;
              }
              .header-done {
                height: 38px !important;
                min-width: 56px !important;
                order: 3;
                padding-inline: 0.65rem !important;
              }
            }
            @supports (-webkit-touch-callout: none) {
              @media (max-width: 540px) {
                .drawing-shell {
                  padding-bottom: calc(env(safe-area-inset-bottom) + 48px) !important;
                }
              }
            }
            @media (max-width: 480px) and (max-height: 720px) {
              .drawing-stage {
                width: min(90vw, 360px, calc(100dvh - 212px));
                gap: 0;
              }
            }
            @media (max-width: 360px) {
              .drawing-title {
                font-size: 0.84rem !important;
              }
              .tool-button,
              .size-button {
                width: 34px !important;
                height: 34px !important;
              }
              .tool-button svg {
                width: 23px;
                height: 23px;
              }
              .color-swatch {
                width: 22px !important;
                height: 22px !important;
                flex-basis: 22px;
              }
              .utility-action {
                width: 36px !important;
                height: 34px !important;
                flex-basis: 36px;
                font-size: 8.5px !important;
              }
            }
            @keyframes tfn-sparkle {
              0% {
                opacity: 0;
                transform: translateY(0) scale(0.6);
              }
              15% {
                opacity: 1;
                transform: translateY(-6px) scale(1.1);
              }
              100% {
                opacity: 0;
                transform: translateY(-30px) scale(1);
              }
            }
            @keyframes tfn-done-fade {
              0% {
                opacity: 1;
              }
              70% {
                opacity: 1;
              }
              100% {
                opacity: 0.85;
              }
            }
          `}</style>
        </div>

        {/* Tools bar */}
        <div
          className="drawing-toolbar px-3 pt-2 pb-3"
          style={{
            background: c.cream,
            borderTop: `1px solid ${c.border}`,
            paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
          }}
        >
          {/* Row 1: color swatches */}
          <div className="relative color-strip">
            <div className="color-row flex items-center justify-center gap-1.5 mb-3 flex-wrap">
              {SWATCHES.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setColor(s.hex)}
                  aria-label={`Color ${s.name}`}
                  aria-pressed={color === s.hex}
                  className="color-swatch rounded-full active:scale-95"
                  style={{
                    width: 38,
                    height: 38,
                    background: s.hex,
                    border:
                      color === s.hex
                        ? `3px solid ${c.gold}`
                        : `2px solid ${c.border}`,
                    padding: 0,
                  }}
                />
              ))}
            </div>
            <div className="mobile-scroll-cue" aria-hidden />
          </div>

          {/* Row 2: tools + sizes + actions */}
          <div className="drawing-control-row flex items-center justify-center gap-2 mb-2 flex-wrap">
            {/* Tool picker */}
            <div className="tool-group flex items-center justify-center gap-2">
              {TOOL_ORDER.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTool(t);
                    setSizeIndex(BRUSH_DEFAULT_SIZE_INDEX[t]);
                    setEraser(false);
                  }}
                  aria-label={`${t} tool`}
                  aria-pressed={tool === t && !eraser}
                  className="tool-button rounded-2xl active:scale-95"
                  style={{
                    width: 52,
                    height: 52,
                    background: tool === t && !eraser ? c.goldSoft : c.cream,
                    border: `2px solid ${tool === t && !eraser ? c.gold : c.border}`,
                    color: c.brown,
                    fontFamily: 'var(--font-body)',
                    fontSize: 11,
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                  }}
                >
                  <ToolIcon tool={t} active={tool === t && !eraser} />
                </button>
              ))}
            </div>

            {/* Size picker */}
            <div className="size-group flex items-center justify-center gap-2">
              {[0, 1, 2].map((i) => {
                const s = BRUSH_SIZES[tool][i as BrushSizeIndex];
                const isActive = sizeIndex === i && !eraser;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSizeIndex(i as BrushSizeIndex);
                      setEraser(false);
                    }}
                    aria-label={`Size ${s} pixels`}
                    aria-pressed={isActive}
                    className="size-button rounded-full active:scale-95 flex items-center justify-center"
                    style={{
                      width: 48,
                      height: 48,
                      background: c.cream,
                      border: `2px solid ${isActive ? c.gold : c.border}`,
                      padding: 0,
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        width: Math.min(32, s),
                        height: Math.min(32, s),
                        borderRadius: '50%',
                        background: color,
                      }}
                    />
                  </button>
                );
              })}
            </div>

            <div className="action-group flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setEraser((e) => !e)}
                aria-pressed={eraser}
                className="utility-action rounded-full active:scale-95"
                style={{
                  width: 52,
                  height: 52,
                  background: eraser ? c.goldSoft : c.cream,
                  border: `2px solid ${eraser ? c.gold : c.border}`,
                  color: c.brown,
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 500,
                  padding: 0,
                }}
                aria-label="Eraser"
              >
                Erase
              </button>
              <button
                type="button"
                onClick={handleUndo}
                className="utility-action rounded-full active:scale-95"
                style={{
                  width: 52,
                  height: 52,
                  background: c.cream,
                  border: `2px solid ${c.border}`,
                  color: c.brown,
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 500,
                  padding: 0,
                }}
                aria-label="Undo"
              >
                Undo
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="utility-action rounded-full active:scale-95"
                style={{
                  width: 52,
                  height: 52,
                  background: c.cream,
                  border: `2px solid ${c.border}`,
                  color: c.brown,
                  fontFamily: 'var(--font-body)',
                  fontSize: 11,
                  fontWeight: 500,
                  padding: 0,
                }}
                aria-label="Clear canvas"
              >
                Clear
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
);

export default DrawingCanvasV2;

function ToolIcon({ tool, active }: { tool: BrushTool; active: boolean }) {
  const stroke = active ? c.gold : c.brown;
  if (tool === 'pencil') {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path
          d="M6 30 L10 26 L24 12 L28 16 L14 30 Z"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M24 12 L28 16" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (tool === 'crayon') {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="12" y="8" width="12" height="18" rx="2" stroke={stroke} strokeWidth="2" />
        <path d="M14 26 L18 32 L22 26" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="14" x2="24" y2="14" stroke={stroke} strokeWidth="1.5" />
      </svg>
    );
  }
  // marker
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="10" y="6" width="16" height="14" rx="2" stroke={stroke} strokeWidth="2" />
      <path d="M14 20 L18 30 L22 20 Z" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
