'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserPlus, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import ConfigAlert from '@/components/ConfigAlert';

function SignUpFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signedUpSuccess, setSignedUpSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isSupabaseConfigured) {
      setErrorMessage('Supabase is not configured. Please check your credentials in .env.local.');
      return;
    }

    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        router.push(redirectPath);
        router.refresh();
      } else {
        setSignedUpSuccess(true);
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      setErrorMessage(err?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (signedUpSuccess) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-md p-8 rounded-2xl border-2 border-emerald-300 shadow-md text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Account Created!</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Your account has been registered for Qeemat Check PK. If Supabase email verification is active, please check your inbox before signing in.
          </p>
          <div className="pt-4">
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectPath)}`}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-6 py-3 rounded-xl text-sm shadow-sm transition-all duration-200 ease-in-out active:scale-[0.99]"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/90 p-8 space-y-6">
        <ConfigAlert />

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Join Kimat Check PK
          </h2>
          <p className="mt-1 text-sm text-slate-600 font-medium">
            Create an account to submit price observations in Karachi.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-3.5 rounded-r-xl text-xs text-rose-800 flex items-start gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out disabled:opacity-50 text-sm cursor-pointer active:scale-[0.99]"
          >
            {loading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600 font-medium">
          Already have an account?{' '}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirectPath)}`}
            className="font-bold text-emerald-700 hover:text-emerald-800 underline"
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400 font-medium">Loading signup form...</div>}>
      <SignUpFormContent />
    </Suspense>
  );
}
