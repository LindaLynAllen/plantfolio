import { supabase } from "@/lib/supabase/client";
import { PlantGallery } from "@/components/PlantGallery";
import { PlantWithPhotos } from "@/types";

/**
 * Home Page - Plant Collection Gallery
 *
 * Server Component that fetches all plants with their photos from Supabase.
 * Displays them in a responsive grid layout.
 */
export default async function HomePage() {
  // Fetch all plants with their photos (Server Component - runs on server)
  const { data: plants, error } = await supabase
    .from("plants")
    .select(
      `
      *,
      photos (
        id,
        url,
        date,
        source
      )
    `
    )
    .order("commonName", { ascending: true });

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="mb-4 text-xl text-red-600">
            Failed to load plant collection
          </p>
          <p className="text-gray-600">{error.message}</p>
          <p className="mt-4 text-sm text-gray-500">
            Make sure your Supabase connection is configured correctly.
          </p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!plants || plants.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="mb-4 text-6xl">🌱</div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            No plants yet!
          </h2>
          <p className="text-gray-600">
            Your plant collection is empty. Run the sync job to import plants
            from Planta.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Or add a test plant via the Supabase dashboard to see how it looks.
          </p>
        </div>
      </div>
    );
  }

  // Success - render the gallery
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900">
          My Plant Collection
        </h1>
        <p className="text-gray-600">
          A showcase of my {plants.length} house plant
          {plants.length === 1 ? "" : "s"}
        </p>
      </header>

      {/* Gallery */}
      <PlantGallery plants={plants as PlantWithPhotos[]} />
    </div>
  );
}
