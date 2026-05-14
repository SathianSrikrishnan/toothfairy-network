"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const REPORTING_ENDPOINT = "/api/toothfairy/reporting/event"
const SESSION_KEY = "tfn.site.session"

type ReportingMetadata = Record<string, string | number | boolean | null | undefined>

function sessionId() {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY)
    if (existing) return existing

    const next =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
    window.sessionStorage.setItem(SESSION_KEY, next)
    return next
  } catch {
    return null
  }
}

function deviceType(width: number) {
  if (width <= 767) return "mobile"
  if (width <= 1024) return "tablet"
  return "desktop"
}

function cleanLabel(value: string | null | undefined) {
  const cleaned = value?.replace(/\s+/g, " ").trim()
  return cleaned ? cleaned.slice(0, 120) : undefined
}

function cleanMetadata(metadata: ReportingMetadata = {}) {
  const clean: Record<string, string | number | boolean | null> = {}
  for (const [key, value] of Object.entries(metadata).slice(0, 12)) {
    if (value === undefined) continue
    clean[key] = typeof value === "string" ? value.slice(0, 240) : value
  }
  return clean
}

function sendToothFairyEvent(eventName: string, metadata?: ReportingMetadata) {
  const width = window.innerWidth || 0
  const height = window.innerHeight || 0
  const body = JSON.stringify({
    eventName,
    path: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || null,
    sessionId: sessionId(),
    pageTitle: document.title || null,
    viewportWidth: width,
    viewportHeight: height,
    deviceType: deviceType(width),
    metadata: cleanMetadata(metadata),
  })

  try {
    if (typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" })
      if (navigator.sendBeacon(REPORTING_ENDPOINT, blob)) return
    }

    void fetch(REPORTING_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    })
  } catch {
    // Reporting should never interrupt the Tooth Fairy experience.
  }
}

function shouldReportClick(anchor: HTMLAnchorElement) {
  const reportName = anchor.dataset.tfnReport
  const href = anchor.getAttribute("href") || ""
  const keyPaths = [
    "/toothfairy/app",
    "/toothfairy/story",
    "/toothfairy/stories",
    "/toothfairy/magic",
    "/toothfairy/keepsake",
    "/toothfairy/claim",
    "/toothfairy/mint",
  ]

  if (reportName) return reportName
  if (keyPaths.some((path) => href.includes(path))) return "primary_action"
  if (/^https?:\/\//i.test(href) && !href.includes(window.location.host)) return "outbound_click"
  return null
}

export function TFNSiteReporter() {
  const pathname = usePathname()

  useEffect(() => {
    sendToothFairyEvent("page_view", {
      search: window.location.search || undefined,
    })
  }, [pathname])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null
      const anchor = target?.closest("a")
      if (!(anchor instanceof HTMLAnchorElement)) return

      const eventName = shouldReportClick(anchor)
      if (!eventName) return

      sendToothFairyEvent(eventName, {
        href: anchor.href,
        label: cleanLabel(anchor.innerText || anchor.getAttribute("aria-label")),
      })
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [])

  return null
}
