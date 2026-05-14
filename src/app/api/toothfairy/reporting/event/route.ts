import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { isAllowedOrigin } from "@/lib/constants"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const ALLOWED_EVENTS = new Set([
  "page_view",
  "primary_action",
  "story_open",
  "app_open",
  "profile_claim_start",
  "mint_start",
  "gift_start",
  "magic_start",
  "keepsake_open",
  "outbound_click",
])

type MetadataValue = string | number | boolean | null

function jsonError(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

function textValue(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null
  const cleaned = value.trim()
  if (!cleaned) return null
  return cleaned.slice(0, maxLength)
}

function numberValue(value: unknown, min: number, max: number) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return null
  if (numeric < min || numeric > max) return null
  return Math.round(numeric)
}

function metadataValue(value: unknown): MetadataValue | undefined {
  if (value === null) return null
  if (typeof value === "string") return value.slice(0, 240)
  if (typeof value === "boolean") return value
  if (typeof value === "number" && Number.isFinite(value)) return value
  return undefined
}

function cleanMetadata(value: unknown): Record<string, MetadataValue> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}

  const clean: Record<string, MetadataValue> = {}
  for (const [key, rawValue] of Object.entries(value).slice(0, 12)) {
    const cleanKey = key.trim().slice(0, 60)
    const cleanValue = metadataValue(rawValue)
    if (cleanKey && cleanValue !== undefined) clean[cleanKey] = cleanValue
  }
  return clean
}

function deviceType(value: unknown) {
  const clean = textValue(value, 20)
  if (clean === "mobile" || clean === "tablet" || clean === "desktop") return clean
  return "unknown"
}

async function readBody(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") || 0)
  if (contentLength > 12_000) return null

  const rawBody = await request.text()
  if (!rawBody) return {}

  try {
    return JSON.parse(rawBody) as Record<string, unknown>
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin")
  if (!isAllowedOrigin(origin)) return jsonError("forbidden", 403)

  const body = await readBody(request)
  if (!body) return jsonError("invalid_body", 400)

  const eventName = textValue(body.eventName, 60)
  if (!eventName || !ALLOWED_EVENTS.has(eventName)) return jsonError("invalid_event", 400)

  const path = textValue(body.path, 500)
  if (!path || !path.startsWith("/")) return jsonError("invalid_path", 400)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ success: true, skipped: true, reason: "supabase_not_configured" }, { status: 202 })
  }

  try {
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { error } = await admin.from("tfn_site_events").insert({
      event_name: eventName,
      path,
      referrer: textValue(body.referrer, 500),
      session_id: textValue(body.sessionId, 120),
      page_title: textValue(body.pageTitle, 240),
      viewport_width: numberValue(body.viewportWidth, 0, 10_000),
      viewport_height: numberValue(body.viewportHeight, 0, 10_000),
      device_type: deviceType(body.deviceType),
      user_agent: textValue(request.headers.get("user-agent"), 500),
      metadata: cleanMetadata(body.metadata),
    })

    if (error) {
      console.error("[tfn-reporting] insert failed:", error)
      return NextResponse.json({ success: true, skipped: true, reason: "insert_failed" }, { status: 202 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[tfn-reporting] request failed:", error)
    return NextResponse.json({ success: true, skipped: true, reason: "reporting_failed" }, { status: 202 })
  }
}
