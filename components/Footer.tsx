/**
 * Footer Component
 *
 * Appears on all pages via the root layout.
 * Contains copyright notice and links to email and GitHub.
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
          <p>© Linda 2025</p>
          <span className="text-gray-300">•</span>
          <a
            href="mailto:your@email.com"
            className="transition hover:text-green-700"
            aria-label="Send email"
          >
            📧 Email
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="https://github.com/LindaLynAllen/plantfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-green-700"
            aria-label="View source on GitHub"
          >
            🔗 GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
