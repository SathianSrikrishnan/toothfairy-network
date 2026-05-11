import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const resultPage = readFileSync('src/app/toothfairy/app/draw/result/page.tsx', 'utf8');
const previewPage = readFileSync('src/app/toothfairy/app/draw/preview/page.tsx', 'utf8');
const appPage = readFileSync('src/app/toothfairy/app/page.tsx', 'utf8');

test('keeping a Magic Studio result stores a main-app handoff state', () => {
  assert.match(resultPage, /const FLOW_STORAGE_KEY = ['"]tfn-flow-state['"]/);
  assert.match(resultPage, /const flowState = JSON\.stringify/);
  assert.match(resultPage, /localStorage\.setItem\(FLOW_STORAGE_KEY,\s*flowState\)/);
  assert.match(resultPage, /sessionStorage\.setItem\(FLOW_STORAGE_KEY,\s*flowState\)/);
  assert.match(resultPage, /previewImage:\s*finalImage/);
  assert.match(resultPage, /fromMagicStudio:\s*true/);
  assert.match(resultPage, /step:\s*['"]setup['"]/);
});

test('Magic result page survives photo-backed canvas localStorage eviction', () => {
  assert.match(resultPage, /sessionStorage\.getItem\(LATEST_DRAWING_KEY\)/);
  assert.match(resultPage, /localStorage\.getItem\(FINAL_DRAWING_KEY\)/);
  assert.doesNotMatch(resultPage, /if \(!original \|\| !selected\)/);
  assert.match(resultPage, /if \(!selected\)/);
});

test('Magic Studio keeps a visible progress status during long multi-style runs', () => {
  assert.match(previewPage, /aria-live=["']polite["']/);
  assert.match(previewPage, /role=["']status["']/);
  assert.match(previewPage, /Magic is still working/);
  assert.match(previewPage, /enhanceState\.kind === ['"]loading['"]/);
});

test('Magic Studio loading state gives families an animated Tanda moment', () => {
  assert.match(previewPage, /Tanda is adding magic/);
  assert.match(previewPage, /aria-label=["']Tanda is adding magic["']/);
  assert.match(previewPage, /tfnMagicDust/);
  assert.match(previewPage, /tfnMagicOrbit/);
});

test('main app treats Magic Studio artwork as already-created art', () => {
  assert.match(appPage, /const FINAL_DRAWING_KEY = ['"]toothfairy-final-drawing['"]/);
  assert.match(appPage, /function hasSelectedArtworkHandoff/);
  assert.match(appPage, /setMagicArtworkReady\(hasSelectedArtworkHandoff/);
  assert.match(appPage, /sessionStorage\.getItem\(FINAL_DRAWING_KEY\)/);
  assert.doesNotMatch(appPage, /localStorage\.getItem\(LATEST_DRAWING_KEY\)/);
});

test('main app uses a simplified details page after Magic Studio', () => {
  assert.match(appPage, /Who is this keepsake for\?/);
  assert.doesNotMatch(appPage, /Save the tooth moment/);
  assert.doesNotMatch(appPage, /ProductPromiseCard/);
  assert.match(appPage, /Optional child photo/);
  assert.match(appPage, /This is optional and can be added later/);
});

test('main app no longer contains the legacy in-page drawing workflow', () => {
  assert.doesNotMatch(appPage, /step === ["']create["']/);
  assert.doesNotMatch(appPage, /The portrait/);
  assert.doesNotMatch(appPage, /Make it theirs/);
  assert.doesNotMatch(appPage, /DrawingCanvas/);
});

test('auth redirects preserve the Magic Studio handoff', () => {
  assert.match(appPage, /fromMagicStudio:\s*magicArtworkReady/);
  assert.match(appPage, /previewImage/);
});
