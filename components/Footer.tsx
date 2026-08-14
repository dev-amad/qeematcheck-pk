import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand & Purpose */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white tracking-tight">QeematCheck 🇵🇰</span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            QeematCheck 🇵🇰 — Public Price Verification & Community Aggregation Platform for Karachi, Pakistan. Empowering citizens through transparent pricing data.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs px-3.5 py-1.5 rounded-xl mt-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Active Karachi Price Monitoring Platform</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Quick Actions
          </h4>
          <ul className="space-y-2.5 text-sm font-medium">
            <li>
              <Link href="/" className="hover:text-emerald-400 transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="/check" className="hover:text-emerald-400 transition-colors duration-200">
                Check Price
              </Link>
            </li>
            <li>
              <Link href="/reports" className="hover:text-emerald-400 transition-colors duration-200">
                Community Reports
              </Link>
            </li>
            <li>
              <Link href="/report" className="hover:text-emerald-400 transition-colors duration-200">
                Submit Report
              </Link>
            </li>
          </ul>
        </div>

        {/* Trust & Civic Transparency Principle */}
        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Civic Trust Model</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            QeematCheck provides consumer price observation benchmarks against official Karachi notifications. We do not accuse businesses of violations or legal wrongdoing.
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Coverage Area: Karachi (Gulshan-e-Iqbal, North Nazimabad, Clifton, Saddar, DHA, FB Area).
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>© {new Date().getFullYear()} QeematCheck 🇵🇰. Public price verification platform.</div>
        <div className="text-slate-400 font-medium">
          Karachi, Pakistan
        </div>
      </div>
    </footer>
  );
}
