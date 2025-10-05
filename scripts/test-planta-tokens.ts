/**
 * Test Planta API Tokens
 * 
 * Verifies that stored tokens work by making a test API call.
 * 
 * Usage: npx tsx scripts/test-planta-tokens.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables
config({ path: resolve(process.cwd(), ".env.local") });

const PLANTA_BASE_URL = "https://public.planta-api.com";

async function testTokens() {
  console.log("🧪 Testing Planta API tokens...");
  
  try {
    // Get tokens from Supabase
    const { supabaseAdmin } = await import("../lib/supabase/server.js");
    
    const { data: tokens, error: tokenError } = await supabaseAdmin
      .from("tokens")
      .select("*")
      .single();

    if (tokenError || !tokens) {
      throw new Error(`Failed to get tokens: ${tokenError?.message || "No tokens found"}`);
    }

    console.log("✅ Tokens found in database");
    console.log(`   Expires: ${tokens.expires_at}`);
    console.log(`   Updated: ${tokens.updated_at}`);

    // Test API call
    console.log("🌐 Testing API call...");
    const response = await fetch(`${PLANTA_BASE_URL}/v1/addedPlants`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ API call successful!");
    console.log(`   Found ${data.data?.length || 0} plants`);
    
    if (data.data && data.data.length > 0) {
      console.log("   Sample plant:", data.data[0].names?.localizedName || "Unknown");
    }

    console.log("\n🎉 Token test passed!");
    console.log("✅ Ready to proceed with sync job implementation");

  } catch (error) {
    console.error("❌ Token test failed:", error);
    console.error("\nTroubleshooting:");
    console.error("1. Check that tokens were stored correctly");
    console.error("2. Verify the access token hasn't expired");
    console.error("3. Try running the auth setup script again");
    process.exit(1);
  }
}

testTokens();
