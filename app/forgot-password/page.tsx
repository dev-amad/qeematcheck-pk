'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (resetError) {
                setError(resetError.message);
            } else {
                setMessage('Password reset link sent! Check your email inbox.');
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0c1324] text-[#dce1fb] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-[#191f31] border border-[#2e3447] p-8 rounded-2xl shadow-2xl">
                <h1 className="text-2xl font-bold text-[#dce1fb] mb-2 text-center">Reset Password</h1>
                <p className="text-sm text-[#bbcac0] mb-6 text-center">
                    Enter your registered email address to receive a secure password recovery link.
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

                <form onSubmit={handleResetRequest} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-mono uppercase tracking-wider text-[#bbcac0] mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full bg-[#0c1324] border border-[#2e3447] text-[#dce1fb] px-4 py-3 rounded-xl focus:outline-none focus:border-[#5af0b3] text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#5af0b3] text-[#003825] font-semibold py-3 px-6 rounded-xl hover:bg-[#34d399] transition font-mono text-xs uppercase tracking-wider disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Sending Link...' : 'Send Recovery Link'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-xs text-[#5af0b3] hover:underline font-mono">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}