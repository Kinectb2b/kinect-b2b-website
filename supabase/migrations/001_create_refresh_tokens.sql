-- Migration: Create refresh_tokens table for portal auth
-- Run this in Supabase SQL Editor before deploying code changes

-- Create the refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ DEFAULT NULL
);

-- Index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash ON refresh_tokens(token_hash);

-- Index for cleanup queries
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- Index for user's tokens
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);

-- Enable RLS
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own tokens
-- Note: This uses service role for API routes, but adds protection for direct access
CREATE POLICY "Users can view own refresh tokens"
  ON refresh_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own refresh tokens"
  ON refresh_tokens
  FOR DELETE
  USING (auth.uid() = user_id);

-- Service role bypass for API routes (anon key won't have RLS restrictions with service role)
-- The API uses the anon key which bypasses RLS by default in most Supabase setups
-- If you need stricter control, use service_role key in API routes

-- Cleanup function: Remove expired tokens (run periodically via cron or manually)
CREATE OR REPLACE FUNCTION cleanup_expired_refresh_tokens()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM refresh_tokens
  WHERE expires_at < NOW() OR revoked_at IS NOT NULL;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users (for manual cleanup if needed)
GRANT EXECUTE ON FUNCTION cleanup_expired_refresh_tokens() TO authenticated;
