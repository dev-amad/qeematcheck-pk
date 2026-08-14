'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  PlusCircle,
  Store,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LogIn,
  ShieldCheck,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { Shop } from '@/lib/supabase/types';
import { FALLBACK_PRODUCTS, FALLBACK_SHOPS, ProductWithPrices } from '@/lib/data/seedFallback';
import { calculatePriceDelta, formatPrice, formatPercentage } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import ConfigAlert from '@/components/ConfigAlert';

const KARACHI_AREAS = [
  'Gulshan-e-Iqbal',
  'North Nazimabad',
  'Clifton',
  'Saddar',
  'DHA',
  'Federal B Area',
  'Jamshed Town',
  'Gulberg Town',
  'Malir',
  'Korangi',
  'Nazimabad',
  'Liaquatabad',
];

function ReportFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get('productId');
  const initialPrice = searchParams.get('observedPrice');

  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<ProductWithPrices[]>(FALLBACK_PRODUCTS);
  const [shops, setShops] = useState<Shop[]>(FALLBACK_SHOPS);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || FALLBACK_PRODUCTS[0]?.id || ''
  );
  const [shopName, setShopName] = useState<string>('');
  const [area, setArea] = useState<string>('Gulshan-e-Iqbal');
  const [shopAddress, setShopAddress] = useState<string>('');
  const [observedPrice, setObservedPrice] = useState<string>(initialPrice || '');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      if (!isSupabaseConfigured) {
        setProducts(FALLBACK_PRODUCTS);
        setShops(FALLBACK_SHOPS);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

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
              effective_date,
              area,
              is_available
            )
          `)
          .order('name');

        if (!prodErr && prodData && prodData.length > 0) {
          setProducts(prodData as ProductWithPrices[]);
          if (initialProductId && prodData.some((p: any) => p.id === initialProductId)) {
            setSelectedProductId(initialProductId);
          } else if (!selectedProductId) {
            setSelectedProductId(prodData[0].id);
          }
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }

        const { data: shopData } = await supabase
          .from('shops')
          .select('*')
          .order('name');

        if (shopData && shopData.length > 0) {
          setShops(shopData);
        } else {
          setShops(FALLBACK_SHOPS);
        }
      } catch (err) {
        console.warn('Error loading report form data:', err);
        setProducts(FALLBACK_PRODUCTS);
        setShops(FALLBACK_SHOPS);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [initialProductId, initialPrice]);

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || products[0] || FALLBACK_PRODUCTS[0];
  const referencePriceObj = selectedProduct?.reference_prices?.[0];
  const refVal = referencePriceObj?.is_available ? Number(referencePriceObj.price) : null;
  const observedPriceNum = parseFloat(observedPrice) || 0;
  const calc = calculatePriceDelta(refVal, observedPriceNum);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      setErrorMessage('You must be logged in to submit a price report.');
      return;
    }

    if (!selectedProductId) {
      setErrorMessage('Please select a product.');
      return;
    }

    if (!shopName.trim()) {
      setErrorMessage('Please enter the shop or merchant name.');
      return;
    }

    if (!observedPrice || observedPriceNum <= 0) {
      setErrorMessage('Please enter a valid observed price.');
      return;
    }

    try {
      setSubmitting(true);

      let shopId: string | null = null;
      const existingShop = shops.find(
        (s) =>
          s.name.toLowerCase().trim() === shopName.toLowerCase().trim() &&
          s.area.toLowerCase().trim() === area.toLowerCase().trim()
      );

      if (existingShop && !existingShop.id.startsWith('s1000000')) {
        shopId = existingShop.id;
      } else {
        const { data: newShop, error: shopErr } = await supabase
          .from('shops')
          .insert({
            name: shopName.trim(),
            area: area,
            address: shopAddress.trim() || null,
          })
          .select()
          .single();

        if (!shopErr && newShop) {
          shopId = newShop.id;
        }
      }

      const { error: repErr } = await supabase.from('price_reports').insert({
        user_id: user.id,
        product_id: selectedProductId,
        shop_id: shopId,
        observed_price: observedPriceNum,
        reference_price_at_report: refVal,
        area: area,
        status: 'Unverified',
        notes: notes.trim() || null,
      });

      if (repErr) {
        throw repErr;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Failed to submit report:', err);
      setErrorMessage(err?.message || 'Failed to submit report. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user && !loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <ConfigAlert />
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <LogIn className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sign in to Submit a Price Observation
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto font-medium">
            To prevent spam and preserve community data integrity, price reports require a verified account.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/login?redirect=${encodeURIComponent(
                `/report?productId=${selectedProductId}&observedPrice=${observedPrice}`
              )}`}
              className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-6 py-3 rounded-xl text-sm shadow-sm transition-all duration-200 ease-in-out active:scale-[0.99]"
            >
              Log in to Continue
            </Link>
            <Link
              href={`/signup?redirect=${encodeURIComponent(
                `/report?productId=${selectedProductId}&observedPrice=${observedPrice}`
              )}`}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-6 py-3 rounded-xl text-sm transition-all duration-200 ease-in-out"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border-2 border-emerald-300/80 p-8 shadow-md space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Report Successfully Submitted!</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Thank you for contributing to price transparency in Karachi. Your observation is now recorded in the community database.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/reports"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200 ease-in-out active:scale-[0.99]"
            >
              <span>View Community Reports</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/my-reports"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200"
            >
              <span>View My Reports</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ConfigAlert />

      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100/90 text-emerald-900 border border-emerald-200 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
          <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
          <span>Crowdsourced Karachi Civic Report</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Submit a Price Observation
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-1.5 font-medium">
          Record what you were charged at a local Karachi store. Help your community spot unusual prices.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-200 space-y-5"
          >
            {errorMessage && (
              <div className="bg-rose-50 border-l-4 border-rose-500 p-3.5 rounded-r-xl text-xs text-rose-800 flex items-start gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Product Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Product / Essential Item *
              </label>
              {loading ? (
                <select
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-100 text-slate-400 font-medium"
                >
                  <option>Loading items...</option>
                </select>
              ) : (
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none cursor-pointer transition-all duration-200"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Observed Price Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Observed Price Charged (in PKR) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-mono font-bold text-lg">
                  Rs.
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  placeholder="e.g. 195"
                  value={observedPrice}
                  onChange={(e) => setObservedPrice(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 font-mono text-xl font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
                />
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Rate per {selectedProduct?.unit || 'unit'}
              </p>
            </div>

            {/* Shop Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Shop / Store Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Madina Super Store, Ahmed General Store"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
              />
            </div>

            {/* Karachi Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Karachi Neighborhood / Area *
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none cursor-pointer transition-all duration-200"
              >
                {KARACHI_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}, Karachi
                  </option>
                ))}
              </select>
            </div>

            {/* Shop Address / Landmark */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Address / Nearby Landmark (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Block 13-D, Main University Road"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Loose pack, standard quality"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 text-white font-medium py-3.5 px-6 rounded-xl hover:bg-emerald-800 hover:shadow-md active:scale-[0.99] transition-all duration-200 ease-in-out disabled:opacity-50 text-sm cursor-pointer"
              >
                {submitting ? (
                  <span>Saving observation to database...</span>
                ) : (
                  <>
                    <span>Submit Community Report</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-all duration-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Live Observation Preview
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-xs py-1.5 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Selected Product:</span>
                <span className="font-semibold text-slate-900">{selectedProduct?.name || '-'}</span>
              </div>

              <div className="flex justify-between text-xs py-1.5 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Official Reference Price:</span>
                <span className="font-semibold font-mono text-emerald-800">
                  {refVal !== null ? formatPrice(refVal) : 'Unavailable'}
                </span>
              </div>

              <div className="flex justify-between text-xs py-1.5 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Your Observed Price:</span>
                <span className="font-semibold font-mono text-slate-900">
                  {observedPriceNum > 0 ? formatPrice(observedPriceNum) : 'Rs. 0'}
                </span>
              </div>

              {observedPriceNum > 0 && refVal !== null && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-600 font-medium">Status:</span>
                    <StatusBadge status={calc.status} size="sm" />
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 shadow-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Difference (PKR):</span>
                      <span className="font-mono font-bold">
                        {calc.diffRupees !== null && calc.diffRupees >= 0 ? '+' : ''}
                        {formatPrice(calc.diffRupees)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Difference (%):</span>
                      <span className="font-mono font-bold">
                        {formatPercentage(calc.diffPercentage)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 text-[11px] text-slate-500 border-t border-slate-200 flex items-start gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                Observations are aggregated anonymously across Karachi to protect consumer privacy.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto p-12 text-center text-slate-500 animate-pulse font-medium">
          Loading report form...
        </div>
      }
    >
      <ReportFormContent />
    </Suspense>
  );
}
