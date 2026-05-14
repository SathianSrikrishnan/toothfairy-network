#!/usr/bin/env node

import {
  currentBranch,
  hasVercelLink,
  isProtectedBranch,
  run,
  workingTreeStatus,
} from "./ship-lib.mjs"

const failures = []
const warnings = []
const branch = currentBranch()
const status = workingTreeStatus()

console.log("Ship check")
console.log("")
console.log(`branch: ${branch}`)
console.log(`working tree: ${status ? "has local changes" : "clean"}`)
console.log(`vercel link: ${hasVercelLink() ? "present" : "not linked locally"}`)

if (isProtectedBranch(branch)) failures.push(`current branch '${branch}' is protected`)
if (status) failures.push("working tree has uncommitted changes")

const ghAuth = run("gh", ["auth", "status"])
if (!ghAuth.ok) failures.push("GitHub CLI is not authenticated or not readable")

const vercelWhoami = run("vercel", ["whoami"])
if (!vercelWhoami.ok) warnings.push("Vercel CLI is not available to this shell")

if (!hasVercelLink()) warnings.push("local Vercel link is missing; run `vercel link` from this repo")

if (warnings.length > 0) {
  console.log("")
  console.log("Warnings")
  for (const warning of warnings) console.log(`- ${warning}`)
}

if (failures.length > 0) {
  console.log("")
  console.log("Failures")
  for (const failure of failures) console.log(`- ${failure}`)
  process.exit(1)
}

console.log("")
console.log("Result: ready to create or inspect a draft PR.")
