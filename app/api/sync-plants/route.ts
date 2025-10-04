/**
 * Sync Plants API Route
 *
 * This endpoint is called by a Vercel Cron job to sync plant data from Planta API
 * to Supabase. It runs nightly at 2 AM UTC.
 *
 * Flow:
 * 1. Verify CRON_SECRET for security
 * 2. Fetch and refresh Planta API tokens if needed
 * 3. Fetch all plants from Planta API (with pagination)
 * 4. For each plant:
 *    - Upsert plant metadata
 *    - Check if photo has changed (compare timestamps)
 *    - If changed: download, upload to Supabase Storage, create photo record
 * 5. Log results to sync_logs table
 *
 * Security:
 * - Requires CRON_SECRET header for authentication
 * - Uses Supabase service role key (admin access)
 *
 * Manual trigger: Add ?manual=true query parameter during development
 *
 * TODO: Implement sync logic with Planta API integration
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Implement sync logic
  return NextResponse.json(
    {
      message: "Sync endpoint placeholder",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
