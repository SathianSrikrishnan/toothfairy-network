import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const appPage = readFileSync('src/app/toothfairy/app/page.tsx', 'utf8');
const giftPage = readFileSync('src/app/toothfairy/app/gift/[milestone]/page.tsx', 'utf8');
const drawCanvas = readFileSync('src/components/toothfairy/app/drawing-canvas-v2.tsx', 'utf8');
const magicPreview = readFileSync('src/app/toothfairy/app/draw/preview/page.tsx', 'utf8');

test('post-mint page is a simple receipt before gift setup', () => {
  assert.match(appPage, /showGiftPanel/);
  assert.match(appPage, /Memory saved\. Share first\./);
  assert.match(appPage, /Open the memory/);
  assert.match(appPage, /Advanced gift setup/);
  assert.match(appPage, /Gift setup is optional/);
  assert.doesNotMatch(appPage, /Share now, or add a first gift\./);
  assert.doesNotMatch(appPage, /When should the first gift unlock\?/);
});

test('mint wait state feels like Tooth Fairy Network instead of a blank delay', () => {
  assert.match(appPage, /Tanda is filing this memory/);
  assert.match(appPage, /Saving the artwork/);
  assert.match(appPage, /Opening the family link/);
});

test('gift page keeps card gifts paused and optional', () => {
  assert.match(giftPage, /Card gifts open soon/);
  assert.match(giftPage, /aria-label="Card gift checkout coming soon"/);
  assert.match(giftPage, /Provider checkout is in final review/);
  assert.match(giftPage, /Memory first\. Gifts optional\./);
  assert.match(giftPage, /Advanced wallet test gift/);
  assert.doesNotMatch(giftPage, /payment verification, receipts/);
});

test('draw page has a small header attached to the canvas moment', () => {
  assert.doesNotMatch(drawCanvas, /Tiny tooth memory/);
  assert.match(drawCanvas, /Start with a photo or draw anything/);
  assert.doesNotMatch(drawCanvas, /enhance next/);
  assert.match(drawCanvas, /width:\s*min\(92vw, 720px\)/);
  assert.match(drawCanvas, /overflowY:\s*['"]auto['"]/);
});

test('Magic Studio explains starter credits without a purchase flow yet', () => {
  assert.match(magicPreview, /3 starter credits per parent account/);
  assert.match(magicPreview, /More credit bundles are coming soon/);
});
