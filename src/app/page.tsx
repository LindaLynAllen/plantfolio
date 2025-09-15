import PlantCard from '@/components/plant/plant-card';
import { Plant } from '@/types/plant';
import { Github, Mail } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getPlants(): Promise<Plant[]> {
  try {
    // Use the deployed URL for production, localhost for development
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://plantfolio-omega.vercel.app'
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/plants`, {
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
          My Plant Collection
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Welcome to my personal plant gallery featuring over 50 houseplants.
        </p>
      </div>

      {/* Plant Grid */}
      {plants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No plants found. Add some plants to your database to get started!
          </p>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-8 border-t">
        <div className="flex justify-center items-center space-x-4 mb-4">
          <a 
            href="mailto:lindalynallen@gmail.com" 
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a 
            href="https://github.com/lindalynallen" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2025 Built with Next.js, Tailwind CSS, and ❤️ for Plants.
        </p>
      </footer>
    </div>
  );
}
