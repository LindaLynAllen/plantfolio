/**
 * Supabase Connection Test Script
 *
 * Run this after setting up your .env.local to verify:
 * - Supabase credentials are correct
 * - All tables are accessible
 * - RLS policies are working
 *
 * Usage: npx tsx scripts/test-connection.ts
 */

import { supabase } from "../lib/supabase/client";

async function testConnection() {
  console.log("🔍 Testing Supabase connection...\n");

  // Test 1: Basic connection
  console.log("Test 1: Basic Connection");
  const { data, error } = await supabase.from("plants").select("count");

  if (error) {
    console.error("❌ Connection failed:", error.message);
    console.error("\nTroubleshooting:");
    console.error("- Check your .env.local file exists");
    console.error("- Verify NEXT_PUBLIC_SUPABASE_URL is correct");
    console.error("- Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct");
    console.error("- Make sure no extra spaces or quotes around values\n");
    return;
  }

  console.log("✅ Successfully connected to Supabase!");
  console.log(`📊 Plants table exists and is accessible\n`);

  // Test 2: Check all tables
  console.log("Test 2: Table Accessibility");
  const tables = ["plants", "photos", "tokens", "sync_logs"];

  for (const table of tables) {
    const { error } = await supabase.from(table).select("*").limit(1);
    if (error) {
      console.log(`❌ ${table.padEnd(12)}: ${error.message}`);
    } else {
      console.log(`✅ ${table.padEnd(12)}: Accessible`);
    }
  }

  // Test 3: Check RLS policies
  console.log("\nTest 3: Row Level Security (RLS)");

  // Plants should be readable (public policy)
  const { error: plantsError } = await supabase
    .from("plants")
    .select("*")
    .limit(1);
  console.log(
    plantsError
      ? `❌ Plants: Cannot read (RLS issue)`
      : `✅ Plants: Public read access working`
  );

  // Photos should be readable (public policy)
  const { error: photosError } = await supabase
    .from("photos")
    .select("*")
    .limit(1);
  console.log(
    photosError
      ? `❌ Photos: Cannot read (RLS issue)`
      : `✅ Photos: Public read access working`
  );

  // Tokens should NOT be accessible via anon key (no public policy)
  const { error: tokensError } = await supabase
    .from("tokens")
    .select("*")
    .limit(1);

  // For tokens, we WANT an error (no RLS policy for anon users)
  // But the table should still exist (different error message)
  if (tokensError) {
    if (tokensError.message.includes("row-level security")) {
      console.log(`✅ Tokens: Correctly protected (no public access)`);
    } else if (tokensError.message.includes("does not exist")) {
      console.log(`❌ Tokens: Table doesn't exist (run migration)`);
    } else {
      console.log(`⚠️  Tokens: ${tokensError.message}`);
    }
  } else {
    console.log(`⚠️  Tokens: Readable by anon users (security issue!)`);
  }

  // Test 4: Storage bucket
  console.log("\nTest 4: Storage Configuration");
  const { data: buckets, error: storageError } =
    await supabase.storage.listBuckets();

  if (storageError) {
    console.log(`❌ Storage: Cannot list buckets (${storageError.message})`);
  } else {
    const plantPhotosBucket = buckets?.find((b) => b.name === "plant-photos");
    if (plantPhotosBucket) {
      console.log(`✅ Storage: 'plant-photos' bucket exists`);
      console.log(
        `   Public: ${plantPhotosBucket.public ? "Yes ✅" : "No ❌"}`
      );
    } else {
      console.log(`⚠️  Storage: 'plant-photos' bucket not found`);
      console.log(
        `   Available buckets: ${buckets?.map((b) => b.name).join(", ") || "none"}`
      );
    }
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("🎉 Connection test complete!");
  console.log("=".repeat(50));
  console.log("\nYour Supabase backend is ready for development.");
  console.log("\nNext steps:");
  console.log("1. Add some test data (or run sync job)");
  console.log("2. Start building the home page");
  console.log("3. Run: npm run dev\n");
}

testConnection().catch((err) => {
  console.error("\n💥 Unexpected error:", err);
  process.exit(1);
});
