-- ========================================================
-- QEEMATCHECK 🇵🇰 DATABASE SCHEMA & OFFICIAL KARACHI REFERENCE DATA
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. REFERENCE PRICES TABLE
CREATE TABLE IF NOT EXISTS public.reference_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  price NUMERIC(10, 2), -- Can be NULL if unavailable
  unit TEXT NOT NULL,
  source TEXT NOT NULL,
  source_url TEXT,
  effective_date DATE NOT NULL,
  area TEXT NOT NULL DEFAULT 'Karachi',
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SHOPS TABLE
CREATE TABLE IF NOT EXISTS public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PRICE REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.price_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES public.shops(id) ON DELETE SET NULL,
  observed_price NUMERIC(10, 2) NOT NULL,
  reference_price_at_report NUMERIC(10, 2),
  area TEXT NOT NULL,
  status TEXT DEFAULT 'Verified',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reference_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_reports ENABLE ROW LEVEL SECURITY;

-- Read policies for public
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Reference Prices" ON public.reference_prices;
CREATE POLICY "Public Read Reference Prices" ON public.reference_prices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Shops" ON public.shops;
CREATE POLICY "Public Read Shops" ON public.shops FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Price Reports" ON public.price_reports;
CREATE POLICY "Public Read Price Reports" ON public.price_reports FOR SELECT USING (true);

-- Authenticated Insert & Read policies
DROP POLICY IF EXISTS "Users can create reports" ON public.price_reports;
CREATE POLICY "Users can create reports" ON public.price_reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert shops" ON public.shops;
CREATE POLICY "Users can insert shops" ON public.shops FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Alter table migrations if upgrading existing tables
ALTER TABLE public.reference_prices ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.reference_prices ALTER COLUMN price DROP NOT NULL;
ALTER TABLE public.price_reports ALTER COLUMN reference_price_at_report DROP NOT NULL;

-- ========================================================
-- OFFICIAL COMMISSIONER KARACHI NOTIFICATIONS
-- ========================================================

-- Products Seed
INSERT INTO public.products (id, name, category, unit) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Sugar (Retail)', 'Grains & Essentials', '1 kg'),
  ('c1000000-0000-0000-0000-000000000002', 'Beef Bone-in (گوشت ہڈی والا)', 'Meat & Poultry', '1 kg'),
  ('c1000000-0000-0000-0000-000000000003', 'Beef Boneless (گوشت بغیر ہڈی)', 'Meat & Poultry', '1 kg'),
  ('c1000000-0000-0000-0000-000000000004', 'Mutton Goat (بکرا مٹن)', 'Meat & Poultry', '1 kg'),
  ('c1000000-0000-0000-0000-000000000005', 'Broiler Chicken Retail (مرغی پرچون)', 'Meat & Poultry', '1 kg'),
  ('c1000000-0000-0000-0000-000000000006', 'Farm Eggs Retail (انڈہ فارمی)', 'Meat & Poultry', '1 Dozen'),
  ('c1000000-0000-0000-0000-000000000007', 'Chapati 100g (چپاتی)', 'Tandoor & Bakery', '1 Piece'),
  ('c1000000-0000-0000-0000-000000000008', 'Tandoori Naan 120g (تندوری نان)', 'Tandoor & Bakery', '1 Piece'),
  ('c1000000-0000-0000-0000-000000000009', 'Plain Bread Class A 400g (ڈبل روٹی)', 'Tandoor & Bakery', '400g'),
  ('c1000000-0000-0000-0000-000000000010', 'Kernal Basmati Export 1121', 'Pulses & Rice', '1 kg'),
  ('c1000000-0000-0000-0000-000000000011', 'Daal Chana 1st Quality (دال چنا)', 'Pulses & Rice', '1 kg'),
  ('c1000000-0000-0000-0000-000000000012', 'Potato 1st Quality (آلو اول)', 'Vegetables', '1 kg'),
  ('c1000000-0000-0000-0000-000000000013', 'Onion Big 1st Quality (پیاز بڑی)', 'Vegetables', '1 kg'),
  ('c1000000-0000-0000-0000-000000000014', 'Tomato 1st Quality (ٹماٹر اول)', 'Vegetables', '1 kg'),
  ('c1000000-0000-0000-0000-000000000015', 'Banana 1st Quality (کیلا درجہ اول)', 'Fruits', '1 Dozen'),
  ('c1000000-0000-0000-0000-000000000016', 'Imported Cooking Oil 1L', 'Pantry Essentials', '1 Liter')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  unit = EXCLUDED.unit;

