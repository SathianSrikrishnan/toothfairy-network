import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const headerSource = readFileSync('src/components/toothfairy/nav/tfn-header.tsx', 'utf8');
const footerSource = readFileSync('src/components/toothfairy/nav/tfn-footer.tsx', 'utf8');
const drawLayoutSource = readFileSync('src/app/toothfairy/app/draw/layout.tsx', 'utf8');
const canvasSource = readFileSync('src/components/toothfairy/app/drawing-canvas-v2.tsx', 'utf8');

test('draw flow hides the marketing header and footer chrome', () => {
  assert.match(drawLayoutSource, /\.tfn-header,\s*\.tfn-footer/);
  assert.match(drawLayoutSource, /display:\s*none\s*!important/);
  assert.doesNotMatch(headerSource, /usePathname/);
  assert.doesNotMatch(footerSource, /usePathname/);
});

test('draw canvas owns the viewport above site chrome', () => {
  assert.match(canvasSource, /className="drawing-shell/);
  assert.match(canvasSource, /zIndex:\s*80/);
  assert.match(canvasSource, /height:\s*['"]100dvh['"]/);
  assert.match(canvasSource, /overscrollBehavior:\s*['"]contain['"]/);
});

test('draw shell permits phone scrolling outside the canvas', () => {
  assert.match(canvasSource, /touchAction:\s*['"]auto['"]/);
  assert.match(canvasSource, /touchAction:\s*['"]none['"]/);
});

test('draw canvas only captures touch gestures on the canvas itself', () => {
  assert.match(canvasSource, /className="drawing-canvas-area/);
  assert.match(canvasSource, /touchAction:\s*['"]auto['"]/);
  assert.match(canvasSource, /overflowY:\s*['"]auto['"]/);
  assert.match(canvasSource, /onTouchStart=\{onTouchStart\}/);
  assert.match(canvasSource, /onTouchMove=\{onTouchMove\}/);
  assert.match(canvasSource, /TOUCH_POINTER_ID/);
});

test('draw canvas avoids brittle short-phone viewport math', () => {
  assert.doesNotMatch(canvasSource, /calc\(100dvh - 350px\)/);
  assert.match(canvasSource, /overflowY:\s*['"]auto['"]/);
  assert.match(canvasSource, /WebkitOverflowScrolling:\s*['"]touch['"]/);
});

test('draw canvas has a compact short-phone layout', () => {
  assert.match(canvasSource, /@media \(max-width: 480px\) and \(max-height: 720px\)/);
  assert.match(canvasSource, /width:\s*min\(80vw, 330px, calc\(100svh - 140px\)\)/);
  assert.match(canvasSource, /\.drawing-prompt\s*\{\s*display:\s*none/);
});

test('draw canvas does not reject normal zero-pressure finger touches', () => {
  assert.doesNotMatch(canvasSource, /pressure\s*===\s*0/);
});

test('draw controls stay reachable on narrow phones', () => {
  assert.match(canvasSource, /className="drawing-toolbar/);
  assert.match(canvasSource, /className="color-row/);
  assert.match(canvasSource, /overflow-x:\s*auto/);
  assert.match(canvasSource, /header-done/);
  assert.match(canvasSource, /@media \(max-width: 540px\)/);
  assert.doesNotMatch(canvasSource, /max-height:\s*44dvh/);
});

test('phone layout keeps colors and done in visible fixed rows', () => {
  assert.match(canvasSource, /\.mobile-scroll-cue/);
  assert.match(canvasSource, /\.phone-done-anchor/);
  assert.match(canvasSource, /\.header-done/);
  assert.match(canvasSource, /\.drawing-control-row/);
  assert.match(canvasSource, /\.action-group/);
  assert.doesNotMatch(canvasSource, /className="drawing-done/);
  assert.doesNotMatch(canvasSource, /I&apos;m done drawing/);
  assert.match(canvasSource, /flex-wrap:\s*nowrap\s*!important/);
  assert.match(canvasSource, /width:\s*min\(84vw, 380px, calc\(100svh - 150px\)\)/);
  assert.match(canvasSource, /padding-bottom:\s*max\(0\.35rem, env\(safe-area-inset-bottom\)\)/);
  assert.match(canvasSource, /height:\s*100svh\s*!important/);
  assert.match(canvasSource, /overflow:\s*hidden\s*!important/);
});

test('draw prompt uses photo and imagination copy without the old eyebrow', () => {
  assert.doesNotMatch(canvasSource, /Tiny tooth memory/);
  assert.match(canvasSource, /Start with a photo or your imagination/);
  assert.match(canvasSource, /Draw anything you want to enhance next/);
});

test('draw page exposes photo capture and passes it into the V2 canvas', () => {
  const drawPageSource = readFileSync('src/app/toothfairy/app/draw/page.tsx', 'utf8');
  assert.match(drawPageSource, /type=['"]file['"]/);
  assert.match(drawPageSource, /accept=['"]image\/\*['"]/);
  assert.match(drawPageSource, /capture=['"]environment['"]/);
  assert.match(drawPageSource, /photoLibraryInputRef/);
  assert.match(drawPageSource, /Choose a tooth photo/);
  assert.match(drawPageSource, /Take a tooth photo/);
  assert.match(drawPageSource, /photo-action-pill/);
  assert.match(drawPageSource, /photo-action-button/);
  assert.match(drawPageSource, /initialBackground=\{photo\}/);
  assert.match(drawPageSource, /pointerEvents:\s*['"]none['"]/);
});
