// Planta API Types
export interface PlantaNames {
  localizedName: string;
  variety: string;
  custom: string;
  scientific: string;
}

export interface PlantaSite {
  id: string;
  name: string;
  hasGrowLight: boolean;
  activeGrowLightHours: number;
}

export interface PlantaImage {
  url: string;
  lastUpdated: string;
}

export interface PlantaCustomCare {
  enabled: boolean;
  intervalWarmPeriod: number;
  intervalColdPeriod: number;
}

export interface PlantaPlantCare {
  customWatering: PlantaCustomCare;
  customFertilizing: PlantaCustomCare;
}

export interface PlantaLight {
  distanceFromWindow: number;
  hasGrowLight: boolean;
  activeGrowLightHours: number;
}

export interface PlantaPot {
  type: string;
  size: number;
  soil: string;
  hasDrainage: boolean;
}

export interface PlantaEnvironment {
  isNearAc: boolean;
  isNearHeater: boolean;
  light: PlantaLight;
  pot: PlantaPot;
}

export interface PlantaActionDate {
  date: string;
  type?: string;
}

export interface PlantaAction {
  next: PlantaActionDate;
  completed: PlantaActionDate;
}

export interface PlantaActions {
  watering: PlantaAction;
  fertilizing: PlantaAction;
  repotting: PlantaAction;
  cleaning: PlantaAction;
  progressUpdate: PlantaAction;
  misting: PlantaAction;
}

export interface PlantaPlant {
  id: string;
  names: PlantaNames;
  site: PlantaSite;
  image: PlantaImage;
  plantCare: PlantaPlantCare;
  size: number;
  health: 'poor' | 'fair' | 'good' | 'excellent';
  environment: PlantaEnvironment;
  actions: PlantaActions;
}

export interface PlantaPagination {
  nextPage: string;
}

export interface PlantaApiResponse<T> {
  status: number;
  data: T;
  pagination?: PlantaPagination;
}

export type PlantaPlantsResponse = PlantaApiResponse<PlantaPlant[]>;
export type PlantaPlantResponse = PlantaApiResponse<PlantaPlant>;
