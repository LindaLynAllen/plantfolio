import Image from "next/image";
import { Photo } from "@/types";

type PhotoTimelineProps = {
  photos: Photo[];
  plantName: string;
  onPhotoClick: (index: number) => void;
};

/**
 * PhotoTimeline Component
 *
 * Displays all photos of a plant in a chronological grid (newest first).
 * Each photo shows the date it was taken and is clickable to open in lightbox.
 */
export function PhotoTimeline({
  photos,
  plantName,
  onPhotoClick,
}: PhotoTimelineProps) {
  if (photos.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600">No timeline yet</p>
      </div>
    );
  }

  // Format date using native Intl.DateTimeFormat (as per spec)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Photo Timeline</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => onPhotoClick(index)}
            className="group relative aspect-square overflow-hidden rounded-lg ring-green-500 transition hover:ring-2"
          >
            <Image
              src={photo.url}
              alt={`${plantName} - photo from ${formatDate(photo.date)}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
            />

            {/* Date overlay */}
            <div className="absolute right-0 bottom-0 left-0 bg-black/60 px-3 py-2 text-sm text-white">
              {formatDate(photo.date)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
