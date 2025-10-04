import Image from "next/image";
import { Photo } from "@/types";

type PlantMainPhotoProps = {
  photo: Photo | null;
  plantName: string;
};

/**
 * PlantMainPhoto Component
 *
 * Displays the most recent photo of the plant in a large format.
 * Shows a placeholder if no photos exist.
 */
export function PlantMainPhoto({ photo, plantName }: PlantMainPhotoProps) {
  if (!photo) {
    return (
      <div className="mb-8 rounded-lg bg-gray-100 p-12 text-center">
        <div className="mb-4 text-6xl">🌱</div>
        <p className="text-gray-600">No timeline yet</p>
        <p className="mt-2 text-sm text-gray-500">
          Photos will appear here once synced from Planta
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-bold">Current Photo</h2>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          src={photo.url}
          alt={`${plantName} - current photo`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
