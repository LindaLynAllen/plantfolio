/**
 * Supabase Connection Test Script
 *
 * Verifies your Supabase setup is working:
 * - Environment variables are configured
 * - Connection to Supabase succeeds
 * - All required tables exist
 * - Public data is accessible (plants, photos)
 *
 * Usage: npm run test:connection
 */

// Load environment variables FIRST, before any other imports
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

async function testConnection() {
  console.log("🔍 Testing Supabase connection...\n");

  // Dynamically import supabase client after env vars are loaded
  const { supabase } = await import("../lib/supabase/client.js");

  // Test 1: Basic connection
  console.log("Test 1: Connection & Credentials");
  const { error: connectionError } = await supabase
    .from("plants")
    .select("count");

  if (connectionError) {
    console.error("❌ Connection failed:", connectionError.message);
    console.error("\n🔧 Troubleshooting:");
    console.error("  • Check your .env.local file exists");
    console.error("  • Verify NEXT_PUBLIC_SUPABASE_URL is correct");
    console.error("  • Verify NEXT_PUBLIC_SUPABASE_ANON_KEY is correct");
    console.error("  • Make sure no extra spaces or quotes around values\n");
    process.exit(1);
  }

  console.log("✅ Connected to Supabase successfully!\n");

  // Test 2: Check all required tables exist
  console.log("Test 2: Database Tables");
  const tables = [
    { name: "plants", required: true },
    { name: "photos", required: true },
    { name: "tokens", required: true },
    { name: "sync_logs", required: true },
  ];

  let allTablesExist = true;

  for (const table of tables) {
    const { error } = await supabase.from(table.name).select("id").limit(1);

    // Check if table doesn't exist (specific error)
    if (error && error.message.includes("does not exist")) {
      console.log(`❌ ${table.name.padEnd(12)}: Table not found`);
      allTablesExist = false;
    } else {
      console.log(`✅ ${table.name.padEnd(12)}: Exists`);
    }
  }

  if (!allTablesExist) {
    console.error(
      "\n❌ Some tables are missing. Run the migration in Supabase SQL Editor."
    );
    console.error("   File: supabase/migrations/001_initial_schema.sql\n");
    process.exit(1);
  }

  // Test 3: Verify public data is accessible
  console.log("\nTest 3: Public Data Access");

  const { data: plantsData, error: plantsError } = await supabase
    .from("plants")
    .select("*")
    .limit(1);

  if (plantsError) {
    console.log(`⚠️  Plants: Cannot read (${plantsError.message})`);
    console.log(
      "   Check RLS policies in Supabase: plants should allow public SELECT"
    );
  } else {
    console.log(
      `✅ Plants: Public read access working ${plantsData.length > 0 ? `(${plantsData.length} row${plantsData.length !== 1 ? "s" : ""} found)` : "(empty table)"}`
    );
  }

  const { data: photosData, error: photosError } = await supabase
    .from("photos")
    .select("*")
    .limit(1);

  if (photosError) {
    console.log(`⚠️  Photos: Cannot read (${photosError.message})`);
    console.log(
      "   Check RLS policies in Supabase: photos should allow public SELECT"
    );
  } else {
    console.log(
      `✅ Photos: Public read access working ${photosData.length > 0 ? `(${photosData.length} row${photosData.length !== 1 ? "s" : ""} found)` : "(empty table)"}`
    );
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 Supabase connection test passed!");
  console.log("=".repeat(60));
  console.log("\n✅ Your database is ready for development!");
  console.log("\n📝 Next steps:");
  console.log("  1. Verify storage bucket exists in Supabase dashboard:");
  console.log("     → Storage → plant-photos (Public)");
  console.log("  2. Start building: npm run dev");
  console.log("  3. Or add test data first (see supabase/README.md for SQL)\n");
}

testConnection().catch((err) => {
  console.error("\n💥 Unexpected error:", err);
  console.error("\nIf the error is about environment variables:");
  console.error("  • Make sure .env.local exists in project root");
  console.error(
    "  • Check that all NEXT_PUBLIC_SUPABASE_* variables are set\n"
  );
  process.exit(1);
});
