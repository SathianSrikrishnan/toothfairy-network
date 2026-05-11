import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const checks = []
const test = (name, fn) => checks.push([name, fn])

test("server-funded card deposits stay disabled while on-ramp remains proof-only", () => {
  const serverDeposit = read("src/app/api/toothfairy/server-deposit/route.ts")
  const onramp = read("src/app/api/toothfairy/onramp/route.ts")

  assert.match(serverDeposit, /Card gifts are not enabled yet/)
  assert.doesNotMatch(serverDeposit, /program\.methods\s*\.\s*deposit/)
  assert.doesNotMatch(serverDeposit, /TFN_MINT_SECRET_KEY/)

  assert.match(onramp, /on-ramp proof only/i)
  assert.doesNotMatch(onramp, /program\.methods\s*\.\s*deposit/)
  assert.doesNotMatch(onramp, /sessionToken/)
  assert.doesNotMatch(onramp, /serverWallet/)
})

test("operational, admin, and email endpoints require internal authorization", () => {
  const guardedRoutes = [
    "src/app/api/toothfairy/health/route.ts",
    "src/app/api/toothfairy/escrow-viewer/route.ts",
    "src/app/api/toothfairy/welcome-email/route.ts",
    "src/app/api/toothfairy/deposit-email/route.ts",
  ]

  for (const route of guardedRoutes) {
    assert.match(read(route), /requireToothFairyAdminRequest/, route)
  }
})

test("cookie-backed parent data route is explicitly dynamic", () => {
  const myChildren = read("src/app/api/toothfairy/my-children/route.ts")

  assert.match(myChildren, /export const dynamic = "force-dynamic"/)
  assert.match(myChildren, /request\.cookies/)
})

test("homepage does not link to unpublished Japan or Korea story pages", () => {
  const homepage = `${read("src/app/toothfairy/page.tsx")}\n${read("src/components/toothfairy/home/tanda-live-ritual-hero.tsx")}`

  assert.doesNotMatch(homepage, /\/toothfairy\/story\/japan/)
  assert.doesNotMatch(homepage, /\/toothfairy\/story\/korea/)
})

test("homepage keeps the top nav simple and uses a real minted memory preview", () => {
  const homepage = read("src/components/toothfairy/home/tanda-live-ritual-hero.tsx")
  const header = read("src/components/toothfairy/nav/tfn-header.tsx")

  assert.doesNotMatch(header, /label:\s*"FAQ"/)
  assert.match(header, /label:\s*"Stories"/)
  assert.match(header, /label:\s*"How it works"/)
  assert.doesNotMatch(header, /label:\s*"Safety"/)
  assert.match(homepage, /gateway\.irys\.xyz\/Z9_aFKhX6xpU1cZvw0h4u3zfJwhfJ1wiBf72KQWGF5k/)
  assert.match(homepage, /className=\{styles\.memoryArt\}/)
  assert.doesNotMatch(homepage, /nft-keepsake-v1\.png/)
})

