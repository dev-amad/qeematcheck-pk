'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Store,
  FileText,
  PlusCircle,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Products',
      href: '/',
      icon: Store,
    },
    {
      name: 'Price Reports',
      href: '/reports',
      icon: FileText,
    },
    {
      name: 'Report Price',
      href: '/report',
      icon: PlusCircle,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-600">
          <ShieldCheck className="h-6 w-6" />
          <span>Qeemat Check</span>
        </Link>

        {/* Navigation Links & Action Button */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-emerald-50 text-emerald-600 font-semibold'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Check Price CTA Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all duration-150 active:scale-95"
          >
            <Search className="h-4 w-4" />
            <span>Check Price</span>
          </Link>
        </div>
      </div>
    </header>
  );
}