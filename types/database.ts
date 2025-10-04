/**
 * Database type definitions for Plantfolio
 * These types match the Supabase database schema
 */

export type Plant = {
  id: string; // Planta's unique plant ID (primary key)
  customName: string | null;
  commonName: string | null;
  scientificName: string | null;
  location: string | null;
  planta_image_updated_at: string | null; // ISO timestamp
  last_synced_at: string | null; // ISO timestamp
};

export type Photo = {
  id: string; // uuid
  plantId: string; // Foreign key to Plant.id
  url: string; // Supabase Storage URL
  date: string; // ISO timestamp
  source: "planta" | "manual_upload";
  created_at: string; // ISO timestamp
};

export type Token = {
  id: string; // uuid
  access_token: string;
  refresh_token: string;
  expires_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
};

export type SyncLog = {
  id: string; // uuid
  synced_at: string; // ISO timestamp
  status: "success" | "partial" | "failed";
  plants_checked: number;
  photos_added: number;
  errors: SyncError[] | null; // JSONB array
  duration_ms: number;
};

export type SyncError = {
  plantId?: string;
  message: string;
  timestamp: string;
};

/**
 * Extended types for frontend use with joined data
 */
export type PlantWithPhotos = Plant & {
  photos: Photo[];
};

export type PlantWithLatestPhoto = Plant & {
  photos: Photo[];
};
