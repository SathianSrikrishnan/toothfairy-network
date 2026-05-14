#!/usr/bin/env node

import {
  appendRoute,
  checksArePassing,
  extractPreviewUrls,
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
  printFailure(error.message)
  process.exit(1)
}