-- Reference Prices Seed (From Official Notifications)
INSERT INTO public.reference_prices (product_id, price, unit, source, source_url, effective_date, area, is_available) VALUES
  ('c1000000-0000-0000-0000-000000000001', 141.00, '1 kg', 'Commissioner Karachi Div Notification No. CK/AC(HQ)/164/2026', '/data/official-price-lists/sugar-notification.jpg', '2026-02-14', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000002', 1000.00, '1 kg', 'Commissioner Karachi Div Notification No. CK/AC(HQ)/171/2026', '/data/official-price-lists/meat-notification.jpg', '2026-02-16', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000003', 1300.00, '1 kg', 'Commissioner Karachi Div Notification No. CK/AC(HQ)/171/2026', '/data/official-price-lists/meat-notification.jpg', '2026-02-16', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000004', 2200.00, '1 kg', 'Commissioner Karachi Div Notification No. CK/AC(HQ)/171/2026', '/data/official-price-lists/meat-notification.jpg', '2026-02-16', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000005', 320.00, '1 kg', 'Karachi Commissionerate Market Committee Rate', '/data/official-price-lists/poultry-notification.jpg', '2026-08-14', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000006', 248.00, '1 Dozen', 'Karachi Commissionerate Market Committee Rate', '/data/official-price-lists/poultry-notification.jpg', '2026-08-14', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000007', 14.00, '1 Piece', 'Commissioner Karachi Div Notification No. CK/AC(HQ)/167/2026', '/data/official-price-lists/nan-chapati-notification.jpg', '2026-02-16', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000008', 18.00, '1 Piece', 'Commissioner Karachi Div Notification No. CK/AC(HQ)/167/2026', '/data/official-price-lists/nan-chapati-notification.jpg', '2026-02-16', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000009', 110.00, '400g', 'Commissioner Karachi Div Notification No. CK/AC(HQ)/170/2026', '/data/official-price-lists/bakery-notification.jpg', '2026-02-16', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000010', 385.00, '1 kg', 'Commissioner Karachi Div Notification No. CK/AC(HQ)/415/2026', '/data/official-price-lists/pulses-spices-notification.jpg', '2026-05-12', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000011', 215.00, '1 kg', 'Commissioner Karachi Div Notification No. CK/AC(HQ)/415/2026', '/data/official-price-lists/pulses-spices-notification.jpg', '2026-05-12', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000012', 40.00, '1 kg', 'Karachi Commissionerate Market Committee Rate', '/data/official-price-lists/vegetables-notification.jpg', '2026-08-14', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000013', 115.00, '1 kg', 'Karachi Commissionerate Market Committee Rate', '/data/official-price-lists/vegetables-notification.jpg', '2026-08-14', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000014', 207.00, '1 kg', 'Karachi Commissionerate Market Committee Rate', '/data/official-price-lists/vegetables-notification.jpg', '2026-08-14', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000015', 140.00, '1 Dozen', 'Karachi Commissionerate Market Committee Rate', '/data/official-price-lists/fruits-notification.jpg', '2026-08-14', 'Karachi', true),
  ('c1000000-0000-0000-0000-000000000016', NULL, '1 Liter', 'No Official Notified Rate', NULL, '2026-08-14', 'Karachi', false);

-- Seed Karachi Shops
INSERT INTO public.shops (id, name, area, address) VALUES
  ('s1000000-0000-0000-0000-000000000001', 'Madina Super Store', 'Gulshan-e-Iqbal', 'Block 13-D, Main University Road'),
  ('s1000000-0000-0000-0000-000000000002', 'Bismillah Meat Shop', 'North Nazimabad', 'Block H, Near Five Star Chowrangi'),
  ('s1000000-0000-0000-0000-000000000003', 'Subhanallah Kiryana', 'Clifton', 'Block 2, Near Bilawal Chowrangi')
ON CONFLICT (id) DO NOTHING;
