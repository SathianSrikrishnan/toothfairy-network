'use client';

import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import DrawingCanvasV2 from '@/components/toothfairy/app/drawing-canvas-v2';
import { getStoryById } from '@/data/stories';

const LATEST_DRAWING_KEY = 'toothfairy-latest-drawing';
const STORY_CONTEXT_KEY = 'tfn-story-context';
const LATEST_TRADITION_KEY = 'toothfairy-latest-tradition';
const DRAFT_PHOTO_KEY = 'toothfairy-draft-photo';

function normalizePhotoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image.'));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 1280;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Photo tools are not available on this device.'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.84));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('That photo could not be loaded.'));
    };
    img.src = objectUrl;
  });
}

type StoryContext = {
  traditionSlug: string;
  storyId: string;
  storyTitle: string;
};

export default function DrawPage() {
  const router = useRouter();
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const photoLibraryInputRef = useRef<HTMLInputElement | null>(null);
  const [storyContext, setStoryContext] = useState<StoryContext | null>(null);
  const [accentColor, setAccentColor] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);

  // Read story context on mount. We never trust URL params alone because
  // Phantom mobile deep-link redirects strip query strings — localStorage
  // is the source of truth.
  useEffect(() => {
    try {
      const savedPhoto = sessionStorage.getItem(DRAFT_PHOTO_KEY);
      if (savedPhoto?.startsWith('data:image/')) setPhoto(savedPhoto);

      const raw = localStorage.getItem(STORY_CONTEXT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoryContext;
      if (!parsed?.traditionSlug || !parsed?.storyTitle) return;
      setStoryContext(parsed);
      // Pipe the tradition into the enhance pipeline too so the fairy
      // enhancement picks up the cultural flavor automatically.
      try {
        localStorage.setItem(LATEST_TRADITION_KEY, parsed.traditionSlug);
      } catch {
        // ignore
      }
      // Look up accent color from story metadata
      const story = getStoryById(parsed.traditionSlug);
      if (story) setAccentColor(story.colors?.accent || story.color);
    } catch {
      // Corrupt JSON — ignore and proceed without a banner
    }
  }, []);

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setPhotoMessage('Preparing photo...');
    try {
      const normalized = await normalizePhotoFile(file);
      setPhoto(normalized);
      try { sessionStorage.setItem(DRAFT_PHOTO_KEY, normalized) } catch {}
      setPhotoMessage('Photo ready');
      window.setTimeout(() => setPhotoMessage(null), 1400);
    } catch (err) {
      setPhotoMessage(
        err instanceof Error ? err.message : 'That photo could not be loaded.'
      );
    }
  };

  const handleDone = (dataUrl: string) => {
    try { localStorage.setItem(LATEST_DRAWING_KEY, dataUrl) } catch {}
    try { sessionStorage.setItem(LATEST_DRAWING_KEY, dataUrl) } catch {}
    try { sessionStorage.removeItem(DRAFT_PHOTO_KEY) } catch {}
    router.push('/toothfairy/app/draw/preview');
  };

  const handleBack = () => {
    router.replace('/toothfairy');
  };

  return (
    <>
      {storyContext && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 60,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: accentColor
              ? `${accentColor}22`
              : 'oklch(72% 0.145 75 / 0.15)',
            borderBottom: `1px solid ${accentColor || 'oklch(72% 0.145 75 / 0.35)'}`,
            color: 'oklch(30% 0.035 65)',
            // Matches tfn app layout font var; fallback kept conservative.
            fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
            // Responsive micro-copy — 12px baseline, nudges up on wider viewports.
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            letterSpacing: '0.01em',
            textAlign: 'center',
          }}
        >
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: accentColor || 'oklch(72% 0.145 75)',
            }}
          />
          <span>
            Drawing a tooth for{' '}
            <strong style={{ fontWeight: 600 }}>
              {storyContext.storyTitle}
            </strong>
          </span>
        </div>
      )}
      <input
        ref={photoLibraryInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        style={{ display: 'none' }}
        tabIndex={-1}
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoChange}
        style={{ display: 'none' }}
        tabIndex={-1}
      />
      {photoMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            left: 16,
            right: 16,
            bottom: 'calc(env(safe-area-inset-bottom) + 18px)',
            zIndex: 120,
            pointerEvents: 'none',
            margin: '0 auto',
            maxWidth: 360,
            padding: '10px 14px',
            borderRadius: 999,
            background: 'oklch(97.5% 0.01 80)',
            border: '1px solid oklch(88% 0.015 75)',
            color: 'oklch(42% 0.03 65)',
            fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
            fontSize: 13,
            textAlign: 'center',
            boxShadow: '0 10px 34px oklch(30% 0.035 65 / 0.12)',
          }}
        >
          {photoMessage}
        </div>
      )}
      <DrawingCanvasV2
        onDone={handleDone}
        onBack={handleBack}
        initialBackground={photo}
        topAction={
          <div
            className="photo-action-pill flex items-center justify-end"
            style={{
              gap: 4,
              padding: 4,
              borderRadius: 18,
              background: 'oklch(99% 0.006 82 / 0.75)',
              border: '1px solid oklch(88% 0.015 75)',
              boxShadow: '0 8px 20px oklch(30% 0.035 65 / 0.08)',
            }}
          >
            <button
              type="button"
              onClick={() => photoLibraryInputRef.current?.click()}
              aria-label={photo ? 'Choose a different tooth photo' : 'Choose a tooth photo'}
              title="Choose photo"
              className="photo-action-button flex items-center justify-center active:scale-95"
              style={{
                width: 56,
                height: 44,
                flexDirection: 'column',
                gap: 1,
                borderRadius: 14,
                background: 'transparent',
                border: 'none',
                color: 'oklch(30% 0.035 65)',
                fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
                fontSize: 9,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="14"
                  rx="2.4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle cx="9" cy="10" r="1.6" fill="currentColor" />
                <path
                  d="M6.8 17l4.2-4.4 2.8 2.8 1.6-1.7 3.8 3.3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Photo</span>
            </button>
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              aria-label={photo ? 'Take a new tooth photo' : 'Take a tooth photo'}
              title="Take photo"
              className="photo-action-button flex items-center justify-center active:scale-95"
              style={{
                width: 56,
                height: 44,
                flexDirection: 'column',
                gap: 1,
                borderRadius: 14,
                background: photo
                  ? 'oklch(72% 0.145 75 / 0.15)'
                  : 'transparent',
                border: `1.5px solid ${
                  photo ? 'oklch(72% 0.145 75)' : 'transparent'
                }`,
                color: photo ? 'oklch(72% 0.145 75)' : 'oklch(30% 0.035 65)',
                fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
                fontSize: 9,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4.5 8.5h3l1.4-2h6.2l1.4 2h3a1.8 1.8 0 0 1 1.8 1.8v7.4a1.8 1.8 0 0 1-1.8 1.8h-15a1.8 1.8 0 0 1-1.8-1.8v-7.4a1.8 1.8 0 0 1 1.8-1.8Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="14"
                  r="3.4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              <span>Camera</span>
            </button>
          </div>
        }
      />
    </>
  );
}
