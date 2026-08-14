import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PriceCalculation, PriceStatus } from './supabase/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) {
    return 'Unavailable';
  }
  return `Rs. ${Number(price).toLocaleString('en-PK', {
    minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercentage(pct: number | null | undefined): string {
  if (pct === null || pct === undefined || isNaN(pct)) {
    return 'N/A';
  }
  const prefix = pct > 0 ? '+' : '';
  return `${prefix}${pct.toFixed(1)}%`;
}

export function calculatePriceDelta(
  referencePrice: number | null | undefined,
  observedPrice: number | null | undefined
): PriceCalculation {
  if (observedPrice === null || observedPrice === undefined || isNaN(observedPrice) || observedPrice <= 0) {
    return {
      referencePrice: referencePrice ?? null,
      observedPrice: 0,
      diffRupees: null,
      diffPercentage: null,
      status: 'unavailable',
      statusLabel: 'Enter a valid shop price',
      isOverpriced: false,
    };
  }

  if (referencePrice === null || referencePrice === undefined || isNaN(referencePrice) || referencePrice <= 0) {
    return {
      referencePrice: null,
      observedPrice,
      diffRupees: null,
      diffPercentage: null,
      status: 'unavailable',
      statusLabel: 'No official reference price available',
      isOverpriced: false,
    };
  }

  const diffRupees = observedPrice - referencePrice;
  const diffPercentage = (diffRupees / referencePrice) * 100;

  let status: PriceStatus = 'at_or_below';
  let statusLabel = 'At or below reference';
  let isOverpriced = false;

  if (diffPercentage > 10) {
    status = 'potential_overpricing';
    statusLabel = 'Potential overpricing';
    isOverpriced = true;
  } else if (diffPercentage > 0) {
    status = 'above';
    statusLabel = 'Above reference';
    isOverpriced = false;
  } else {
    status = 'at_or_below';
    statusLabel = 'At or below reference';
    isOverpriced = false;
  }

  return {
    referencePrice,
    observedPrice,
    diffRupees,
    diffPercentage,
    status,
    statusLabel,
    isOverpriced,
  };
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'Recent';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
