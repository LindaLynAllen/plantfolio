'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Navbar() {

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl">🌿</span>
          <span className="text-xl font-bold text-foreground">Plantfolio</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
