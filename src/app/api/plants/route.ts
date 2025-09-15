import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseToPlant } from '@/types/plant';

export async function GET() {
  try {
    // Fetch plants from Supabase with their photos
    const { data: plantsData, error } = await supabase
      .from('plants')
      .select(`
        *,
        plant_photos (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    // Convert Supabase data to our Plant format
    const plants = plantsData.map(plantData => 
      supabaseToPlant(plantData, plantData.plant_photos || [])
    );
    
    return NextResponse.json({
      success: true,
      data: plants
    });
  } catch (error) {
    console.error('Error fetching plants from Supabase:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch plants',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
