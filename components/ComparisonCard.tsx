'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, AlertCircle, Calendar, FileText, ExternalLink } from 'lucide-react';
import { Product, ReferencePrice } from '@/lib/supabase/types';
import { calculatePriceDelta, formatPrice, formatPercentage, formatDate } from '@/lib/utils';
import StatusBadge from './StatusBadge';

interface ComparisonCardProps {
  product: Product;
  referencePrice: ReferencePrice | null;
  observedPrice: number;
  onReportClick?: () => void;
  reportCount?: number;
}

export default function ComparisonCard({
  product,
  referencePrice,
  observedPrice,
  reportCount = 0,
}: ComparisonCardProps) {
  const isAvailable = referencePrice?.is_available && referencePrice?.price !== null && referencePrice?.price !== undefined;
  const refVal = isAvailable ? Number(referencePrice!.price) : null;
  const calc = calculatePriceDelta(refVal, observedPrice);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
            {product.category}
          </span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {product.name}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block font-medium">Unit</span>
          <span className="inline-block bg-slate-800 text-slate-200 text-xs px-3 py-1 rounded-lg font-mono font-medium">
            per {product.unit}
          </span>
        </div>
      </div>

      {/* Main Grid: Reference Price vs Shop Price */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
          {/* Reference Price Box */}
          <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-5 relative hover:border-slate-300 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Official Reference Price
              </span>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-medium px-2.5 py-0.5 rounded-full">
                Karachi
              </span>
            </div>

            <div className="text-3xl font-bold text-slate-900 mt-2 font-mono">
              {isAvailable ? formatPrice(refVal) : <span className="text-slate-400 text-2xl">Unavailable</span>}
              <span className="text-xs font-normal text-slate-500 ml-1">/{product.unit}</span>
            </div>

            {/* Official Source & Effective Date */}
            <div className="mt-3 pt-3 border-t border-slate-200/70 text-xs text-slate-600 space-y-1.5 font-medium">
              {referencePrice?.effective_date && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Effective Date: {formatDate(referencePrice.effective_date)}</span>
                </div>
              )}
              {referencePrice?.source && (
                <div className="flex items-start gap-1.5 text-slate-700">
                  <FileText className="w-3.5 h-3.5 text-emerald-700 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{referencePrice.source}</span>
                </div>
              )}
              {referencePrice?.source_url && (
                <div className="pt-1">
                  <a
                    href={referencePrice.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-medium underline"
                  >
                    View Official Notification File <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Shop Price Box */}
          <div className="bg-emerald-50/40 border-2 border-emerald-300/80 rounded-xl p-5 relative hover:border-emerald-400 transition-all">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">
                Shop Price (Observed)
              </span>
              <span className="text-[11px] bg-emerald-200/80 text-emerald-900 font-medium px-2.5 py-0.5 rounded-full">
                Your Input
              </span>
            </div>

            <div className="text-3xl font-bold text-emerald-950 mt-2 font-mono">
              {observedPrice > 0 ? (
                formatPrice(observedPrice)
              ) : (
                <span className="text-slate-400 text-2xl font-sans">Rs. 0</span>
              )}
              <span className="text-xs font-normal text-emerald-700 ml-1">/{product.unit}</span>
            </div>

            <p className="mt-3 text-xs text-slate-500 font-medium">
              {observedPrice > 0
                ? 'Rate charged by your local Karachi shop or merchant.'
                : 'Enter what the shop is charging to calculate difference.'}
            </p>
          </div>
        </div>

        {/* Calculation Result Banner */}
        {observedPrice > 0 && isAvailable ? (
          <div className="mt-6">
            <div
              className={`rounded-2xl p-6 border-2 transition-all ${
                calc.status === 'potential_overpricing'
                  ? 'bg-[#fff1f2] border-rose-300 text-rose-950 shadow-xs'
                  : calc.status === 'above'
                  ? 'bg-[#fffbeb] border-amber-300 text-amber-950 shadow-xs'
                  : 'bg-[#f0fdf4] border-emerald-300 text-emerald-950 shadow-xs'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <StatusBadge status={calc.status} size="lg" />
                {reportCount > 0 && (
                  <span className="text-xs bg-white/90 border border-slate-200 px-3 py-1 rounded-lg text-slate-700 font-medium">
                    {reportCount} community report{reportCount === 1 ? '' : 's'} recorded
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
                <div>
                  <span className="text-xs uppercase font-semibold text-slate-500 block">
                    Rupee Difference
                  </span>
                  <div className="text-2xl font-bold font-mono tracking-tight mt-0.5">
                    {calc.diffRupees !== null && (
                      <>
                        Rs. {Math.abs(calc.diffRupees).toFixed(2)}{' '}
                        <span className="text-sm font-normal">
                          {calc.diffRupees > 0
                            ? 'above reference'
                            : calc.diffRupees < 0
                            ? 'below reference'
                            : 'exact match'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase font-semibold text-slate-500 block">
                    Percentage Difference
                  </span>
                  <div className="text-2xl font-bold font-mono tracking-tight mt-0.5">
                    {calc.diffPercentage !== null && (
                      <>
                        {formatPercentage(calc.diffPercentage)}{' '}
                        <span className="text-sm font-normal">
                          {calc.diffPercentage > 0
                            ? 'higher'
                            : calc.diffPercentage < 0
                            ? 'lower'
                            : 'same as reference'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Trust Disclaimer */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 text-xs text-slate-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Civic Transparency Notice:</strong> Individual community observations reflect consumer reports in Karachi and do not constitute a legal determination.
                </span>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                href={`/report?productId=${product.id}&observedPrice=${observedPrice}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl hover:bg-emerald-800 hover:shadow-md active:scale-[0.99] transition-all duration-200 ease-in-out text-center"
              >
                <span>Report This Price to Community</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
            <p className="text-slate-600 text-sm font-medium">
              {!isAvailable
                ? 'Official reference price is currently unavailable for this item in Karachi notifications.'
                : 'Enter what the shop is charging in the box above to immediately calculate the price difference.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
