// Utility functions for API calls

export async function fetchPlants(): Promise<unknown[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/plants`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch plants');
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
}

export async function fetchPlantById(id: string): Promise<unknown | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/plants/${id}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch plant');
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching plant:', error);
    return null;
  }
}
