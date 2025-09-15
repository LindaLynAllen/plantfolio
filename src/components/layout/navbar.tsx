'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Navbar() {
  const pathname = usePathname();
  const isPlantDetail = pathname.startsWith('/plant/');

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl">🌿</span>
          <span className="text-xl font-bold text-foreground">Plantfolio</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {isPlantDetail && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center space-x-1">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Gallery</span>
              </Link>
            </Button>
          )}
          <span className="text-sm text-muted-foreground hidden sm:block">
            Created by Linda Allen
          </span>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
