import Link from "next/link";
import { Plant } from "@/types";
import { getPlantDisplayName } from "@/types";

type PlantHeaderProps = {
  plant: Plant;
};

/**
 * PlantHeader Component
 *
 * Displays the plant's name, scientific name, and location at the top of the detail page.
 * Includes a back link to return to the collection.
 */
export function PlantHeader({ plant }: PlantHeaderProps) {
  const displayName = getPlantDisplayName(plant);

  return (
    <div className="mb-8">
      {/* Back link */}
      <Link
        href="/"
        className="mb-4 inline-flex items-center text-sm text-gray-600 transition hover:text-green-700"
      >
        ← Back to Collection
      </Link>

      {/* Plant information */}
      <div>
        <h1 className="mb-2 text-4xl font-bold text-gray-900">{displayName}</h1>

        {plant.scientificName && (
          <p className="mb-2 text-xl text-gray-600">{plant.scientificName}</p>
        )}

        {plant.location && <p className="text-gray-600">📍 {plant.location}</p>}
      </div>
    </div>
  );
}
