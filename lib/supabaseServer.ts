import { createClient } from '@supabase/supabase-js';

// Use the browser client in server actions - it works with the middleware
// The middleware ensures cookies are properly set and refreshed
export async function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
