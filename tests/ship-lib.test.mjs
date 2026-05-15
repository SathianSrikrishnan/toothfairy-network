import test from "node:test"
import assert from "node:assert/strict"

import {
  buildDraftBody,
  checksArePassing,
  extractPreviewUrls,
  isNoPullRequestFoundError,
  isProtectedBranch,
  parseArgs,
} from "../scripts/ship-lib.mjs"

test("identifies protected branches", () => {
  assert.equal(isProtectedBranch("main"), true)
  assert.equal(isProtectedBranch("master"), true)
  assert.equal(isProtectedBranch("production"), true)
  assert.equal(isProtectedBranch("codex/homepage-polish"), false)
})

test("parses flags and positional args", () => {
  assert.deepEqual(
    parseArgs(["--title", "Homepage polish", "--skip-build", "--body=Short body", "extra"]),
    {
      _: ["extra"],
      title: "Homepage polish",
      "skip-build": true,
      body: "Short body",
    },
  )
})

test("builds a useful default draft PR body", () => {
  const body = buildDraftBody({
    branch: "codex/homepage-polish",
    userBody: "",
  })

  assert.match(body, /Branch: `codex\/homepage-polish`/)
  assert.match(body, /Do not merge until the preview has been reviewed/)
})

test("extracts Vercel preview URLs and ignores non-preview links", () => {
  const urls = extractPreviewUrls([
    {
      body: "Deployment is ready: [Preview](https://sathian-ai-git-codex-homepage-sathiansrikrishnans-projects.vercel.app)",
    },
    {
      body: "Docs: https://vercel.com/docs and production https://sathian.ai",
    },
    {
      body: "Feedback: https://vercel.live/open-feedback/sathian-ai-git-codex-homepage-sathiansrikrishnans-projects.vercel.app?via=pr-comment-feedback-link",
    },
  ])

  assert.deepEqual(urls, [
    "https://sathian-ai-git-codex-homepage-sathiansrikrishnans-projects.vercel.app",
  ])
})

test("treats empty status checks as not ready to merge", () => {
  assert.equal(checksArePassing([]).ok, false)
})

test("detects passing and failing status check rollups", () => {
  assert.equal(
    checksArePassing([
      { name: "build", conclusion: "SUCCESS", status: "COMPLETED" },
      { name: "lint", state: "SUCCESS" },
    ]).ok,
    true,
  )

  const failed = checksArePassing([
    { name: "build", conclusion: "FAILURE", status: "COMPLETED" },
  ])
  assert.equal(failed.ok, false)
  assert.match(failed.reason, /build/)
})

test("detects missing pull request status errors", () => {
  assert.equal(isNoPullRequestFoundError('no pull requests found for branch "main"'), true)
  assert.equal(isNoPullRequestFoundError("GraphQL: Resource not accessible"), false)
})
