export interface PlantPhoto {
  id: string;
  url: string;
  date: string;
  caption?: string;
}

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  thumbnailUrl: string;
  photos: PlantPhoto[];
}
