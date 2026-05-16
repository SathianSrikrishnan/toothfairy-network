import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import ts from 'typescript'

const storySource = fs.readFileSync(new URL('../src/data/stories/index.ts', import.meta.url), 'utf8')
const spineSource = fs.readFileSync(new URL('../src/data/toothfairy/network-spine.ts', import.meta.url), 'utf8')
const storyPageSource = fs.readFileSync(new URL('../src/app/toothfairy/story/page.tsx', import.meta.url), 'utf8')
const storiesIndexSource = fs.readFileSync(new URL('../src/app/toothfairy/stories/page.tsx', import.meta.url), 'utf8')
const storyPlayerSource = fs.readFileSync(
  new URL('../src/components/toothfairy/story/StoryPlayer.tsx', import.meta.url),
  'utf8',
)

function loadTsModule(source, filename) {
  const module = { exports: {} }
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText

  const require = (specifier) => {
    if (specifier === './types') return {}
    if (specifier.startsWith('./')) {
      const fileUrl = new URL(`../src/data/stories/${specifier.slice(2)}.ts`, import.meta.url)
      return loadTsModule(fs.readFileSync(fileUrl, 'utf8'), fileUrl.pathname)
    }
    throw new Error(`Unexpected require: ${specifier}`)
  }

  new Function('require', 'module', 'exports', output)(require, module, module.exports)
  return module.exports
}

const stories = loadTsModule(storySource, 'stories/index.ts')
const spine = loadTsModule(spineSource, 'toothfairy/network-spine.ts')

test('every live story has one open network door', () => {
  const liveIds = stories.LIVE_STORIES.map((story) => story.id).sort()
  const openIds = spine.openKeeperDoors.map((door) => door.storyId).sort()

  assert.deepEqual(openIds, liveIds)
})

test('future and contribution doors are clearly separated from live stories', () => {
  const liveIds = new Set(stories.LIVE_STORIES.map((story) => story.id))

  assert.ok(spine.futureKeeperDoors.length >= 7)
  assert.equal(spine.contributionDoor.status, 'unknown')
  assert.equal(spine.contributionDoor.id, 'family-missing-door')

  for (const door of spine.futureKeeperDoors) {
    assert.equal(door.status, 'listening')
    assert.equal(liveIds.has(door.storyId), false)
  }
})

test('network door image assets are present', () => {
  for (const door of spine.allNetworkDoors) {
    assert.ok(door.image.startsWith('/story-assets/'), `${door.id} should use a public story asset`)
    assert.ok(
      fs.existsSync(new URL(`../public${door.image}`, import.meta.url)),
      `${door.id} image missing: ${door.image}`,
    )
  }
})

test('story reader exits to the plural story map, not the retired selector', () => {
  assert.match(storyPageSource, /redirect\(['"]\/toothfairy\/stories['"]\)/)
  assert.doesNotMatch(storyPlayerSource, /href=["']\/toothfairy\/story["']/)
})

test('plural stories page uses the story-world gateway instead of the retired card selector', () => {
  assert.match(storiesIndexSource, /story-world-gateway-v1\.png/)
  assert.match(storiesIndexSource, /openKeeperDoors/)
  assert.match(storiesIndexSource, /futureKeeperDoors/)
  assert.doesNotMatch(storiesIndexSource, /Every culture tells the story differently/)
})
