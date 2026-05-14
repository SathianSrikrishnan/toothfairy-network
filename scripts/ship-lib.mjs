import { existsSync } from "node:fs"
import { spawnSync } from "node:child_process"

const PROTECTED_BRANCHES = new Set(["main", "master", "production"])

export function parseArgs(argv) {
  const args = { _: [] }

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index]

    if (!value.startsWith("--")) {
      args._.push(value)
      continue
    }

    const flag = value.slice(2)
    const equalsIndex = flag.indexOf("=")

    if (equalsIndex >= 0) {
      args[flag.slice(0, equalsIndex)] = flag.slice(equalsIndex + 1)
      continue
    }

    const next = argv[index + 1]
    if (next && !next.startsWith("--")) {
      args[flag] = next
      index += 1
    } else {
      args[flag] = true
    }
  }

  return args
}

export function isProtectedBranch(branch) {
  return PROTECTED_BRANCHES.has(branch)
}

export function buildDraftBody({ branch, userBody }) {
  const body = userBody?.trim()
  const standard = [
    "## Ship Notes",
    "",
    `Branch: \`${branch}\``,
    "",
    "Do not merge until the preview has been reviewed.",
    "",
    "After Vercel posts a Ready preview, run:",
    "",
    "```bash",
    "npm run ship:status",
    "```",
  ].join("\n")

  return body ? `${body}\n\n---\n\n${standard}` : standard
}

export function extractPreviewUrls(comments = []) {
  const seen = new Set()
  const urls = []
  const urlPattern = /https:\/\/[^\s)\]]+\.vercel\.app[^\s)\]]*/g

  for (const comment of comments) {
    const body = typeof comment?.body === "string" ? comment.body : ""
    for (const match of body.matchAll(urlPattern)) {
      const url = match[0].replace(/[.,;:]+$/, "")
      if (!seen.has(url)) {
        seen.add(url)
        urls.push(url)
      }
    }
  }

  return urls
}

export function checksArePassing(checks = []) {
  if (!Array.isArray(checks) || checks.length === 0) {
    return { ok: false, reason: "No status checks reported yet." }
  }

  for (const check of checks) {
    const name = check?.name || check?.workflowName || check?.context || "unknown check"
    const values = [check?.conclusion, check?.status, check?.state, check?.bucket]
      .filter(Boolean)
      .map((value) => String(value).toUpperCase())

    if (values.some((value) => ["FAILURE", "FAILED", "ERROR", "CANCELLED", "TIMED_OUT", "ACTION_REQUIRED"].includes(value))) {
      return { ok: false, reason: `${name} is failing.` }
    }

    if (values.some((value) => ["PENDING", "QUEUED", "IN_PROGRESS", "REQUESTED", "WAITING", "EXPECTED"].includes(value))) {
      return { ok: false, reason: `${name} is still pending.` }
    }

    const hasSuccessSignal = values.some((value) => ["SUCCESS", "COMPLETED", "NEUTRAL", "SKIPPED", "PASSING"].includes(value))
    if (!hasSuccessSignal) {
      return { ok: false, reason: `${name} has unknown status.` }
    }
  }

  return { ok: true, reason: "All reported checks are passing." }
}

export function npmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm"
}

function platformCommand(command) {
  if (process.platform === "win32" && ["npm", "npx", "vercel"].includes(command)) {
    return `${command}.cmd`
  }
  return command
}

export function run(command, args = [], options = {}) {
  const result = spawnSync(platformCommand(command), args, {
    cwd: options.cwd || process.cwd(),
    encoding: "utf8",
    shell: false,
    stdio: options.stdio || "pipe",
  })

  if (result.error) {
    return {
      ok: false,
      status: result.status ?? 1,
      stdout: result.stdout || "",
      stderr: result.error.message,
    }
  }

  return {
    ok: result.status === 0,
    status: result.status ?? 0,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  }
}

export function mustRun(command, args = [], options = {}) {
  const result = run(command, args, options)
  if (!result.ok) {
    const detail = (result.stderr || result.stdout || `${command} failed`).trim()
    throw new Error(detail)
  }
  return result.stdout.trim()
}

export function runJson(command, args = []) {
  const stdout = mustRun(command, args)
  return JSON.parse(stdout)
}

export function currentBranch() {
  return mustRun("git", ["branch", "--show-current"])
}

export function lastCommitSubject() {
  return mustRun("git", ["log", "-1", "--pretty=%s"])
}

export function workingTreeStatus() {
  return mustRun("git", ["status", "--porcelain"])
}

export function hasVercelLink() {
  return existsSync(".vercel/project.json") || existsSync(".vercel/repo.json")
}

export function appendRoute(url, route) {
  return `${url.replace(/\/$/, "")}${route}`
}

export function defaultTitle(branch) {
  const cleaned = branch
    .replace(/^codex\//, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
  return cleaned || "Codex Ship"
}

export function printFailure(message) {
  console.error(`\nERROR: ${message}`)
}
