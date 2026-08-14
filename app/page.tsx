'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calculator,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Search,
  CheckCircle,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { PriceReportWithDetails } from '@/lib/supabase/types';
import { FALLBACK_PRODUCTS, ProductWithPrices } from '@/lib/data/seedFallback';
import { formatPrice } from '@/lib/utils';
import ConfigAlert from '@/components/ConfigAlert';
import RecentReports from '@/components/RecentReports';

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithPrices[]>(FALLBACK_PRODUCTS);
  const [recentReports, setRecentReports] = useState<PriceReportWithDetails[]>([]);
  const [totalReportsCount, setTotalReportsCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!isSupabaseConfigured) {
        setProducts(FALLBACK_PRODUCTS);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 1. Fetch products with reference prices
        const { data: prodData, error: prodErr } = await supabase
          .from('products')
          .select(`
            id,
            name,
            category,
            unit,
            reference_prices (
              id,
              price,
              unit,
              source,
              source_url,
              effective_date,
              area,
              is_available
            )
          `)
          .order('name');

        if (!prodErr && prodData && prodData.length > 0) {
          setProducts(prodData as ProductWithPrices[]);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }

        // 2. Fetch recent community reports
        const { data: repData, error: repErr, count } = await supabase
          .from('price_reports')
          .select(
            `
            id,
            user_id,
            product_id,
            shop_id,
            observed_price,
            reference_price_at_report,
            area,
            status,
            notes,
            created_at,
            product:products(id, name, category, unit),
            shop:shops(id, name, area, address)
          `,
            { count: 'exact' }
          )
          .order('created_at', { ascending: false })
          .limit(6);

        if (!repErr && repData) {
          setRecentReports(repData as any);
          setTotalReportsCount(count || repData.length);
        }
      } catch (err) {
        console.warn('Error fetching dashboard data:', err);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full">
      {/* Top Banner / Config Check */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ConfigAlert />
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-700">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-1.5 rounded-full font-medium shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Live Karachi Price Verification Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            Are you being <span className="text-emerald-400">overcharged?</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Check the reference price. Compare what you&apos;re being charged. Help your community spot unusual prices.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/check"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-base font-medium py-3.5 px-8 rounded-xl shadow-lg hover:shadow-md transition-all duration-200 ease-in-out active:scale-[0.99]"
            >
              <Calculator className="w-5 h-5" />
              <span>Check a Price</span>
            </Link>

            <Link
              href="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-base font-medium py-3.5 px-7 rounded-xl border border-slate-700 transition-all duration-200 ease-in-out active:scale-[0.99]"
            >
              <span>Report a Price</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Commissioner Karachi Notified Rates
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Community Reports
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-emerald-400" /> Karachi Neighborhoods
            </span>
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-3xl font-bold text-slate-900 font-mono">
              {products.length}
            </span>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Essential Items
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl font-bold text-emerald-700 font-mono">
              {totalReportsCount}
            </span>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Community Reports
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl font-bold text-slate-900 font-mono">6+</span>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Karachi Areas
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-3xl font-bold text-emerald-700 font-mono">100%</span>
            <p className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Notified Sources
            </p>
          </div>
        </div>
      </section>

      {/* Popular Products & Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Essential Grocery Reference Prices
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              Select any essential item to compare local Karachi shop prices against notified rates.
            </p>
          </div>

          {/* Search */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product (e.g. Sugar, Beef)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 shadow-xs transition-all"
            />
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((prod) => {
            const ref = prod.reference_prices?.[0];
            const isAvail = ref?.is_available && ref?.price !== null;

            return (
              <div
                key={prod.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {prod.category}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-lg font-mono font-medium">
                      {prod.unit}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 mt-1">
                    {prod.name}
                  </h3>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 uppercase font-medium block">
                      Official Notified Rate
                    </span>
                    <div className="text-xl font-bold font-mono text-emerald-800 mt-0.5">
                      {isAvail ? (
                        formatPrice(ref?.price)
                      ) : (
                        <span className="text-slate-400 text-base font-normal">Unavailable</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2">
                  <Link
                    href={`/check?productId=${prod.id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-medium py-2.5 rounded-xl border border-emerald-200 transition-all duration-200 ease-in-out cursor-pointer active:scale-[0.99]"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Check Shop Price</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Community Reports Section */}
      <section className="bg-slate-100/70 border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Recent Community Price Reports
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                Latest consumer observations submitted across Karachi neighborhoods.
              </p>
            </div>

            <Link
              href="/reports"
              className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>Explore all shop data</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <RecentReports reports={recentReports} loading={loading} />
        </div>
      </section>

      {/* Civic Trust Callout Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 p-6 md:p-8 shadow-xs hover:shadow-md transition-all duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-bold text-slate-900">
                Civic Transparency without Defamation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                QeematCheck empowers consumers with official reference benchmarks. Community price observations reflect individual consumer reports. We do not accuse businesses of violations or illegal conduct.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/report"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out active:scale-[0.99]"
              >
                <span>Submit a Report</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
