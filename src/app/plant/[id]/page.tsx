import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Plant } from '@/types/plant';

interface PlantDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getPlantById(id: string): Promise<Plant | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/plants/${id}`, {
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

export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  const { id } = await params;
  const plant = await getPlantById(id);

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
          {plant.plantaData && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm px-2 py-1 bg-secondary rounded-full">
                {plant.plantaData.site.name}
              </span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                plant.plantaData.health === 'excellent' ? 'bg-green-100 text-green-800' :
                plant.plantaData.health === 'good' ? 'bg-blue-100 text-blue-800' :
                plant.plantaData.health === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {plant.plantaData.health} health
              </span>
            </div>
          )}
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

        {/* Planta API Data (if available) */}
        {plant.plantaData && (
          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-semibold text-foreground">Care Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Environment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Environment</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Location:</span> {plant.plantaData.site.name}
                  </div>
                  <div>
                    <span className="font-medium">Light:</span> {plant.plantaData.environment.light.distanceFromWindow}m from window
                  </div>
                  <div>
                    <span className="font-medium">Grow Light:</span> {plant.plantaData.environment.light.hasGrowLight ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <span className="font-medium">Pot Type:</span> {plant.plantaData.environment.pot.type}
                  </div>
                  <div>
                    <span className="font-medium">Soil:</span> {plant.plantaData.environment.pot.soil}
                  </div>
                </div>
              </div>

              {/* Next Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Next Actions</h3>
                <div className="space-y-2 text-sm">
                  {plant.plantaData.actions.watering.next?.date && (
                    <div>
                      <span className="font-medium">Watering:</span> {new Date(plant.plantaData.actions.watering.next.date).toLocaleDateString()}
                    </div>
                  )}
                  {plant.plantaData.actions.fertilizing.next?.date && (
                    <div>
                      <span className="font-medium">Fertilizing:</span> {new Date(plant.plantaData.actions.fertilizing.next.date).toLocaleDateString()}
                    </div>
                  )}
                  {plant.plantaData.actions.repotting.next?.date && (
                    <div>
                      <span className="font-medium">Repotting:</span> {new Date(plant.plantaData.actions.repotting.next.date).toLocaleDateString()}
                    </div>
                  )}
                  {plant.plantaData.actions.cleaning.next?.date && (
                    <div>
                      <span className="font-medium">Cleaning:</span> {new Date(plant.plantaData.actions.cleaning.next.date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
