/**
 * Plant Detail Page
 *
 * Displays detailed information about a single plant including:
 * - Plant name (customName with fallback to commonName → scientificName)
 * - Scientific name as subtitle
 * - Location
 * - Main photo (most recent)
 * - Photo timeline grid with all historical photos
 *
 * Data fetching:
 * - Uses Server Component with direct Supabase query
 * - Fetches single plant by ID with all photos
 * - Photos sorted newest first
 *
 * Route: /plants/[id]
 *
 * TODO: Implement plant detail view with photo gallery and lightbox
 */

type PlantDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PlantDetailPage({
  params,
}: PlantDetailPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-4 text-4xl font-bold">Plant Detail: {id}</h1>
      <p className="text-gray-600">
        Plant details and photo timeline will be displayed here. This is a
        placeholder.
      </p>
    </div>
  );
}
