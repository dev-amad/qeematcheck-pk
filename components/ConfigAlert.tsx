'use client';

import React from 'react';
import { AlertTriangle, Database } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export default function ConfigAlert() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-1.5">
            <Database className="w-4 h-4" /> Supabase Connection Required
          </h3>
          <p className="text-xs text-amber-700 mt-1">
            To connect live database records and authenticate users, please set your{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900">
              NEXT_PUBLIC_SUPABASE_URL
            </code>{' '}
            and{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{' '}
            in <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900">.env.local</code> and run the SQL script in{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-900">supabase/schema.sql</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
