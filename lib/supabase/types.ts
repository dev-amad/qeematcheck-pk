export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  created_at?: string;
}

export interface ReferencePrice {
  id: string;
  product_id: string;
  price: number | null;
  unit: string;
  source: string;
  source_url?: string | null;
  effective_date: string;
  area: string;
  is_available: boolean;
  created_at?: string;
}

export interface Shop {
  id: string;
  name: string;
  area: string;
  address?: string | null;
  created_at?: string;
}

export interface PriceReport {
  id: string;
  user_id?: string | null;
  product_id: string;
  shop_id?: string | null;
  observed_price: number;
  reference_price_at_report: number | null;
  area: string;
  status: string;
  notes?: string | null;
  created_at: string;
}

export interface PriceReportWithDetails extends PriceReport {
  product?: Product;
  shop?: Shop;
}

export type PriceStatus = 'at_or_below' | 'above' | 'potential_overpricing' | 'unavailable';

export interface PriceCalculation {
  referencePrice: number | null;
  observedPrice: number;
  diffRupees: number | null;
  diffPercentage: number | null;
  status: PriceStatus;
  statusLabel: string;
  isOverpriced: boolean;
}
