import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const toothfairyLayout = readFileSync('src/app/toothfairy/layout.tsx', 'utf8');
const keepsakeLayout = readFileSync(
  'src/app/toothfairy/keepsake/[id]/layout.tsx',
  'utf8'
);
const keepsakeOgImage = readFileSync(
  'src/app/toothfairy/keepsake/[id]/opengraph-image.tsx',
  'utf8'
);

test('Tooth Fairy metadata points messaging previews at a real root OG image', () => {
  assert.match(
    toothfairyLayout,
    /metadataBase:\s*new URL\(['"]https:\/\/toothfairy\.network['"]\)/
  );
  assert.match(
    toothfairyLayout,
    /const siteImage = ['"]\/toothfairy\/opengraph-image['"]/
  );
  assert.match(toothfairyLayout, /url:\s*siteImage/);
  assert.match(toothfairyLayout, /twitter:\s*{/);
  assert.match(toothfairyLayout, /card:\s*['"]summary_large_image['"]/);
  assert.ok(existsSync('src/app/toothfairy/opengraph-image.tsx'));
});

test('keepsake metadata is child-specific and uses the keepsake OG image route', () => {
  assert.match(keepsakeLayout, /generateMetadata/);
  assert.match(keepsakeLayout, /getKeepsakeData/);
  assert.match(keepsakeLayout, /\$\{childName\}'s tooth memory/);
  assert.match(
    keepsakeLayout,
    /const imageUrl = `\/toothfairy\/keepsake\/\$\{params\.id\}\/opengraph-image`/
  );
  assert.match(keepsakeLayout, /url:\s*imageUrl/);
  assert.match(keepsakeLayout, /twitter:\s*{/);
  assert.match(keepsakeLayout, /summary_large_image/);
});

test('keepsake OG image avoids unsupported color syntax that can blank social cards', () => {
  assert.doesNotMatch(keepsakeOgImage, /oklch\(/);
  assert.match(keepsakeOgImage, /#[0-9A-Fa-f]{6}/);
});
