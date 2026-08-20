'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calculator,
  PlusCircle,
  FileText,
  Menu,
  X,
  Store,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core navigation items aligned with Next.js App Router paths
  const navLinks = [
    {
      name: 'Check Price',
      href: '/check', // Updated to match app/check/page.tsx
      icon: Calculator,
      description: 'Verify shop rates against official benchmarks',
    },
    {
      name: 'Report Price',
      href: '/report',
      icon: PlusCircle,
      description: 'Submit a price observation',
    },
    {
      name: 'Community Reports',
      href: '/reports',
      icon: FileText,
      description: 'Browse submitted community price observations',
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo / Home Link */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1"
          >
            <div className="bg-emerald-600 group-hover:bg-emerald-500 text-white p-2 rounded-xl shadow-md shadow-emerald-900/20 transition-all duration-200">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                Qeemat Check
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Karachi
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${active
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-emerald-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/check"
              className="hidden sm:inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-semibold text-xs px-3.5 py-2 rounded-xl border border-slate-700/80 transition-all duration-200"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Quick Check</span>
            </Link>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-200" />
              ) : (
                <Menu className="w-6 h-6 text-slate-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-150 ${active
                  ? 'bg-emerald-600/20 text-white border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
              >
                <div
                  className={`p-2 rounded-lg ${active ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-emerald-400'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{link.name}</div>
                  <div className="text-xs text-slate-400 font-normal mt-0.5">
                    {link.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}