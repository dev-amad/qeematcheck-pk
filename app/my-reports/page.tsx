'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  PlusCircle,
  Calendar,
  Store,
  MapPin,
  LogIn,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { PriceReportWithDetails } from '@/lib/supabase/types';
import { calculatePriceDelta, formatPrice, formatDate } from '@/lib/utils';
import StatusBadge from '@/components/StatusBadge';
import ConfigAlert from '@/components/ConfigAlert';

export default function MyReportsPage() {
  const [user, setUser] = useState<any>(null);
  const [myReports, setMyReports] = useState<PriceReportWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUserReports() {
      if (!isSupabaseConfigured) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        if (isMounted) setLoading(true);

        // Fetch current user via auth.getUser() for reliable state retrieval
        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !currentUser) {
          if (isMounted) {
            setUser(null);
            setMyReports([]);
            setLoading(false);
          }
          return;
        }

        if (isMounted) setUser(currentUser);

        // Primary relational query without strict INNER JOIN flags (!product_id / !shop_id)
        let { data, error } = await supabase
          .from('price_reports')
          .select(`
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
          `)
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        // Fallback: If relational query fails due to schema mismatch, fetch standard flat records
        if (error) {
          console.warn('Relational query failed, falling back to basic query:', error);
          const fallbackRes = await supabase
            .from('price_reports')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });

          if (!fallbackRes.error && fallbackRes.data) {
            data = fallbackRes.data as any;
            error = null;
          }
        }

        if (!error && data && isMounted) {
          setMyReports(data as any);
        }
      } catch (err) {
        console.error('Error fetching user reports:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadUserReports();

    // Re-verify fetch on auth changes (login, logout, token refresh)
    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          loadUserReports();
        } else {
          setUser(null);
          setMyReports([]);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      authSubscription?.subscription?.unsubscribe();
    };
  }, []);

  if (!user && !loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <ConfigAlert />
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 p-8 shadow-sm space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <LogIn className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sign in to View Your Reports
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            Log in to view the history and status of price observations you have submitted to Qeemat Check PK.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login?redirect=/my-reports"
              className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-6 py-3 rounded-xl text-sm shadow-sm transition-all duration-200 ease-in-out active:scale-[0.99]"
            >
              Log in to Your Account
            </Link>
            <Link
              href="/signup?redirect=/my-reports"
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-6 py-3 rounded-xl text-sm transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ConfigAlert />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-100/90 text-emerald-900 border border-emerald-200 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-2">
            <User className="w-3.5 h-3.5 text-emerald-700" />
            <span>Personal Activity Log</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            My Submitted Price Reports
          </h1>
          <p className="text-slate-600 text-sm mt-1 font-medium">
            Logged in as <span className="font-semibold text-slate-800">{user?.email}</span>
          </p>
        </div>

        <div>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ease-in-out active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit New Report</span>
          </Link>
        </div>
      </div>

      {/* User Stats Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <span className="text-xs uppercase font-bold text-slate-500 block">
            Total Submissions
          </span>
          <span className="text-3xl font-bold font-mono text-slate-900 mt-1 block">
            {myReports.length}
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <span className="text-xs uppercase font-bold text-slate-500 block">
            Potential Overpricings Logged
          </span>
          <span className="text-3xl font-bold font-mono text-rose-600 mt-1 block">
            {
              myReports.filter((r) => {
                const calc = calculatePriceDelta(r.reference_price_at_report, r.observed_price);
                return calc.status === 'potential_overpricing';
              }).length
            }
          </span>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
          <span className="text-xs uppercase font-bold text-slate-500 block">
            Contributor Status
          </span>
          <span className="text-sm font-semibold text-emerald-700 mt-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Active Contributor</span>
          </span>
        </div>
      </div>

      {/* Reports Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white/80 border border-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : myReports.length > 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
          {myReports.map((rep) => {
            const calc = calculatePriceDelta(
              rep.reference_price_at_report,
              rep.observed_price
            );

            return (
              <div key={rep.id} className="p-6 hover:bg-slate-50/80 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-lg">
                        {rep.product?.name || 'Essential Product'}
                      </h3>
                      <StatusBadge status={calc.status} size="sm" />
                      <span className="text-xs bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono font-medium">
                        {rep.status || 'Unverified'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1 text-slate-800">
                        <Store className="w-3.5 h-3.5 text-slate-400" />
                        {rep.shop?.name || 'Local Store'}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {rep.area || rep.shop?.area || 'Karachi'}, Karachi
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(rep.created_at)}
                      </span>
                    </div>

                    {rep.notes && (
                      <p className="text-xs text-slate-500 italic mt-1">&ldquo;{rep.notes}&rdquo;</p>
                    )}
                  </div>

                  <div className="text-left md:text-right flex-shrink-0 bg-slate-50 md:bg-transparent p-3.5 md:p-0 rounded-xl">
                    <div className="text-lg font-bold font-mono text-slate-900">
                      {formatPrice(rep.observed_price)}
                      <span className="text-xs font-normal text-slate-500 ml-1">
                        /{rep.product?.unit || 'unit'}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-600 font-medium mt-0.5">
                      Ref at report:{' '}
                      {rep.reference_price_at_report
                        ? formatPrice(rep.reference_price_at_report)
                        : 'N/A'}{' '}
                      ({calc.diffRupees !== null && calc.diffRupees >= 0 ? '+' : ''}
                      {calc.diffRupees !== null ? formatPrice(calc.diffRupees) : ''})
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 p-12 text-center space-y-3">
          <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No reports submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
            You have not recorded any price observations. Check reference prices and submit what your local Karachi shop is charging.
          </p>
          <div className="pt-2">
            <Link
              href="/report"
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium px-5 py-3 rounded-xl transition-all duration-200 ease-in-out active:scale-[0.99]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit First Price Report</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}