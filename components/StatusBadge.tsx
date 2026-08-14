'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { PriceStatus } from '@/lib/supabase/types';

interface StatusBadgeProps {
  status: PriceStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1 font-medium',
    md: 'text-xs md:text-sm px-3 py-1.5 gap-1.5 font-medium',
    lg: 'text-sm md:text-base px-4 py-2 gap-2 font-semibold',
  };

  if (status === 'at_or_below') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-[#f0fdf4] text-emerald-800 border border-emerald-300/80 shadow-xs ${sizeClasses[size]}`}
      >
        {showIcon && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
        <span>At or below reference</span>
      </span>
    );
  }

  if (status === 'above') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-[#fffbeb] text-amber-900 border border-amber-300/80 shadow-xs ${sizeClasses[size]}`}
      >
        {showIcon && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
        <span>Above reference</span>
      </span>
    );
  }

  if (status === 'potential_overpricing') {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-[#fff1f2] text-rose-800 border border-rose-300/80 shadow-xs ${sizeClasses[size]}`}
      >
        {showIcon && <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />}
        <span>Potential overpricing</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses[size]}`}
    >
      {showIcon && <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />}
      <span>Unavailable</span>
    </span>
  );
}
