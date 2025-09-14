import { PlantaPlant } from './planta-api';

export interface PlantPhoto {
  id: string;
  url: string;
  date: string;
  caption?: string;
}

// Our app's Plant interface that combines Planta API data with our needs
export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  thumbnailUrl: string;
  photos: PlantPhoto[];
  // Additional fields from Planta API
  plantaData?: PlantaPlant;
}

// Utility function to convert Planta API data to our Plant format
export function plantaToPlant(plantaPlant: PlantaPlant): Plant {
  return {
    id: plantaPlant.id,
    name: plantaPlant.names.localizedName || plantaPlant.names.custom || 'Unknown Plant',
    scientificName: plantaPlant.names.scientific || '',
    thumbnailUrl: plantaPlant.image.url || '/api/placeholder/400/300',
    photos: [
      {
        id: `${plantaPlant.id}-main`,
        url: plantaPlant.image.url || '/api/placeholder/600/400',
        date: plantaPlant.image.lastUpdated || new Date().toISOString(),
        caption: 'Current plant photo'
      }
    ],
    plantaData: plantaPlant
  };
}
