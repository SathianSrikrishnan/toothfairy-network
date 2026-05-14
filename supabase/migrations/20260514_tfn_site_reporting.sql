-- Tooth Fairy Network site reporting.
--
-- The browser sends lightweight product analytics to a server route, and the
-- server writes with the service role. Direct client access stays closed.

CREATE TABLE IF NOT EXISTS tfn_site_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_name TEXT NOT NULL CHECK (
    event_name IN (
      'page_view',
      'primary_action',
      'story_open',
      'app_open',
      'profile_claim_start',
      'mint_start',
      'gift_start',
      'magic_start',
      'keepsake_open',
      'outbound_click'
    )
  ),
  path TEXT NOT NULL CHECK (char_length(path) <= 500),
  referrer TEXT CHECK (referrer IS NULL OR char_length(referrer) <= 500),
  session_id TEXT CHECK (session_id IS NULL OR char_length(session_id) <= 120),
  page_title TEXT CHECK (page_title IS NULL OR char_length(page_title) <= 240),
  viewport_width INTEGER CHECK (viewport_width IS NULL OR viewport_width BETWEEN 0 AND 10000),
  viewport_height INTEGER CHECK (viewport_height IS NULL OR viewport_height BETWEEN 0 AND 10000),
  device_type TEXT CHECK (device_type IS NULL OR device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
  user_agent TEXT CHECK (user_agent IS NULL OR char_length(user_agent) <= 500),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_tfn_site_events_created_at
  ON tfn_site_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tfn_site_events_event_name_created_at
  ON tfn_site_events(event_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tfn_site_events_path_created_at
  ON tfn_site_events(path, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tfn_site_events_session_id
  ON tfn_site_events(session_id)
  WHERE session_id IS NOT NULL;

ALTER TABLE tfn_site_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON tfn_site_events FROM anon, authenticated;
