'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

function ResetPasswordForm() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

    useEffect(() => {
        const client = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );
        setSupabase(client);
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) return;

        setLoading(true);
        setMessage(null);
        setError(null);

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                setError(updateError.message);
            } else {
                setMessage('Password updated successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full bg-[#191f31] border border-[#2e3447] p-8 rounded-2xl shadow-2xl">
            <h1 className="text-2xl font-bold text-[#dce1fb] mb-2 text-center">Set New Password</h1>
            <p className="text-sm text-[#bbcac0] mb-6 text-center">
                Please enter your new secure password below.
            </p>

            {message && (
                <div className="mb-4 p-4 rounded-xl bg-[#5af0b3]/10 border border-[#5af0b3]/30 text-[#5af0b3] text-sm font-medium">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#bbcac0] mb-2">
                        New Password
                    </label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#0c1324] border border-[#2e3447] text-[#dce1fb] px-4 py-3 rounded-xl focus:outline-none focus:border-[#5af0b3] text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !supabase}
                    className="w-full bg-[#5af0b3] text-[#003825] font-semibold py-3 px-6 rounded-xl hover:bg-[#34d399] transition font-mono text-xs uppercase tracking-wider disabled:opacity-50 mt-2"
                >
                    {loading ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-[#0c1324] text-[#dce1fb] flex items-center justify-center p-6">
            <Suspense fallback={<div className="text-sm text-[#bbcac0]">Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}