import Link from "next/link";
import Image from "next/image";
import { Plant } from "@/types";

type PlantCardProps = {
  plant: Plant;
  thumbnailUrl?: string;
};

/**
 * PlantCard Component
 *
 * Displays a single plant as a card with thumbnail and name.
 * Clicking the card navigates to the plant's detail page.
 *
 * Uses the spec's name fallback logic: customName → commonName → scientificName
 */
export function PlantCard({ plant, thumbnailUrl }: PlantCardProps) {
  // Display name with fallback (as per spec)
  const displayName =
    plant.customName ||
    plant.commonName ||
    plant.scientificName ||
    "Unknown Plant";

  return (
    <Link
      href={`/plants/${plant.id}`}
      className="group block transition hover:scale-[1.02]"
    >
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition group-hover:shadow-md">
        {/* Thumbnail with aspect ratio container */}
        <div className="relative aspect-square bg-gray-100">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={displayName}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="mb-2 text-4xl">🌱</div>
                <p className="text-sm">No photo yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Plant name */}
        <div className="p-4">
          <p className="text-center font-medium text-gray-900 transition group-hover:text-green-700">
            {displayName}
          </p>
        </div>
      </div>
    </Link>
  );
}
