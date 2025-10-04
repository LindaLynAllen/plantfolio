import Link from "next/link";

/**
 * Not Found Page for Plant Detail
 *
 * Shown when a plant ID doesn't exist in the database.
 */
export default function PlantNotFound() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <div className="mb-4 text-6xl">🔍</div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Plant Not Found
        </h1>
        <p className="mb-6 text-gray-600">
          The plant you&apos;re looking for doesn&apos;t exist or may have been
          removed.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-green-700 px-6 py-3 text-white transition hover:bg-green-800"
        >
          ← Back to Collection
        </Link>
      </div>
    </div>
  );
}
