import { supabase } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { PlantHeader } from "@/components/PlantHeader";
import { PlantDetail } from "@/components/PlantDetail";
import { PlantWithPhotos } from "@/types";

type PlantDetailPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Plant Detail Page
 *
 * Displays detailed information about a single plant including:
 * - Plant name (customName with fallback to commonName → scientificName)
 * - Scientific name as subtitle
 * - Location
 * - Main photo (most recent)
 * - Photo timeline grid with all historical photos
 * - Lightbox for full-screen photo viewing
 *
 * Server Component that fetches data from Supabase.
 * Route: /plants/[id]
 */
export default async function PlantDetailPage({
  params,
}: PlantDetailPageProps) {
  const { id } = await params;

  // Fetch plant with all photos
  const { data: plant, error } = await supabase
    .from("plants")
    .select(
      `
      *,
      photos (
        id,
        url,
        date,
        source,
        created_at
      )
    `
    )
    .eq("id", id)
    .single();

  // Handle not found or error
  if (error || !plant) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PlantHeader plant={plant} />
      <PlantDetail plant={plant as PlantWithPhotos} />
    </div>
  );
}
