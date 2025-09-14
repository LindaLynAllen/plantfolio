import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-4">Plant Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn&apos;t find the plant you&apos;re looking for. It might have been moved or doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/">Back to Gallery</Link>
        </Button>
      </div>
    </div>
  );
}
