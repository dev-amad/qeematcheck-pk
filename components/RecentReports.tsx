'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Store, Calendar, TrendingUp } from 'lucide-react';
import { PriceReportWithDetails } from '@/lib/supabase/types';
import { calculatePriceDelta, formatPrice, formatDate } from '@/lib/utils';
import StatusBadge from './StatusBadge';

interface RecentReportsProps {
  reports: PriceReportWithDetails[];
  loading?: boolean;
}

export default function RecentReports({ reports, loading = false }: RecentReportsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-6 bg-slate-200 rounded w-2/3"></div>
            <div className="h-10 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
        <p className="text-slate-600 font-medium">No community price reports recorded yet.</p>
        <p className="text-xs text-slate-500 mt-1">
          Be the first consumer in Karachi to verify and report prices at your local shop!
        </p>
        <div className="mt-4">
          <Link
            href="/check"
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <span>Check a Price Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.slice(0, 3).map((report) => {
          const productName = report.product?.name || 'Item';
          const productUnit = report.product?.unit || 'unit';
          const shopName = report.shop?.name || 'Local Shop';
          const area = report.area || report.shop?.area || 'Karachi';
          const refPrice = report.reference_price_at_report;
          const calc = calculatePriceDelta(refPrice, report.observed_price);

          return (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Top Badge & Date */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <StatusBadge status={calc.status} size="sm" />
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(report.created_at)}
                  </span>
                </div>

                {/* Product Name */}
                <h3 className="font-bold text-slate-900 text-lg line-clamp-1 mt-1">
                  {productName}
                </h3>

                {/* Shop and Area */}
                <div className="mt-2 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium truncate">
                    <Store className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{shopName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{area}, Karachi</span>
                  </div>
                </div>
              </div>

              {/* Price comparison breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-5 -mb-5 p-4 rounded-b-xl">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                      Reported Price
                    </span>
                    <span className="text-base font-extrabold font-mono text-slate-900">
                      {formatPrice(report.observed_price)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal ml-0.5">
                      /{productUnit}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                      Ref Price
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-600">
                      {refPrice ? formatPrice(refPrice) : 'N/A'}
                    </span>
                  </div>
                </div>

                {calc.diffRupees !== null && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">Difference:</span>
                    <span
                      className={
                        calc.status === 'potential_overpricing'
                          ? 'text-rose-600 font-mono'
                          : calc.status === 'above'
                          ? 'text-amber-700 font-mono'
                          : 'text-emerald-700 font-mono'
                      }
                    >
                      {calc.diffRupees >= 0 ? '+' : ''}Rs. {Math.abs(calc.diffRupees).toFixed(2)} (
                      {calc.diffPercentage !== null && calc.diffPercentage > 0 ? '+' : ''}
                      {calc.diffPercentage?.toFixed(1)}%)
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-2">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          <span>View all community reports & shop aggregates</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
