/**
 * Home Page - Plant Gallery
 *
 * This is the main landing page that displays all plants in a grid layout.
 * Each plant card shows a thumbnail image and the plant's display name.
 *
 * Data fetching:
 * - Uses Server Component with direct Supabase query
 * - Fetches all plants with their photos
 * - Displays most recent photo as thumbnail
 *
 * TODO: Implement plant gallery with grid layout
 */

export default function HomePage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="mb-4 text-4xl font-bold">Plantfolio</h1>
      <p className="text-gray-600">
        Plant gallery will be displayed here. This is a placeholder.
      </p>
    </div>
  );
}
