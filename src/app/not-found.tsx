import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0c1324] text-[#dce1fb] flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-[#191f31] border border-[#2e3447] p-8 rounded-2xl shadow-2xl">
                <h1 className="text-6xl font-extrabold text-[#5af0b3] font-mono mb-2">404</h1>
                <h2 className="text-xl font-semibold mb-4 text-[#dce1fb]">Market Report Not Found</h2>
                <p className="text-sm text-[#bbcac0] mb-6 leading-relaxed">
                    The page or bazaar price record you are trying to access does not exist or has been relocated.
                </p>
                <Link
                    href="/"
                    className="inline-block w-full bg-[#5af0b3] text-[#003825] font-semibold py-3 px-6 rounded-xl hover:bg-[#34d399] transition font-mono text-xs uppercase tracking-wider"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
}