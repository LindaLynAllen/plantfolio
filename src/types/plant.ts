import { PlantaPlant } from './planta-api';
import { Database } from './database';

// Type aliases for Supabase data
export type PlantRow = Database['public']['Tables']['plants']['Row'];
export type PlantPhotoRow = Database['public']['Tables']['plant_photos']['Row'];

export interface PlantPhoto {
  id: string;
  url: string;
  date: string;
  caption?: string;
  is_current?: boolean;
}

// Our app's Plant interface that combines Supabase data with our needs
export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  thumbnailUrl: string;
  photos: PlantPhoto[];
  // Supabase fields
  plantaId?: string;
  createdAt?: string;
  updatedAt?: string;
  // Additional fields from Planta API
  plantaData?: PlantaPlant;
}

// Utility function to convert Supabase data to our Plant format
export function supabaseToPlant(plantRow: PlantRow, photos: PlantPhotoRow[]): Plant {
  return {
    id: plantRow.id,
    name: plantRow.name,
    scientificName: plantRow.scientific_name || '',
    thumbnailUrl: plantRow.thumbnail_url || '/api/placeholder/400/300',
    photos: photos.map(photo => ({
      id: photo.id,
      url: photo.url,
      date: photo.date_taken,
      caption: photo.caption || undefined,
      is_current: photo.is_current
    })),
    plantaId: plantRow.planta_id || undefined,
    createdAt: plantRow.created_at,
    updatedAt: plantRow.updated_at
  };
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
        caption: 'Current plant photo',
        is_current: true
      }
    ],
    plantaId: plantaPlant.id,
    plantaData: plantaPlant
  };
}
