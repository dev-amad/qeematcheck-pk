iimport { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your-supabase-project-id') &&
  !supabaseUrl.includes('xyzcompany')
);

// Fall back to empty strings so invalid requests don't silently hit a third-party dummy host
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);