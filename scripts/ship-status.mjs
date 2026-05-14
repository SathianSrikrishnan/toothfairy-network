#!/usr/bin/env node

import {
  appendRoute,
  checksArePassing,
  currentBranch,
  extractPreviewUrls,
  isNoPullRequestFoundError,
  isProtectedBranch,
  printFailure,
  runJson,
} from "./ship-lib.mjs"

try {
  const pr = runJson("gh", [
    "pr",
    "view",
    "--json",
    "number,url,state,isDraft,headRefName,baseRefName,mergeStateStatus,statusCheckRollup,comments",
  ])
  const checkStatus = checksArePassing(pr.statusCheckRollup)
  const previewUrls = extractPreviewUrls(pr.comments)

  console.log(`PR #${pr.number}: ${pr.url}`)
  console.log(`branch: ${pr.headRefName} -> ${pr.baseRefName}`)
  console.log(`state: ${pr.state}${pr.isDraft ? " draft" : ""}`)
  console.log(`merge state: ${pr.mergeStateStatus || "unknown"}`)
  console.log(`checks: ${checkStatus.ok ? "passing" : checkStatus.reason}`)

  if (previewUrls.length > 0) {
    console.log("")
    console.log("Preview URLs")
    for (const url of previewUrls) {
      console.log(`- ${url}`)
      console.log(`  draw: ${appendRoute(url, "/toothfairy/app/draw")}`)
    }
  } else {
    console.log("")
    console.log("Preview URLs: none found in PR comments yet.")
  }

  if (!checkStatus.ok || previewUrls.length === 0) {
    process.exit(1)
  }
} catch (error) {
  const branch = currentBranch()
  if (isProtectedBranch(branch) && isNoPullRequestFoundError(error.message)) {
    console.log(`branch: ${branch}`)
    console.log("state: no active pull request")
    console.log("")
    console.log("This is expected after a PR has been merged and the feature branch has been deleted.")
    console.log("Check the Vercel production deployment from the project dashboard.")
    process.exit(0)
  }

  printFailure(error.message)
  process.exit(1)
}
