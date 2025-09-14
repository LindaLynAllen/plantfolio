import PlantCard from '@/components/plant/plant-card';
import { Plant } from '@/types/plant';

async function getPlants(): Promise<Plant[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/plants`, {
      cache: 'no-store' // Always fetch fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch plants');
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
}

export default async function Home() {
  const plants = await getPlants();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
          Plantfolio
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover the beauty of houseplants through our curated collection. 
          Learn about care, growth, and the joy of plant parenthood.
        </p>
      </div>

      {/* Plant Grid */}
      {plants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No plants found. Please check your Planta API configuration.
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-8 border-t">
        <p className="text-sm text-muted-foreground">
          © 2024 Plantfolio. A minimalist plant portfolio.
        </p>
      </footer>
    </div>
  );
}
