import { notFound } from 'next/navigation';
import Image from 'next/image';
import { samplePlants } from '@/data/plants';
import { Plant } from '@/types/plant';

interface PlantDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// This would typically be an API call in a real app
function getPlantById(id: string): Plant | undefined {
  return samplePlants.find(plant => plant.id === id);
}

export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  const { id } = await params;
  const plant = getPlantById(id);

  if (!plant) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Plant Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {plant.name}
          </h1>
          <p className="text-lg text-muted-foreground italic">
            {plant.scientificName}
          </p>
        </div>

        {/* Photo Timeline */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-foreground">Photo Timeline</h2>
          
          <div className="space-y-6">
            {plant.photos.map((photo) => (
              <div key={photo.id} className="flex flex-col md:flex-row gap-6">
                {/* Date */}
                <div className="md:w-32 flex-shrink-0">
                  <div className="text-sm font-medium text-muted-foreground">
                    {new Date(photo.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                {/* Photo */}
                <div className="flex-1">
                  <div className="relative aspect-video overflow-hidden rounded-lg">
                    <Image
                      src={photo.url}
                      alt={photo.caption || `${plant.name} on ${photo.date}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                  </div>
                  {photo.caption && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
