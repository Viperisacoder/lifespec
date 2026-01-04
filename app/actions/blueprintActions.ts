'use server';

import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { UserInputs } from '@/lib/userInputTypes';

// Result types for safe error handling
type SuccessResult<T> = { success: true; data: T };
type ErrorResult = { success: false; reason: 'UNAUTHENTICATED' | 'NOT_FOUND' | 'DATABASE_ERROR' | 'UNKNOWN_ERROR' };
type ActionResult<T> = SuccessResult<T> | ErrorResult;

/**
 * Safe auth check that returns a result instead of throwing
 * Uses server-side Supabase client with cookie support
 */
async function getAuthenticatedUser() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Auth error:', error.message);
      return { user: null, error: 'UNAUTHENTICATED' as const };
    }
    
    if (!data.user) {
      console.warn('No authenticated user found');
      return { user: null, error: 'UNAUTHENTICATED' as const };
    }
    
    console.log('Auth successful, user:', data.user.id);
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Unexpected auth error:', error);
    return { user: null, error: 'UNAUTHENTICATED' as const };
  }
}

export async function fetchUserInputs(): Promise<ActionResult<UserInputs>> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    
    if (authError) {
      console.log('Auth check failed, returning NOT_FOUND (user may not have inputs yet)');
      return { success: false, reason: 'NOT_FOUND' };
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('lifespec_user_inputs')
      .select('*')
      .eq('user_id', user!.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, reason: 'NOT_FOUND' };
      }
      console.error('Error fetching user inputs:', error);
      return { success: false, reason: 'DATABASE_ERROR' };
    }

    return { success: true, data: data as UserInputs };
  } catch (error) {
    console.error('Unexpected error fetching user inputs:', error);
    return { success: false, reason: 'NOT_FOUND' };
  }
}

export async function upsertUserInputs(inputs: Partial<UserInputs>, userId?: string): Promise<ActionResult<UserInputs>> {
  try {
    let user_id = userId;
    
    // If userId not provided, try to get from server auth
    if (!user_id) {
      const { user, error: authError } = await getAuthenticatedUser();
      if (authError) {
        return { success: false, reason: authError };
      }
      user_id = user!.id;
    }

    const supabase = await createServerSupabaseClient();
    const payload = {
      user_id,
      ...inputs,
      updated_at: new Date().toISOString(),
    };

    console.log('Upserting user inputs for user:', user_id);
    const { data, error } = await supabase
      .from('lifespec_user_inputs')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('Error upserting user inputs:', error);
      return { success: false, reason: 'DATABASE_ERROR' };
    }

    console.log('User inputs upserted successfully');
    return { success: true, data: data as UserInputs };
  } catch (error) {
    console.error('Unexpected error upserting user inputs:', error);
    return { success: false, reason: 'UNKNOWN_ERROR' };
  }
}

export async function deleteBlueprint(): Promise<ActionResult<boolean>> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    
    if (authError) {
      return { success: false, reason: authError };
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('lifespec_blueprints')
      .delete()
      .eq('user_id', user!.id);

    if (error) {
      console.error('Error deleting blueprint:', error);
      return { success: false, reason: 'DATABASE_ERROR' };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error('Unexpected error deleting blueprint:', error);
    return { success: false, reason: 'UNKNOWN_ERROR' };
  }
}

export async function fetchBlueprintFromDB(): Promise<ActionResult<any>> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    
    if (authError) {
      return { success: false, reason: authError };
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('lifespec_blueprints')
      .select('*')
      .eq('user_id', user!.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: false, reason: 'NOT_FOUND' };
      }
      console.error('Error fetching blueprint:', error);
      return { success: false, reason: 'DATABASE_ERROR' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching blueprint:', error);
    return { success: false, reason: 'UNKNOWN_ERROR' };
  }
}
