#!/usr/bin/env node

import {
  checksArePassing,
  extractPreviewUrls,
  parseArgs,
  printFailure,
  runJson,
  mustRun,
} from "./ship-lib.mjs"

const args = parseArgs(process.argv.slice(2))
const method = args.method || "squash"
const allowedMethods = new Set(["squash", "merge", "rebase"])

try {
  if (!allowedMethods.has(method)) {
    throw new Error("--method must be one of: squash, merge, rebase")
  }

  const pr = runJson("gh", [
    "pr",
    "view",
    "--json",
    "number,url,isDraft,mergeStateStatus,statusCheckRollup,comments",
  ])
  const checkStatus = checksArePassing(pr.statusCheckRollup)
  const previewUrls = extractPreviewUrls(pr.comments)

  if (pr.isDraft && !args.ready) {
    throw new Error("PR is still draft. Re-run with `--ready --yes` only after preview approval.")
  }

  if (!args["skip-checks"] && !checkStatus.ok) {
    throw new Error(`Checks are not ready: ${checkStatus.reason}`)
  }

  if (!args["skip-preview"] && previewUrls.length === 0) {
    throw new Error("No Vercel preview URL found in PR comments. Run `npm run ship:status` after Vercel posts Ready.")
  }

  if (!args.yes) {
    console.log(`Ready to merge PR #${pr.number}: ${pr.url}`)
    console.log(`method: ${method}`)
    console.log("")
    console.log("No merge performed. Re-run with:")
    console.log(`npm run ship:merge -- --ready --yes --method ${method}`)
    process.exit(1)
  }

  if (pr.isDraft) {
    mustRun("gh", ["pr", "ready"], { stdio: "inherit" })
  }

  mustRun("gh", ["pr", "merge", `--${method}`, "--delete-branch"], { stdio: "inherit" })
  console.log("")
  console.log("Merged. Vercel will deploy production from the target branch.")
} catch (error) {
  printFailure(error.message)
  process.exit(1)
}
