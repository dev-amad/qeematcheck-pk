'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  Calculator,
  FileSpreadsheet,
  PlusCircle,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    }
  };

  const navLinks = [
    { href: '/check', label: 'Check a Price', icon: Calculator },
    { href: '/reports', label: 'Community Reports', icon: FileSpreadsheet },
    { href: '/report', label: 'Report a Price', icon: PlusCircle },
    { href: '/my-reports', label: 'My Reports', icon: User, requireAuth: true },
  ];

  return (
    <nav className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo - Text Only, No Icons, font-bold */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white hover:text-emerald-400 transition-colors duration-200">
                Kimat Check PK
              </span>
              <span className="text-[11px] text-emerald-400 font-medium tracking-wide block -mt-0.5">
                Karachi Price Transparency
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              if (link.requireAuth && !user) return null;
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth & CTA Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg max-w-[170px] truncate font-medium">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-rose-900/70 hover:text-rose-200 text-slate-300 px-3.5 py-1.5 rounded-xl border border-slate-700 font-medium transition-all duration-200 ease-in-out cursor-pointer active:scale-[0.98]"
                  title="Log out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-medium text-slate-200 hover:text-white px-3.5 py-2 rounded-xl hover:bg-slate-800 transition-all duration-200"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out active:scale-[0.98]"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white focus:outline-none p-2 rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            if (link.requireAuth && !user) return null;
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <div className="space-y-2">
                <div className="text-xs text-slate-400 px-3 font-medium">Signed in as {user.email}</div>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-800 text-rose-300 text-sm font-medium py-2.5 rounded-xl hover:bg-rose-950 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium bg-slate-800 text-white py-2.5 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
