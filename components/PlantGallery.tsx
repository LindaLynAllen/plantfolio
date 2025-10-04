import { PlantCard } from "./PlantCard";
import { PlantWithPhotos } from "@/types";
import { getMostRecentPhoto } from "@/types";

type PlantGalleryProps = {
  plants: PlantWithPhotos[];
};

/**
 * PlantGallery Component
 *
 * Displays a responsive grid of plant cards.
 * Grid adjusts from 2 columns on mobile to 5+ on large screens.
 */
export function PlantGallery({ plants }: PlantGalleryProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {plants.map((plant) => {
        const mostRecentPhoto = getMostRecentPhoto(plant.photos || []);
        const thumbnailUrl = mostRecentPhoto?.url;

        return (
          <PlantCard key={plant.id} plant={plant} thumbnailUrl={thumbnailUrl} />
        );
      })}
    </div>
  );
}
