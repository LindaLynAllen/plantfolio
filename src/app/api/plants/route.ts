import { NextResponse } from 'next/server';
import { createPlantaApiClient } from '@/lib/planta-api';
import { plantaToPlant } from '@/types/plant';

export async function GET() {
  try {
    const apiClient = createPlantaApiClient();
    const response = await apiClient.getAllPlants();
    
    // Convert Planta API data to our Plant format
    const plants = response.data.map(plantaToPlant);
    
    return NextResponse.json({
      success: true,
      data: plants,
      pagination: response.pagination
    });
  } catch (error) {
    console.error('Error fetching plants:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch plants' 
      },
      { status: 500 }
    );
  }
}
