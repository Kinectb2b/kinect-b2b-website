import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://zsjmqlsnvkbtdhjbtwkr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpzam1xbHNudmtidGRoamJ0d2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMzcxOTYsImV4cCI6MjA3NzYxMzE5Nn0.vsbFj5m6pCaoVpHKpB3SZ2WzF4yRufOd27NlcEPhHGc'
);