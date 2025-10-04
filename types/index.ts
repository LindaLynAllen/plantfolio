/**
 * Utility types and re-exports for the application
 */

export * from "./database";

/**
 * Helper type to get the display name for a plant
 * Priority: customName → commonName → scientificName
 */
export function getPlantDisplayName(
  plant: Pick<
    import("./database").Plant,
    "customName" | "commonName" | "scientificName"
  >
): string {
  return (
    plant.customName ||
    plant.commonName ||
    plant.scientificName ||
    "Unknown Plant"
  );
}

/**
 * Helper type to get the most recent photo from an array
 */
export function getMostRecentPhoto(
  photos: import("./database").Photo[]
): import("./database").Photo | null {
  if (!photos || photos.length === 0) return null;
  return photos.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
}
