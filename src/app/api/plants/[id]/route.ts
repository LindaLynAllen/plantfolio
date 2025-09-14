import { NextRequest, NextResponse } from 'next/server';
import { createPlantaApiClient } from '@/lib/planta-api';
import { plantaToPlant } from '@/types/plant';

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

    const apiClient = createPlantaApiClient();
    const response = await apiClient.getPlantById(id);
    
    // Convert Planta API data to our Plant format
    const plant = plantaToPlant(response.data);
    
    return NextResponse.json({
      success: true,
      data: plant
    });
  } catch (error) {
    console.error('Error fetching plant:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch plant' 
      },
      { status: 500 }
    );
  }
}
