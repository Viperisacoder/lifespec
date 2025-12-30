import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  // Only initialize in browser context
  if (typeof window === 'undefined') {
    throw new Error('Supabase browser client can only be used in browser context');
  }

  // Lazy initialization
  if (!supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        'Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
      );
    }

    supabaseClient = createClient(url, key);
  }

  return supabaseClient;
}
