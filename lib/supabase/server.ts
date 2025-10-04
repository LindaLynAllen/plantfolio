/**
 * Supabase client for server-side usage with elevated privileges
 * Uses the service role key for admin operations
 *
 * ⚠️ WARNING: This client has full database access and bypasses RLS.
 * Only use in secure server contexts (API routes, server actions).
 *
 * This client should be used in:
 * - API routes (e.g., sync-plants endpoint)
 * - Server actions that require write access
 * - Operations on protected tables (tokens, sync_logs)
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
