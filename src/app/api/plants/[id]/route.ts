import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { supabaseToPlant } from '@/types/plant';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Plant ID is required' },
        { status: 400 }
      );
    }

    // Fetch plant from Supabase with its photos
    const { data: plantData, error } = await supabase
      .from('plants')
      .select(`
        *,
        plant_photos (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Plant not found' },
          { status: 404 }
        );
      }
      throw new Error(`Supabase error: ${error.message}`);
    }

    // Convert Supabase data to our Plant format
    const plant = supabaseToPlant(plantData, plantData.plant_photos || []);
    
    return NextResponse.json({
      success: true,
      data: plant
    });
  } catch (error) {
    console.error('Error fetching plant from Supabase:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch plant',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}
