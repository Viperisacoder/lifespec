import { createBrowserClient } from '@supabase/ssr';

/**
 * Check if user is Pro
 * Use this in client components to determine if Pro features should be shown
 */
export async function checkUserIsPro(userId: string): Promise<boolean> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabase
      .from('profiles')
      .select('is_pro')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking Pro status:', error);
      return false;
    }

    return data?.is_pro ?? false;
  } catch (error) {
    console.error('Error in checkUserIsPro:', error);
    return false;
  }
}

/**
 * Get Pro status and details for a user
 */
export async function getUserProStatus(userId: string) {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    const { data, error } = await supabase
      .from('profiles')
      .select('is_pro, pro_unlocked_at, pro_source, pro_payer_email')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching Pro status:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProStatus:', error);
    return null;
  }
}

/**
 * Format Pro unlock date for display
 */
export function formatProUnlockDate(date: string | null): string {
  if (!date) return 'Not unlocked';
  
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Unknown date';
  }
}
