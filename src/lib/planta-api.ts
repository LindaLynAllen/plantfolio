import { PlantaPlantsResponse, PlantaPlantResponse } from '@/types/planta-api';

class PlantaApiClient {
  private baseUrl = 'https://public.planta-api.com/v1';
  private accessToken: string;
  private refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        await this.refreshAccessToken();
        // Retry the request with new token
        const retryResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!retryResponse.ok) {
          throw new Error(`API request failed: ${retryResponse.status} ${retryResponse.statusText}`);
        }
        
        return retryResponse.json();
      }
      
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async refreshAccessToken(): Promise<void> {
    // This would typically make a request to your refresh endpoint
    // For now, we'll throw an error to indicate token refresh is needed
    throw new Error('Access token expired and refresh is not implemented. Please update your tokens.');
  }

  async getAllPlants(): Promise<PlantaPlantsResponse> {
    return this.makeRequest<PlantaPlantsResponse>('/addedPlants');
  }

  async getPlantById(id: string): Promise<PlantaPlantResponse> {
    return this.makeRequest<PlantaPlantResponse>(`/addedPlants/${id}`);
  }

  // Method to update tokens (useful for token refresh)
  updateTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

// Factory function to create API client with environment variables
export function createPlantaApiClient(): PlantaApiClient {
  const accessToken = process.env.PLANTA_ACCESS_TOKEN;
  const refreshToken = process.env.PLANTA_REFRESH_TOKEN;

  if (!accessToken || !refreshToken) {
    throw new Error('Planta API tokens are not configured. Please set PLANTA_ACCESS_TOKEN and PLANTA_REFRESH_TOKEN environment variables.');
  }

  return new PlantaApiClient(accessToken, refreshToken);
}

export { PlantaApiClient };
