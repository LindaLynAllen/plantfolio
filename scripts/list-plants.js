/**
 * Script to list all plants in your Supabase database
 * 
 * Usage: node scripts/list-plants.js
 * 
 * Make sure your .env.local file has the correct Supabase credentials
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listPlants() {
  try {
    console.log('🌱 Fetching all plants from your database...\n');

    const { data: plants, error } = await supabase
      .from('plants')
      .select('id, name, scientific_name, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    if (plants.length === 0) {
      console.log('No plants found in your database.');
      return;
    }

    console.log(`Found ${plants.length} plants:\n`);
    
    plants.forEach((plant, index) => {
      console.log(`${index + 1}. ${plant.name}`);
      if (plant.scientific_name) {
        console.log(`   Scientific name: ${plant.scientific_name}`);
      }
      console.log(`   ID: ${plant.id}`);
      console.log(`   Created: ${new Date(plant.created_at).toLocaleDateString()}`);
      console.log('');
    });

    console.log('📋 Copy the plant IDs above to use in your photo upload scripts.');

  } catch (error) {
    console.error('❌ Error fetching plants:', error.message);
    process.exit(1);
  }
}

// Run the script
listPlants();
