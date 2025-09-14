'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const isPlantDetail = pathname.startsWith('/plant/');

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-foreground">Plantfolio</span>
        </Link>
        
        {isPlantDetail && (
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center space-x-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Gallery</span>
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
