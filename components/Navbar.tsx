import Link from "next/link";

/**
 * Navbar Component
 *
 * Appears on all pages via the root layout.
 * Contains the site logo and title that links back to home.
 */
export function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="inline-block transition hover:opacity-80">
          <h1 className="text-2xl font-bold text-green-700">🌿 Plantfolio</h1>
        </Link>
      </div>
    </nav>
  );
}
