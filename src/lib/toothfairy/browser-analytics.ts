"use client"

import { track } from "@vercel/analytics"

type AnalyticsValue = string | number | boolean | null | undefined

function cleanProperties(properties: Record<string, AnalyticsValue>) {
  const clean: Record<string, string | number | boolean | null> = {
    product: "toothfairy",
  }

  for (const [key, value] of Object.entries(properties)) {
    if (value === undefined) continue
    clean[key] = typeof value === "string" ? value.slice(0, 240) : value
  }

  return clean
}

export function trackToothFairyEvent(
  name: string,
  properties: Record<string, AnalyticsValue> = {},
) {
  if (typeof window === "undefined") return

  try {
    track(name, cleanProperties(properties))
  } catch {
    // Analytics should never interrupt the app flow.
  }
}
