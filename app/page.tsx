'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  MapPin,
  Store,
  Calendar,
  PlusCircle,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { PriceReportWithDetails } from '@/lib/supabase/types';
import { FALLBACK_PRODUCTS, ProductWithPrices } from '@/lib/data/seedFallback';
import { calculatePriceDelta, formatPrice, formatDate } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import ConfigAlert from '@/components/ConfigAlert';

export default function CommunityReportsPage() {
  const [reports, setReports] = useState<PriceReportWithDetails[]>([]);
  const [products, setProducts] = useState<ProductWithPrices[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadReportsData() {
      try {
        setLoading(true);

        if (!isSupabaseConfigured) {
          setProducts(FALLBACK_PRODUCTS);
          return;
        }

        const { data: prodData } = await supabase
          .from('products')
          .select(`
            id,
            name,
            category,
            unit,
            prices (
              id,
              price,
              unit,
              source,
              effective_date,
              area,
              is_available
            )
          `)
          .order('name');

        if (prodData && prodData.length > 0) {
          setProducts(prodData as ProductWithPrices[]);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }

        const { data: repData, error } = await supabase
          .from('price_reports')
          .select(`
            id,
            user_id,
            product_id,
            observed_price,
            reference_price_at_report,
            area,
            status,
            notes,
            created_at,
            product:products!left(id, name, category, unit)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching community reports:', error.message);
        } else if (repData) {
          setReports(repData as any);
        }
      } catch (err) {
        console.warn('Error fetching community reports:', err);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }

    loadReportsData();
  }, []);

  // Map individual reported shops / entries
  const shopAggregates = React.useMemo(() => {
    const map = new Map<string, {
      shopName: string;
      area: string;
      reportCount: number;
      prices: number[];
      referencePrices: number[];
      latestDate: string;
      productNames: Set<string>;
    }>();

    reports.forEach((rep) => {
      const extractedShop = (rep as any).shop_name || rep.notes || 'Local Store';
      const sName = extractedShop.length > 30 ? `${extractedShop.slice(0, 27)}...` : extractedShop;
      const sArea = rep.area || 'Karachi';
      const key = `${sName.toLowerCase()}__${sArea.toLowerCase()}__${rep.id}`;

      if (!map.has(key)) {
        map.set(key, {
          shopName: sName,
          area: sArea,
          reportCount: 0,
          prices: [],
          referencePrices: [],
          latestDate: rep.created_at,
          productNames: new Set(),
        });
      }

      const item = map.get(key)!;
      item.reportCount += 1;
      item.prices.push(rep.observed_price);
      if (rep.reference_price_at_report) {
        item.referencePrices.push(rep.reference_price_at_report);
      }
      if (rep.product?.name) {
        item.productNames.add(rep.product.name);
      }
    });

    return Array.from(map.values());
  }, [reports]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ConfigAlert />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100/90 text-emerald-900 border border-emerald-200 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Crowdsourced Karachi Data</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Community Price Reports
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-1 font-medium">
            Aggregated consumer observations across Karachi grocery stores and neighborhood markets.
          </p>
        </div>

        <div>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Price Report</span>
          </Link>
        </div>
      </div>

      {/* Reported Shops Section */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Store className="w-5 h-5 text-emerald-700" />
          <span>Reported Shops ({shopAggregates.length})</span>
        </h2>

        {shopAggregates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {shopAggregates.map((shop, idx) => {
              const avgPrice = shop.prices.reduce((a, b) => a + b, 0) / shop.prices.length;
              const avgRefPrice =
                shop.referencePrices.length > 0
                  ? shop.referencePrices.reduce((a, b) => a + b, 0) / shop.referencePrices.length
                  : null;
              const calc = calculatePriceDelta(avgRefPrice, avgPrice);

              return (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                        {shop.reportCount} report{shop.reportCount === 1 ? '' : 's'}
                      </span>
                      <StatusBadge status={calc.status} size="sm" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 truncate">{shop.shopName}</h3>

                    <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{shop.area}, Karachi</span>
                    </div>

                    {shop.productNames.size > 0 && (
                      <div className="mt-3 text-xs text-slate-600">
                        <span className="font-medium text-slate-700">Item: </span>
                        <span>{Array.from(shop.productNames).join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/80 -mx-6 -mb-6 p-4 rounded-b-2xl">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                          Reported Price
                        </span>
                        <span className="text-base font-bold font-mono text-slate-900">
                          {formatPrice(avgPrice)}
                        </span>
                      </div>

                      {avgRefPrice !== null && (
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                            Govt Reference
                          </span>
                          <span className="text-xs font-mono font-medium text-slate-600">
                            {formatPrice(avgRefPrice)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/80 rounded-2xl border border-slate-200 p-8 text-center text-slate-500 font-medium">
            No shop reports recorded yet.
          </div>
        )}
      </div>

      {/* Individual Observations Feed */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          All Individual Reports ({reports.length})
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/80 border border-slate-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : reports.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {reports.map((report) => {
              const calc = calculatePriceDelta(
                report.reference_price_at_report,
                report.observed_price
              );

              return (
                <div key={report.id} className="p-5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">
                          {report.product?.name || 'Essential Item'}
                        </h4>
                        <StatusBadge status={calc.status} size="sm" />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                        <span className="flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {report.area || 'Karachi'}
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(report.created_at)}
                        </span>
                      </div>

                      {report.notes && (
                        <p className="text-xs text-slate-500 italic mt-1">&ldquo;{report.notes}&rdquo;</p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-base font-bold font-mono text-slate-900">
                        {formatPrice(report.observed_price)}
                        <span className="text-xs font-normal text-slate-500 ml-1">
                          /{report.product?.unit || 'unit'}
                        </span>
                      </div>
                      {report.reference_price_at_report && (
                        <div className="text-xs text-slate-500 font-mono font-medium">
                          Ref: {formatPrice(report.reference_price_at_report)} (
                          {calc.diffRupees !== null && calc.diffRupees >= 0 ? '+' : ''}
                          {calc.diffRupees !== null ? formatPrice(calc.diffRupees) : ''})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/80 rounded-2xl border border-slate-200 p-10 text-center text-slate-500 font-medium">
            No individual reports recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}