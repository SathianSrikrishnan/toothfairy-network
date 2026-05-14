#!/usr/bin/env node

import {
  buildDraftBody,
  currentBranch,
  defaultTitle,
  isProtectedBranch,
  lastCommitSubject,
  mustRun,
  npmCommand,
  parseArgs,
  printFailure,
  run,
  runJson,
  workingTreeStatus,
} from "./ship-lib.mjs"

const args = parseArgs(process.argv.slice(2))
const branch = currentBranch()

try {
  if (isProtectedBranch(branch)) {
    throw new Error(`Refusing to ship directly from protected branch '${branch}'. Create a feature branch first.`)
  }

  if (workingTreeStatus()) {
    throw new Error("Working tree has uncommitted changes. Commit or stash them before shipping.")
  }

  if (!args["skip-build"]) {
    console.log("Running production build before opening PR...")
    mustRun(npmCommand(), ["run", "build"], { stdio: "inherit" })
  }

  console.log(`Pushing ${branch}...`)
  mustRun("git", ["push", "-u", "origin", branch], { stdio: "inherit" })

  const existing = run("gh", ["pr", "view", "--json", "number,url,isDraft,headRefName"])
  if (existing.ok) {
    const pr = JSON.parse(existing.stdout)
    console.log("")
    console.log(`Existing PR #${pr.number}: ${pr.url}`)
    console.log("Next: wait for Vercel Ready, then run `npm run ship:status`.")
    process.exit(0)
  }

  const title = args.title || defaultTitle(branch) || lastCommitSubject()
  const body = buildDraftBody({ branch, userBody: args.body || "" })
  const base = args.base || "main"

  console.log("Creating draft PR...")
  mustRun("gh", [
    "pr",
    "create",
    "--draft",
    "--base",
    base,
    "--head",
    branch,
    "--title",
    title,
    "--body",
    body,
  ], { stdio: "inherit" })

  const pr = runJson("gh", ["pr", "view", "--json", "number,url"])
  console.log("")
  console.log(`Draft PR #${pr.number}: ${pr.url}`)
  console.log("Next: wait for Vercel Ready, then run `npm run ship:status`.")
} catch (error) {
  printFailure(error.message)
  process.exit(1)
}
