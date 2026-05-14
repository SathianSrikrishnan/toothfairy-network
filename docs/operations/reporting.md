# Tooth Fairy Network Reporting

This repo now has a small first-party reporting path for Tooth Fairy Network.

## What It Captures

- Page views under the Tooth Fairy layout.
- Important clicks into app, story, mint, claim, magic, and keepsake paths.
- Outbound clicks from the Tooth Fairy experience.

The client does not store IP addresses or cookies. It creates a temporary browser session ID in `sessionStorage`, then sends route, referrer, viewport, page title, and small event metadata to the server.

## Data Path

1. `TFNSiteReporter` mounts in `src/app/toothfairy/layout.tsx`.
2. The browser sends events to `/api/toothfairy/reporting/event`.
3. The route validates and sanitizes the payload.
4. The route writes to Supabase table `tfn_site_events` with the service role key.

If Supabase is missing, the endpoint returns a non-blocking success response and the site keeps working.

## Setup

Apply the migration:

```bash
supabase db push
```

or run the SQL in:

```text
supabase/migrations/20260514_tfn_site_reporting.sql
```

Required runtime variables:

```text
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

## Quick Queries

Recent activity:

```sql
SELECT created_at, event_name, path, device_type
FROM tfn_site_events
ORDER BY created_at DESC
LIMIT 50;
```

Daily page views:

```sql
SELECT date_trunc('day', created_at) AS day, count(*) AS page_views
FROM tfn_site_events
WHERE event_name = 'page_view'
GROUP BY 1
ORDER BY 1 DESC;
```

Top clicked paths:

```sql
SELECT metadata->>'href' AS href, count(*) AS clicks
FROM tfn_site_events
WHERE event_name IN ('primary_action', 'outbound_click')
GROUP BY 1
ORDER BY clicks DESC
LIMIT 20;
```
