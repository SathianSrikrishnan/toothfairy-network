#!/usr/bin/env node

import { readFileSync } from "node:fs"
import { createClient } from "@supabase/supabase-js"

function parseArgs(argv) {
  const args = { hours: 72, json: false, showEmails: false }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === "--json") args.json = true
    if (arg === "--show-emails") args.showEmails = true
    if (arg === "--hours" && argv[index + 1]) {
      args.hours = Number(argv[index + 1])
      index += 1
    }
    if (arg.startsWith("--hours=")) {
      args.hours = Number(arg.slice("--hours=".length))
    }
    if (arg === "--help" || arg === "-h") {
      args.help = true
    }
  }

  if (!Number.isFinite(args.hours) || args.hours <= 0) {
    throw new Error("--hours must be a positive number")
  }

  return args
}

function loadEnv(path = ".env.local") {
  const env = {}
  const file = readFileSync(path, "utf8")

  for (const line of file.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const index = trimmed.indexOf("=")
    if (index < 0) continue

    const key = trimmed.slice(0, index)
    let value = trimmed.slice(index + 1)
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    env[key] = value
  }

  return env
}

function maskEmail(email) {
  if (!email || typeof email !== "string") return null
  const [local, domain] = email.split("@")
  if (!domain) return `${email.slice(0, 2)}***`
  return `${local.slice(0, 2)}***@${domain}`
}

function uniqueEmails(rows = [], field = "user_email") {
  return new Set(
    rows
      .map((row) => String(row?.[field] || "").toLowerCase().trim())
      .filter(Boolean),
  )
}

function sinceFilter(rows = [], sinceMs) {
  return rows.filter((row) => Date.parse(row?.created_at || 0) >= sinceMs)
}

async function countRows(supabase, table, since) {
  const total = await supabase.from(table).select("*", { count: "exact", head: true })
  const recent = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .gte("created_at", since)

  return {
    total: total.error ? null : total.count || 0,
    recent: recent.error ? null : recent.count || 0,
    error: total.error?.message || recent.error?.message || null,
  }
}

async function fetchRows(supabase, table, columns) {
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .order("created_at", { ascending: false })
    .limit(5000)

  if (error) return { rows: [], error: error.message }
  return { rows: data || [], error: null }
}

async function listAuthUsers(supabase) {
  const users = []
  let page = 1

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error

    const batch = data?.users || []
    users.push(...batch)
    if (batch.length < 1000) break
    page += 1
  }

  return users
}

function printHuman(report) {
  console.log(`TFN activity report (${report.window.hours}h)`)
  console.log(`Since: ${report.window.since}`)
  console.log("")
  console.log("Supabase auth")
  console.log(`- total users: ${report.auth.totalUsers}`)
  console.log(`- distinct emails: ${report.auth.totalDistinctEmails}`)
  console.log(`- new users in window: ${report.auth.newUsers}`)
  console.log(`- distinct new emails in window: ${report.auth.newDistinctEmails}`)
  console.log(`- users signed in during window: ${report.auth.signedInUsers}`)
  console.log("")
  console.log("TFN product")
  console.log(`- child/profile rows: ${report.tfnChildren.total} total, ${report.tfnChildren.recent} in window`)
  console.log(`- distinct parent emails in tfn_children: ${report.tfnChildren.distinctEmails}`)
  console.log(`- new parent emails in tfn_children window: ${report.tfnChildren.newDistinctEmails}`)
  console.log(`- tooth story/keepsake rows: ${report.toothStories.total} total, ${report.toothStories.recent} in window`)
  console.log(`- magic generations: ${report.magicGenerations.total} total, ${report.magicGenerations.recent} in window`)
  console.log("")
  console.log("Recent emails")
  const emails = report.recentEmails.length > 0 ? report.recentEmails.join(", ") : "none"
  console.log(`- ${emails}`)
  console.log("")
  console.log("Notes")
  console.log("- A completed keepsake is represented by tfn_tooth_stories/mint-side records.")
  console.log("- A draw attempt without sign-in or mint is not currently server-recorded.")
  console.log("- Visitor/pageview counts require Vercel Web Analytics instrumentation on main.")
}

function help() {
  console.log(`Usage: npm run report:tfn -- [--hours 72] [--json] [--show-emails]

Reads .env.local, uses the Supabase service role key locally, and prints
aggregate TFN registration / keepsake activity without exposing secrets.

Examples:
  npm run report:tfn
  npm run report:tfn -- --hours 24
  npm run report:tfn -- --hours 72 --show-emails
`)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    help()
    return
  }

  const env = loadEnv()
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const since = new Date(Date.now() - args.hours * 60 * 60 * 1000).toISOString()
  const sinceMs = Date.parse(since)

  const [
    users,
    childrenCounts,
    storyCounts,
    creditCounts,
    generationCounts,
    children,
    stories,
    generations,
  ] = await Promise.all([
    listAuthUsers(supabase),
    countRows(supabase, "tfn_children", since),
    countRows(supabase, "tfn_tooth_stories", since),
    countRows(supabase, "tfn_magic_credits", since),
    countRows(supabase, "tfn_magic_generations", since),
    fetchRows(supabase, "tfn_children", "user_id,user_email,child_slug,created_at"),
    fetchRows(supabase, "tfn_tooth_stories", "milestone_pda,user_id,created_at,tradition_slug"),
    fetchRows(supabase, "tfn_magic_generations", "user_id,style_id,created_at"),
  ])

  const recentUsers = users.filter((user) => Date.parse(user.created_at || 0) >= sinceMs)
  const recentSignIns = users.filter(
    (user) => user.last_sign_in_at && Date.parse(user.last_sign_in_at) >= sinceMs,
  )
  const authEmails = new Set(users.map((user) => String(user.email || "").toLowerCase()).filter(Boolean))
  const recentAuthEmails = new Set(
    recentUsers.map((user) => String(user.email || "").toLowerCase()).filter(Boolean),
  )
  const childEmails = uniqueEmails(children.rows)
  const recentChildEmails = uniqueEmails(sinceFilter(children.rows, sinceMs))

  const recentEmails = [...new Set([...recentAuthEmails, ...recentChildEmails])]
  const report = {
    window: { hours: args.hours, since },
    auth: {
      totalUsers: users.length,
      totalDistinctEmails: authEmails.size,
      newUsers: recentUsers.length,
      newDistinctEmails: recentAuthEmails.size,
      signedInUsers: recentSignIns.length,
    },
    tfnChildren: {
      total: childrenCounts.total,
      recent: childrenCounts.recent,
      distinctEmails: childEmails.size,
      newDistinctEmails: recentChildEmails.size,
      fetchedRows: children.rows.length,
      error: childrenCounts.error || children.error,
    },
    toothStories: {
      total: storyCounts.total,
      recent: storyCounts.recent,
      fetchedRows: stories.rows.length,
      latestCreatedAt: stories.rows[0]?.created_at || null,
      error: storyCounts.error || stories.error,
    },
    magicCredits: {
      total: creditCounts.total,
      recent: creditCounts.recent,
      error: creditCounts.error,
    },
    magicGenerations: {
      total: generationCounts.total,
      recent: generationCounts.recent,
      fetchedRows: generations.rows.length,
      latestCreatedAt: generations.rows[0]?.created_at || null,
      error: generationCounts.error || generations.error,
    },
    recentEmails: args.showEmails ? recentEmails : recentEmails.map(maskEmail),
  }

  if (args.json) {
    console.log(JSON.stringify(report, null, 2))
  } else {
    printHuman(report)
  }
}

main().catch((error) => {
  console.error(`ERROR: ${error.message}`)
  process.exit(1)
})