test("public create entry points start in the new Magic Studio draw flow", () => {
  const homepage = read("src/components/toothfairy/home/tanda-live-ritual-hero.tsx")
  const storyPlayer = read("src/components/toothfairy/story/StoryPlayer.tsx")
  const storySelector = read("src/components/toothfairy/story/StorySelector.tsx")
  const appPage = read("src/app/toothfairy/app/page.tsx")
  const magicPreview = read("src/app/toothfairy/app/draw/preview/page.tsx")
  const publicCreateFiles = [
    "src/app/toothfairy/about/page.tsx",
    "src/app/toothfairy/faq/page.tsx",
    "src/app/toothfairy/grandparents/page.tsx",
    "src/app/toothfairy/smile-fund/page.tsx",
    "src/app/toothfairy/keepsake/preview/page.tsx",
    "src/components/toothfairy/nav/tfn-header.tsx",
    "src/components/toothfairy/nav/tfn-footer.tsx",
    "src/lib/toothfairy/email-templates.ts",
  ]
  const storyData = [
    "src/data/stories/tanda.ts",
    "src/data/stories/viking-origin.ts",
    "src/data/stories/ratoncito-perez.ts",
    "src/data/stories/cherokee.ts",
    "src/data/stories/korea.ts",
    "src/data/stories/jamaica.ts",
    "src/data/stories/babylonia.ts",
    "src/data/stories/romania.ts",
    "src/data/stories/italy.ts",
    "src/data/stories/ethiopia.ts",
    "src/data/stories/japan.ts",
    "src/data/stories/finland.ts",
    "src/data/stories/ireland.ts",
    "src/data/stories/north-africa.ts",
    "src/data/stories/tooth-fairy.ts",
  ]

  assert.match(homepage, /\/toothfairy\/app\/draw\?from=home/)
  assert.match(storySelector, /\/toothfairy\/app\/draw\?from=story-selector/)
  assert.match(storyPlayer, /drawHrefForStory/)
  assert.match(storyPlayer, /\/toothfairy\/app\/draw\?from=story&slug=/)
  assert.match(storyPlayer, /saveStoryContext\(story\)/)
  assert.match(appPage, /router\.replace\("\/toothfairy\/app\/draw\?from=app"\)/)
  assert.match(magicPreview, /Use original drawing/)

  for (const file of publicCreateFiles) {
    const source = read(file)
    assert.doesNotMatch(source, /href=["']\/toothfairy\/app["']/, file)
    assert.match(source, /\/toothfairy\/app\/draw\?from=/, file)
  }

  for (const file of storyData) {
    const source = read(file)
    assert.doesNotMatch(source, /choiceHref:\s*'\/toothfairy\/app'/, file)
  }
})

test("published full-frame stories support left-right surface navigation", () => {
  const storyPlayer = read("src/components/toothfairy/story/StoryPlayer.tsx")

  assert.match(storyPlayer, /handleReaderSurfaceClick/)
  assert.match(storyPlayer, /clientX < window\.innerWidth \/ 2/)
  assert.match(storyPlayer, /closest\('a, button, input, textarea, select, \[role="button"\]'\)/)
  assert.match(storyPlayer, /onClick=\{handleReaderSurfaceClick\}/)
})

test("preview page uses the latest real minted memory instead of static sample copy", () => {
  const preview = read("src/app/toothfairy/keepsake/preview/page.tsx")

  assert.match(preview, /D2KhUfrDSs6ejGcfNEXfaYQMxPz4SH5Rd87h9ZUsGMSa/)
  assert.match(preview, /5MqKjoYrB96GubwaIZ48NqUGvvstgyVGsNHgsnRDe1s/)
  assert.match(preview, /William Wallace/)
  assert.match(preview, /robot dog/)
  assert.match(preview, /Live preview/)
  assert.match(preview, /parent control/i)
  assert.match(preview, /Example Smile Fund gift/i)
  assert.doesNotMatch(preview, /0\.05 SOL/)
  assert.doesNotMatch(preview, /This is what Timmy got/)
  assert.doesNotMatch(preview, /The page should not feel like an NFT pitch/)
})

test("gift flow is clear that card gifts are paused", () => {
  const giftPage = read("src/app/toothfairy/app/gift/[milestone]/page.tsx")
  const mintPage = read("src/app/toothfairy/app/page.tsx")

  assert.match(giftPage, /Card gifts are paused/)
  assert.match(giftPage, /Card gifts open soon/)
  assert.match(giftPage, /Provider checkout is in final review/)
  assert.match(giftPage, /Advanced wallet test gift/)
  assert.match(mintPage, /Card gifts are paused/)
  assert.doesNotMatch(giftPage, /Use Solana wallet/)
  assert.doesNotMatch(giftPage, /MoonPay/)
  assert.doesNotMatch(mintPage, /MoonPay/)
})

test("wallet gift receipts are sent only after server-side transaction verification", () => {
  const giftPage = read("src/app/toothfairy/app/gift/[milestone]/page.tsx")
  const receiptRoute = read("src/app/api/toothfairy/gift-receipt/route.ts")

  assert.match(giftPage, /\/api\/toothfairy\/gift-receipt/)
  assert.match(giftPage, /txSignature/)
  assert.doesNotMatch(giftPage, /x-tfn-admin-secret/)
  assert.match(receiptRoute, /isAllowedOrigin/)
  assert.match(receiptRoute, /getParsedTransaction|getTransaction/)
  assert.match(receiptRoute, /program\.account\.deposit\.all/)
  assert.match(receiptRoute, /tfn_children/)
  assert.match(receiptRoute, /renderGiftReceivedEmail/)
  assert.match(receiptRoute, /RESEND_API_KEY/)
  assert.doesNotMatch(receiptRoute, /requireToothFairyAdminRequest/)
})

test("AI polish remains visible unless it is explicitly disabled", () => {
  const drawingCanvas = read("src/components/toothfairy/app/drawing-canvas.tsx")

  assert.match(drawingCanvas, /NEXT_PUBLIC_TFN_ENABLE_AI_ENHANCE/)
  assert.match(drawingCanvas, /!==\s*"false"/)
  assert.match(drawingCanvas, /MAGIC_POLISH_ENABLED &&/)
  assert.match(drawingCanvas, /: "Magic polish"/)
  assert.doesNotMatch(drawingCanvas, /Magic polish \(\$\{enhanceRemaining\}\)/)
})

test("AI polish preserves parent-drawn marks over the provider image", () => {
  const drawingCanvas = read("src/components/toothfairy/app/drawing-canvas.tsx")
  const overlayHelper = read("src/lib/toothfairy/canvas-overlay.ts")

  assert.match(overlayHelper, /createChangedPixelOverlay/)
  assert.match(overlayHelper, /overlay\.data\[i \+ 3\] = 0/)
  assert.match(drawingCanvas, /baseCanvasSnapshotRef/)
  assert.match(drawingCanvas, /createChangedPixelOverlay/)
  assert.match(drawingCanvas, /manualOverlay/)
  assert.match(drawingCanvas, /ctx\.drawImage\(manualOverlay/)
  assert.match(drawingCanvas, /let enhancedBaseSnapshot: ImageData \| null = null/)
  assert.match(drawingCanvas, /enhancedBaseSnapshot = ctx\.getImageData/)
  assert.match(drawingCanvas, /baseCanvasSnapshotRef\.current = enhancedBaseSnapshot/)
  assert.match(drawingCanvas, /catch\s*\{/)
})

test("drawing palette includes launch-safe yellow and green options", () => {
  const drawingCanvas = read("src/components/toothfairy/app/drawing-canvas.tsx")

  assert.match(drawingCanvas, /#f5c84c/i)
  assert.match(drawingCanvas, /#22a06b/i)
  assert.match(drawingCanvas, /#ef476f/i)
  assert.match(drawingCanvas, /parentColorNames/)
  assert.match(drawingCanvas, /isParent \? PC\.text/)
})

test("dashboard and public recovery are Google-first for returning parents", () => {
  const dashboard = read("src/app/toothfairy/app/dashboard/page.tsx")
  const recover = read("src/app/toothfairy/recover/page.tsx")
  const walletRecover = read("src/app/toothfairy/app/recover/page.tsx")

  assert.match(dashboard, /Continue with Google/)
  assert.match(dashboard, /\/api\/auth\/google\?next=/)
  assert.match(recover, /Continue with Google/)
  assert.match(recover, /\/api\/auth\/google\?next=/)
  assert.match(recover, /same Google account/i)
  assert.match(recover, /Gmail/i)
  assert.match(recover, /inbox/i)
  assert.match(recover, /Returning parents/i)
  assert.match(recover, /Most families can start with Google/i)
  assert.match(recover, /optional/i)
  assert.match(recover, /family memory link/i)
  assert.match(recover, /support/i)
  assert.match(walletRecover, /Advanced wallet fallback/i)
  assert.match(walletRecover, /same Google account/i)
  assert.match(walletRecover, /No memories found/i)
  assert.doesNotMatch(recover, /non-crypto parents/i)
  assert.doesNotMatch(recover, /smart contract/i)
  assert.doesNotMatch(recover, /crypto wallet is encouraged/i)
  assert.doesNotMatch(recover, /Find keepsakes/)
  assert.doesNotMatch(recover, /keepsake\/preview/)
  assert.doesNotMatch(recover, /View sample keepsake/)
  assert.doesNotMatch(walletRecover, /Connect Wallet/)
  assert.doesNotMatch(walletRecover, /Parent-controlled wallet access/)
  assert.doesNotMatch(walletRecover, /keepsake/i)
})

test("Google auth and mint flow send the core parent emails", () => {
  const googleCallback = read("src/app/api/auth/google/callback/route.ts")
  const authCallback = read("src/app/api/auth/callback/route.ts")
  const mintRoute = read("src/app/api/toothfairy/mint/route.ts")
  const welcomeEmail = read("src/app/api/toothfairy/welcome-email/route.ts")
  const depositEmail = read("src/app/api/toothfairy/deposit-email/route.ts")
  const emailTemplates = read("src/lib/toothfairy/email-templates.ts")

  assert.match(googleCallback, /welcome-email/)
  assert.match(googleCallback, /internalToothFairyHeaders/)
  assert.match(authCallback, /welcome-email/)
  assert.match(mintRoute, /renderMemoryCreatedEmail/)
  assert.match(welcomeEmail, /renderWelcomeEmail/)
  assert.match(depositEmail, /renderGiftReceivedEmail/)
  assert.match(emailTemplates, /renderWelcomeEmail/)
  assert.match(emailTemplates, /renderMemoryCreatedEmail/)
  assert.match(emailTemplates, /renderGiftReceivedEmail/)
  assert.match(emailTemplates, /escapeHtml/)
  assert.match(emailTemplates, /\/toothfairy\/recover/)
  assert.match(emailTemplates, /same Google account/i)
  assert.match(emailTemplates, /Share the memory first/i)
  assert.match(emailTemplates, /gift receipt/i)
  assert.match(emailTemplates, /not investment advice/i)
  assert.doesNotMatch(emailTemplates, /payment path is ready/i)
})

test("auth redirect targets are sanitized before OAuth state or callback redirect", () => {
  const googleRoute = read("src/app/api/auth/google/route.ts")
  const googleCallback = read("src/app/api/auth/google/callback/route.ts")
  const authCallback = read("src/app/api/auth/callback/route.ts")
  const authRedirect = read("src/lib/toothfairy/auth-redirect.ts")

  assert.match(googleRoute, /safeAuthRedirectPath/)
  assert.match(googleCallback, /safeAuthRedirectUrl/)
  assert.match(authCallback, /safeAuthRedirectUrl/)
  assert.match(authRedirect, /isTfnDomain \? "\/app\/draw" : "\/toothfairy\/app\/draw"/)
  assert.doesNotMatch(googleCallback, /new URL\(next,\s*origin\)/)
  assert.doesNotMatch(authCallback, /new URL\(next,\s*origin\)/)
})

test("footer email signup is wired to the subscribe endpoint", () => {
  const footer = read("src/components/toothfairy/nav/tfn-footer.tsx")

  assert.match(footer, /fetch\("\/api\/subscribe"/)
  assert.match(footer, /source:\s*"tfn-footer"/)
})

test("parent-facing copy leads with Toothlight memory instead of bank language", () => {
  const homepage = read("src/components/toothfairy/home/tanda-live-ritual-hero.tsx")
  const footer = read("src/components/toothfairy/nav/tfn-footer.tsx")
  const keepsake = read("src/app/toothfairy/keepsake/[id]/page.tsx")
  const smileFund = read("src/app/toothfairy/smile-fund/page.tsx")
  const productLanguage = read("docs/archive/launch-readiness/tfn-product-language.md")
  const currentState = read("docs/archive/launch-readiness/tfn-current-state.md")

  assert.match(homepage, /a Toothlight they can grow into/i)
  assert.match(homepage, /Toothlight/i)
  assert.match(homepage, /Save the tooth story, drawing, and family note/i)
  assert.match(homepage, /The Smile Fund can come later/i)
  assert.match(homepage, /Save for later/i)
  assert.match(homepage, /A tiny ritual\./i)
  assert.match(homepage, /Then a memory parents control/i)
  assert.match(homepage, /href="#how-it-works"/)
  assert.match(homepage, /id="how-it-works"/)
  assert.match(homepage, /The first shelf/)
  assert.match(homepage, /Start with Tanda, then meet the keepers around the world/)
  assert.doesNotMatch(homepage, /Opening trilogy/)
  assert.doesNotMatch(homepage, /Three bedtime stories open the storybook layer/)
  assert.doesNotMatch(homepage, /your child's first digital wallet/i)
  assert.doesNotMatch(homepage, /Parents control the wallet, the timing, and the family link/i)
  assert.doesNotMatch(homepage, /Built on Solana/i)
  assert.match(homepage, /s1-frame-01-cover\.png/)
  assert.match(homepage, /s2-frame-01-cover-v3\.png/)
  assert.match(homepage, /rp3-frame-01-two-doors\.png/)
  assert.match(homepage, /href="\/toothfairy\/stories"/)
  assert.doesNotMatch(homepage, /styles\.heroCues/)
  assert.match(footer, /A tiny ritual\. A memory parents control/)
  assert.match(keepsake, /first forever memory/i)
  assert.match(smileFund, /Smile Fund/)
  assert.match(keepsake, /Loading memory/)
  assert.match(productLanguage, /Parent Language/)
  assert.match(productLanguage, /Magical Language/)
  assert.match(productLanguage, /Technical Language/)
  assert.match(productLanguage, /Tanda, Keeper of the Network/)
  assert.match(currentState, /tfn-launch-baseline-2026-05-08/)
  assert.match(currentState, /working Google and email flow validated end to end/i)
  assert.doesNotMatch(homepage, /Minted on Tooth Fairy Network/)
  assert.doesNotMatch(homepage, /Everything starts free/i)
  assert.doesNotMatch(homepage, /Free to try/i)
  assert.doesNotMatch(homepage, /Start free/i)
  assert.doesNotMatch(homepage, /SOL saved/)
  assert.doesNotMatch(keepsake, /Loading keepsake/)
  assert.doesNotMatch(keepsake, /SOL saved/)
  assert.doesNotMatch(homepage, /digital piggy bank/i)
  assert.doesNotMatch(footer, /digital piggy bank/i)
  assert.doesNotMatch(smileFund, /digital piggy bank/i)
})

test("FAQ explains the Smile Fund as responsibility education without investment advice", () => {
  const faq = read("src/app/toothfairy/faq/page.tsx")
  const smileFund = read("src/app/toothfairy/smile-fund/page.tsx")

  assert.match(faq, /FAQ/i)
  assert.match(faq, /first digital asset/i)
  assert.match(faq, /parent control around the edges/i)
  assert.match(faq, /Access is simple/i)
  assert.match(faq, /Gmail address connected to the parent account/i)
  assert.match(faq, /Gmail/i)
  assert.match(faq, /inbox/i)
  assert.match(faq, /claim it together when your child is ready/i)
  assert.match(faq, /learning and development/i)
  assert.match(faq, /turn a ritual into a lifetime journey/i)
  assert.match(faq, /responsibility/)
  assert.match(faq, /saving/)
  assert.match(faq, /patience/)
  assert.match(faq, /not investment advice/i)
  assert.match(faq, /AI polish/i)
  assert.match(faq, /masterpiece/i)
  assert.match(faq, /Children love/i)
  assert.match(faq, /gift receipt/i)
  assert.match(faq, /Continue with Google/i)
  assert.match(faq, /Card gifts are paused/i)
  assert.match(faq, /Photos, drawings, and story text/i)
  assert.match(faq, /enhance the artwork/i)
  assert.match(faq, /parent-controlled recovery/i)
  assert.match(faq, /not a bank/i)
  assert.doesNotMatch(faq, /crypto wallet/i)
  assert.doesNotMatch(faq, /plain-English/i)
  assert.doesNotMatch(faq, /non-crypto parent/i)
  assert.doesNotMatch(faq, /AI polish is optional/i)
  assert.doesNotMatch(faq, /blockchain/i)
  assert.doesNotMatch(faq, /smart contract/i)
  assert.doesNotMatch(faq, /self-sovereignty/i)
  assert.doesNotMatch(faq, /<details/)
  assert.doesNotMatch(faq, /email receipts, support language/)
  assert.match(smileFund, /responsibility/)
  assert.match(smileFund, /ownership matters/i)
  assert.doesNotMatch(smileFund, /self-sovereignty/)
  assert.doesNotMatch(smileFund, /practice portfolio/i)
  assert.doesNotMatch(smileFund, /investing vocabulary/i)
  assert.doesNotMatch(smileFund, /Understand What It Means to Invest/)
  assert.doesNotMatch(smileFund, /0\.05 SOL/)
  assert.match(smileFund, /Small Savings Add Up to Big Money/)
  assert.match(smileFund, /Young children and saving/)
  assert.match(smileFund, /Card-funded gifts are paused/i)
})

test("about page keeps technology quiet and parent-first", () => {
  const about = read("src/app/toothfairy/about/page.tsx")

  assert.match(about, /Toothlight memory/i)
  assert.match(about, /A lost tooth can teach care before money ever does/i)
  assert.match(about, /family/i)
  assert.match(about, /The first Toothlight memory is free/i)
  assert.match(about, /Parents set the pace/i)
  assert.match(about, /The tooth is the catalyst/i)
  assert.match(about, /parents/i)
  assert.match(about, /Save the memory for free/i)
  assert.match(about, /Card-funded gifts are paused/i)
  assert.doesNotMatch(about, /blockchain/i)
  assert.doesNotMatch(about, /Solana stays quiet/i)
  assert.doesNotMatch(about, /digital ownership/i)
  assert.doesNotMatch(about, /capital/i)
  assert.doesNotMatch(about, /inflation/i)
  assert.doesNotMatch(about, /hold their own wallet/i)
  assert.doesNotMatch(about, /Mint the memory/i)
  assert.doesNotMatch(about, /The value is not that the tooth disappears/i)
  assert.doesNotMatch(about, /not about making the moment expensive/i)
})

test("Resend launch email flows have a delivery and idempotency map", () => {
  const emailMap = read("docs/archive/launch-readiness/2026-05-06-resend-email-flow-map.md")

  assert.match(emailMap, /Welcome/i)
  assert.match(emailMap, /Memory created/i)
  assert.match(emailMap, /Gift receipt/i)
  assert.match(emailMap, /parent email/i)
  assert.match(emailMap, /Idempotency/i)
  assert.match(emailMap, /milestonePda/i)
  assert.match(emailMap, /txSignature/i)
  assert.match(emailMap, /RESEND_API_KEY/)
})

test("keepsake data can return stored smile photos", () => {
  const keepsakeData = read("src/lib/toothfairy/keepsake-data.ts")

  assert.match(keepsakeData, /smile_photo_url/)
  assert.doesNotMatch(keepsakeData, /smilePhotoUrl:\s*undefined/)
})

test("claiming a profile keeps the original child profile PDA", () => {
  const claimProfile = read("src/app/api/toothfairy/claim-profile/route.ts")

  assert.match(claimProfile, /child\.child_profile_pda/)
  assert.match(claimProfile, /childProfilePda:\s*childProfilePda\.toBase58\(\)/)
  assert.doesNotMatch(claimProfile, /newProfilePda/)
  assert.doesNotMatch(claimProfile, /newChildWallet/)
})

test("public sitemap and robots use the Tooth Fairy Network domain", () => {
  const sitemap = read("src/app/sitemap.ts")
  const robots = read("src/app/robots.ts")

  assert.match(sitemap, /https:\/\/toothfairy\.network/)
  assert.match(robots, /https:\/\/toothfairy\.network\/sitemap\.xml/)
  assert.doesNotMatch(sitemap, /https:\/\/sathian\.ai/)
  assert.doesNotMatch(robots, /https:\/\/sathian\.ai/)
})

test("draft animation work is excluded without removing live hero assets", () => {
  const vercelIgnore = read(".vercelignore")
  const homepage = read("src/app/toothfairy/page.tsx")

  assert.match(vercelIgnore, /src\/app\/animation\/tanda-hero-ritual\//)
  assert.match(vercelIgnore, /src\/app\/animation\/tanda-pose-pack\//)
  assert.match(vercelIgnore, /tools\//)
  assert.doesNotMatch(vercelIgnore, /^public\/toothfairy\/animation\/live-hero-v1\/?$/m)
  assert.doesNotMatch(vercelIgnore, /^src\/components\/toothfairy\/home\/?$/m)
  assert.doesNotMatch(homepage, /tanda-ritual-preview/)
  assert.doesNotMatch(homepage, /TandaRitualPreview/)
})

test("stories atlas reads as a child-facing bedtime story gateway", () => {
  const stories = read("src/app/toothfairy/stories/page.tsx")
  const grandparents = read("src/app/toothfairy/grandparents/page.tsx")
  const faq = read("src/app/toothfairy/faq/page.tsx")
  const smileFund = read("src/app/toothfairy/smile-fund/page.tsx")

  assert.match(stories, /Tooth Fairy Atlas/)
  assert.match(stories, /Seven keepers/)
  assert.match(stories, /Seven ways to make magic from a lost tooth/)
  assert.match(stories, /50\+[\s\S]*global traditions/)
  assert.match(stories, /bedtime stories/i)
  assert.match(stories, /Start here/)
  assert.match(stories, /Read the stories/)
  assert.match(stories, /Explore the atlas/)
  assert.match(stories, /Network origin/i)
  assert.match(stories, /Every tooth tradition opens a door to culture/)
  assert.match(stories, /More keepers are waiting on the next shelf/)
  assert.match(stories, /Meet the Collectors/)
  assert.match(stories, /s2-frame-03-maker\.png/)
  assert.match(stories, /rp-02-mouse\.png/)
  assert.match(stories, /kkachi-collector-card\.png/)
  assert.match(stories, /story-06-daga-site-portrait\.png/)
  assert.match(stories, /culture-strip/)
  assert.match(stories, /Finland/)
  assert.match(stories, /Nigeria/)
  assert.match(stories, /Germany/)
  assert.match(stories, /India/)
  assert.match(stories, /Malaysia/)
  for (const collector of [
    "Tanda",
    "Tanda's father",
    "Ratoncito Perez",
    "Kkachi",
    "Waraba",
    "Daga",
    "Anna Bogle",
  ]) {
    assert.match(stories, new RegExp(collector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
  }
  assert.doesNotMatch(stories, /Story 1/)
  assert.doesNotMatch(stories, /Begin here/)
  assert.doesNotMatch(stories, /The old forgetting/)
  assert.doesNotMatch(stories, /s2-ref-father-shipbuilder/)
  assert.doesNotMatch(stories, /char-perez\.jpg/)
  assert.doesNotMatch(stories, /vo-02-father\.png/)
  assert.doesNotMatch(stories, /s1-char-tanda-leader-sheet/)
  assert.doesNotMatch(stories, /char-kkachi\.png/)
  assert.doesNotMatch(stories, /char-daga\.png/)
  assert.doesNotMatch(stories, /allTraditionImages/)
  assert.doesNotMatch(stories, /filmstrip/)
  assert.doesNotMatch(stories, /gallery-count/)
  assert.doesNotMatch(stories, /First promise/)
  assert.doesNotMatch(stories, /Then the map widens/)
  assert.doesNotMatch(stories, /Romania/)
  assert.doesNotMatch(stories, /Netherlands/)
  assert.doesNotMatch(stories, /The atlas should feel like/)
  assert.doesNotMatch(stories, /Meet the keepers/)
  assert.doesNotMatch(stories, /Story shelf/)
  assert.doesNotMatch(stories, /Ask someone who remembers/)
  assert.doesNotMatch(stories, /grandparent-card/)
  assert.doesNotMatch(stories, /\/toothfairy\/grandparents/)
  assert.doesNotMatch(stories, /\/toothfairy\/faq/)
  assert.doesNotMatch(stories, /Bring in grandparents/)
  assert.doesNotMatch(stories, /Grandparents need/)
  assert.doesNotMatch(stories, /familyPrompt/)

  assert.match(grandparents, /Grandparents and family storytellers/)
  assert.match(grandparents, /read a story together/i)
  assert.match(grandparents, /Smile Fund/)
  assert.match(grandparents, /FAQ/)
  assert.doesNotMatch(grandparents, /investment advice/i)
  assert.doesNotMatch(grandparents, /crypto wallet/i)

  assert.match(faq, /grandparent/i)
  assert.match(smileFund, /grandparent/i)
})

let failures = 0

for (const [name, fn] of checks) {
  try {
    fn()
    console.log(`ok - ${name}`)
  } catch (error) {
    failures += 1
    console.error(`not ok - ${name}`)
    console.error(error.message)
  }
}

if (failures > 0) {
  process.exitCode = 1
}
