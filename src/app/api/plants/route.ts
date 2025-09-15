import { NextResponse } from 'next/server';
import { createPlantaApiClient } from '@/lib/planta-api';
import { plantaToPlant } from '@/types/plant';

export async function GET() {
  try {
    // Try to use Planta API if configured
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
    console.error('Error fetching plants:', error instanceof Error ? error.message : 'Unknown error');
    
    // Return error when Planta API is not available
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch plants',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
