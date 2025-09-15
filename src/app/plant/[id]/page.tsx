import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Plant } from '@/types/plant';
import { PhotoGallery } from '@/components/plant/photo-gallery';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getPlant(id: string): Promise<Plant | null> {
  try {
    // Use the deployed URL for production, localhost for development
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://plantfolio-omega.vercel.app'
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/plants/${id}`, {
      cache: 'no-store' // Always fetch fresh data
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch plant');
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching plant:', error);
    return null;
  }
}

interface PlantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlantPage({ params }: PlantPageProps) {
  const { id } = await params;
  const plant = await getPlant(id);

  if (!plant) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Plant Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-0">
            {plant.name}
          </h1>
          {plant.scientificName && (
            <p className="text-lg text-muted-foreground italic">
              {plant.scientificName}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Plant Image */}
          <div className="order-1">
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src={plant.thumbnailUrl}
                alt={plant.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Plant Details */}
          <div className="order-2 space-y-4">
            {plant.plantaData && (
              <>
                {/* Basic Info */}
                <div className="bg-card/50 p-4 rounded-2xl">
                  <h2 className="text-lg font-semibold mb-3 text-foreground">Plant Information</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Health</span>
                      <span className="capitalize font-medium text-foreground">{plant.plantaData.health}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Size</span>
                      <span className="font-medium text-foreground">{plant.plantaData.size}cm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Location</span>
                      <span className="font-medium text-foreground">{plant.plantaData.site.name}</span>
                    </div>
                  </div>
                </div>

                {/* Care Schedule */}
                <div className="bg-card/50 p-4 rounded-2xl">
                  <h2 className="text-lg font-semibold mb-3 text-foreground">Care Schedule</h2>
                  <div className="space-y-2">
                    {plant.plantaData.actions.watering.next && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Next Watering</span>
                        <span className="font-medium text-foreground">
                          {new Date(plant.plantaData.actions.watering.next.date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {plant.plantaData.actions.fertilizing.next && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Next Fertilizing</span>
                        <span className="font-medium text-foreground">
                          {new Date(plant.plantaData.actions.fertilizing.next.date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {plant.plantaData.actions.repotting.next && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Next Repotting</span>
                        <span className="font-medium text-foreground">
                          {new Date(plant.plantaData.actions.repotting.next.date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Environment */}
                <div className="bg-card/50 p-4 rounded-2xl">
                  <h2 className="text-lg font-semibold mb-3 text-foreground">Environment</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Distance from Window</span>
                      <span className="font-medium text-foreground">{plant.plantaData.environment.light.distanceFromWindow}cm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pot Type</span>
                      <span className="font-medium text-foreground capitalize">
                        {plant.plantaData.environment.pot.type.replace('pot', '').replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pot Size</span>
                      <span className="font-medium text-foreground">{plant.plantaData.environment.pot.size}cm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Soil Type</span>
                      <span className="font-medium text-foreground capitalize">
                        {plant.plantaData.environment.pot.soil 
                          ? plant.plantaData.environment.pot.soil.replace(/([A-Z])/g, ' $1').trim()
                          : 'Not specified'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Fallback for plants without detailed data */}
            {!plant.plantaData && (
              <div className="bg-card/50 p-4 rounded-2xl">
                <p className="text-muted-foreground text-center">
                  Error: Plant data is missing or incomplete.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Photo Gallery Section */}
        <div className="mt-12">
          <PhotoGallery photos={plant.photos} plantName={plant.name} />
        </div>
      </div>
    </div>
  );
}