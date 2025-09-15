'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlantPhoto } from '@/types/plant';

interface PhotoGalleryProps {
  photos: PlantPhoto[];
  plantName: string;
}

export function PhotoGallery({ photos, plantName }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<PlantPhoto | null>(null);

  // Sort photos by date (newest first)
  const sortedPhotos = [...photos].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedPhotos.length === 0) {
    return (
      <div className="bg-card/50 p-6 rounded-2xl text-center">
        <p className="text-muted-foreground">No photos available for this plant.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Photo Gallery</h2>
      
      {/* Grid of photos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedPhotos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-200"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.url}
              alt={photo.caption || `${plantName} photo`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            
            {/* Overlay with date */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-white text-xs font-medium">
                {new Date(photo.date).toLocaleDateString()}
              </p>
              {photo.is_current && (
                <p className="text-white text-xs opacity-80">Current</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for full-size photo */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || `${plantName} photo`}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-white text-lg font-medium">
                {new Date(selectedPhoto.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              {selectedPhoto.caption && (
                <p className="text-white/80 text-sm mt-1">{selectedPhoto.caption}</p>
              )}
              {selectedPhoto.is_current && (
                <span className="inline-block mt-2 px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                  Current Photo
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
