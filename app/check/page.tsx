'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Calculator,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { FALLBACK_PRODUCTS, ProductWithPrices } from '@/lib/data/seedFallback';
import ComparisonCard from '@/components/ComparisonCard';
import ConfigAlert from '@/components/ConfigAlert';

function CheckPriceContent() {
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get('productId');

  const [products, setProducts] = useState<ProductWithPrices[]>(FALLBACK_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || FALLBACK_PRODUCTS[0]?.id || ''
  );
  const [observedPriceInput, setObservedPriceInput] = useState<string>('195');
  const [productReportCount, setProductReportCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch products and reference prices directly from Supabase
  useEffect(() => {
    async function fetchProducts() {
      if (!isSupabaseConfigured) {
        setProducts(FALLBACK_PRODUCTS);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
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

        if (!error && data && data.length > 0) {
          setProducts(data as ProductWithPrices[]);
          if (initialProductId && data.some((p: any) => p.id === initialProductId)) {
            setSelectedProductId(initialProductId);
          } else if (!selectedProductId || !data.some((p: any) => p.id === selectedProductId)) {
            const sugar = data.find((p: any) => p.name.toLowerCase().includes('sugar'));
            setSelectedProductId(sugar ? sugar.id : data[0].id);
          }
        } else {
          setProducts(FALLBACK_PRODUCTS);
          if (!selectedProductId) {
            setSelectedProductId(FALLBACK_PRODUCTS[0].id);
          }
        }
      } catch (err) {
        console.warn('Using products dataset:', err);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [initialProductId]);

  // Fetch community report count for selected product
  useEffect(() => {
    async function fetchReportCount() {
      if (!isSupabaseConfigured || !selectedProductId) {
        setProductReportCount(0);
        return;
      }

      try {
        const { count, error } = await supabase
          .from('price_reports')
          .select('*', { count: 'exact', head: true })
          .eq('product_id', selectedProductId);

        if (!error && count !== null) {
          setProductReportCount(count);
        }
      } catch {
        setProductReportCount(0);
      }
    }

    fetchReportCount();
  }, [selectedProductId]);

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || products[0] || FALLBACK_PRODUCTS[0];
  const referencePrice = selectedProduct?.reference_prices?.[0] || null;
  const observedPriceNum = parseFloat(observedPriceInput) || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ConfigAlert />

      {/* Page Title */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-100/90 text-emerald-900 border border-emerald-200 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
          <Calculator className="w-3.5 h-3.5 text-emerald-700" />
          <span>Karachi Price Verification Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Check a Shop Price
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1.5 max-w-2xl font-medium">
          Select an everyday grocery essential, enter the price charged by your local Karachi shop, and check the price difference.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6 sm:p-8 space-y-6">
            {/* Step 1: Product Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-700" />
                  <span>1. Select Essential Item</span>
                </label>
                <span className="text-xs text-slate-500 font-medium">
                  {products.length} Karachi items
                </span>
              </div>

              {loading ? (
                <select
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-400 font-medium cursor-not-allowed"
                >
                  <option>Loading products...</option>
                </select>
              ) : (
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none cursor-pointer transition-all duration-200"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit}) — {p.category}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Step 2: Price Input */}
            <div className="pt-4 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Calculator className="w-4 h-4 text-emerald-700" />
                <span>2. Enter Shop Price Charged</span>
              </label>

              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-slate-500 font-bold text-lg font-mono">Rs.</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 195"
                  value={observedPriceInput}
                  onChange={(e) => setObservedPriceInput(e.target.value)}
                  className="w-full pl-14 pr-4 py-3.5 text-2xl font-bold font-mono bg-emerald-50/40 border-2 border-emerald-300/90 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 focus:bg-white shadow-inner transition-all duration-200 outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mt-2">
                <span>Unit: per {selectedProduct?.unit || 'unit'}</span>
                <span>PKR (Pakistani Rupee)</span>
              </div>

              {/* Common Price Presets */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 block mb-2">
                  Common Karachi Price Points:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[141, 170, 195, 220, 320].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setObservedPriceInput(String(val))}
                      className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 rounded-xl font-medium px-3 py-1.5 border border-slate-200 transition-all duration-200 ease-in-out cursor-pointer active:scale-[0.98]"
                    >
                      Rs. {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Civic Trust Card */}
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-5 text-xs text-slate-600 space-y-2 shadow-xs hover:shadow-md transition-all duration-200">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Civic Transparency Principle</span>
            </div>
            <p className="leading-relaxed font-medium">
              Price calculations benchmark against notified reference rates issued by the Commissioner Karachi Division. We do not accuse merchants of illegal conduct based on community observations.
            </p>
          </div>
        </div>

        {/* Right Column: Prominent Price Comparison Card */}
        <div className="lg:col-span-7">
          {selectedProduct ? (
            <ComparisonCard
              product={selectedProduct}
              referencePrice={referencePrice}
              observedPrice={observedPriceNum}
              reportCount={productReportCount}
            />
          ) : (
            <div className="bg-white/80 rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Loading product comparison data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckPricePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto p-12 text-center text-slate-500 animate-pulse font-medium">
          Loading price check engine...
        </div>
      }
    >
      <CheckPriceContent />
    </Suspense>
  );
}
