"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { PlantWithPhotos } from "@/types";
import { getPlantDisplayName } from "@/types";
import { PlantMainPhoto } from "./PlantMainPhoto";
import { PhotoTimeline } from "./PhotoTimeline";

type PlantDetailProps = {
  plant: PlantWithPhotos;
};

/**
 * PlantDetail Component (Client Component)
 *
 * Handles the interactive portions of the plant detail page:
 * - Displays main photo and photo timeline
 * - Manages lightbox state for photo viewing
 * - Provides full-screen photo viewer with arrow navigation
 */
export function PlantDetail({ plant }: PlantDetailProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Sort photos newest first
  const sortedPhotos =
    plant.photos?.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ) || [];

  const displayName = getPlantDisplayName(plant);
  const mainPhoto = sortedPhotos[0] || null;

  // Prepare slides for lightbox
  const slides = sortedPhotos.map((photo) => ({
    src: photo.url,
    alt: `${displayName} - ${new Date(photo.date).toLocaleDateString()}`,
  }));

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Main Photo */}
      <PlantMainPhoto photo={mainPhoto} plantName={displayName} />

      {/* Photo Timeline */}
      <PhotoTimeline
        photos={sortedPhotos}
        plantName={displayName}
        onPhotoClick={handlePhotoClick}
      />

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={lightboxIndex}
      />
    </>
  );
}
