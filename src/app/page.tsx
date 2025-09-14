import { samplePlants } from '@/data/plants';
import PlantCard from '@/components/plant/plant-card';

export default function Home() {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {samplePlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 border-t">
        <p className="text-sm text-muted-foreground">
          © 2024 Plantfolio. A minimalist plant portfolio.
        </p>
      </footer>
    </div>
  );
}
