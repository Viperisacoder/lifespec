'use server';

import { supabase } from '@/lib/supabaseClient';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

// Result types
type SuccessResult<T> = { success: true; data: T };
type ErrorResult = { success: false; reason: 'UNAUTHENTICATED' | 'VALIDATION' | 'DB_ERROR' | 'UNKNOWN_ERROR' };
type ActionResult<T> = SuccessResult<T> | ErrorResult;

export interface BlueprintInputs {
  currentGrossIncomeYearly: number;
  plannedSavingsMonthly: number;
  effectiveTaxRatePercent: number;
  otherMonthlyIncome?: number;
  monthlyDebtPayments?: number;
}

// Safe auth check
async function getAuthenticatedUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.warn('Auth error:', error.message);
      await new Promise(resolve => setTimeout(resolve, 100));
      const { data: retryData, error: retryError } = await supabase.auth.getUser();
      
      if (retryError || !retryData.user) {
        return { user: null, error: 'UNAUTHENTICATED' as const };
      }
      return { user: retryData.user, error: null };
    }
    
    if (!data.user) {
      return { user: null, error: 'UNAUTHENTICATED' as const };
    }
    
    return { user: data.user, error: null };
  } catch (error) {
    console.error('Unexpected auth error:', error);
    return { user: null, error: 'UNAUTHENTICATED' as const };
  }
}

// Validate blueprint payload
function validateBlueprint(payload: any): boolean {
  if (!payload || typeof payload !== 'object') return false;
  if (!payload.totalMonthly || typeof payload.totalMonthly !== 'number') return false;
  if (!payload.totalYearly || typeof payload.totalYearly !== 'number') return false;
  if (!payload.requiredGrossYearly || typeof payload.requiredGrossYearly !== 'number') return false;
  return true;
}

export async function saveBlueprint(payload: any, title?: string): Promise<ActionResult<any>> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    
    if (authError) {
      return { success: false, reason: authError };
    }

    // Validate payload
    if (!validateBlueprint(payload)) {
      console.warn('Invalid blueprint payload');
      return { success: false, reason: 'VALIDATION' };
    }

    const { data, error } = await supabase
      .from('blueprints')
      .upsert(
        {
          user_id: user!.id,
          title: title || 'My Blueprint',
          payload,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Database error saving blueprint:', error);
      return { success: false, reason: 'DB_ERROR' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error saving blueprint:', error);
    return { success: false, reason: 'UNKNOWN_ERROR' };
  }
}

export async function getMyBlueprint(): Promise<ActionResult<any>> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    
    if (authError) {
      return { success: false, reason: authError };
    }

    const { data, error } = await supabase
      .from('blueprints')
      .select('*')
      .eq('user_id', user!.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found - return null data but success
        return { success: true, data: null };
      }
      console.error('Database error fetching blueprint:', error);
      return { success: false, reason: 'DB_ERROR' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error fetching blueprint:', error);
    return { success: false, reason: 'UNKNOWN_ERROR' };
  }
}

export async function deleteMyBlueprint(): Promise<ActionResult<boolean>> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    
    if (authError) {
      return { success: false, reason: authError };
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase
      .from('blueprints')
      .delete()
      .eq('user_id', user!.id);

    if (error) {
      console.error('Error deleting blueprint:', error);
      return { success: false, reason: 'DB_ERROR' };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error('Unexpected error deleting blueprint:', error);
    return { success: false, reason: 'UNKNOWN_ERROR' };
  }
}

export async function saveBlueprintInputs(inputs: BlueprintInputs): Promise<ActionResult<BlueprintInputs>> {
  try {
    // Validate inputs
    if (!inputs.currentGrossIncomeYearly || inputs.currentGrossIncomeYearly < 0) {
      return { success: false, reason: 'VALIDATION' };
    }
    if (!inputs.plannedSavingsMonthly || inputs.plannedSavingsMonthly < 0) {
      return { success: false, reason: 'VALIDATION' };
    }
    if (inputs.effectiveTaxRatePercent < 0 || inputs.effectiveTaxRatePercent > 60) {
      return { success: false, reason: 'VALIDATION' };
    }

    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) {
      return { success: false, reason: authError };
    }

    const supabase = await createServerSupabaseClient();
    
    // Get the user's blueprint
    const { data: blueprint, error: fetchError } = await supabase
      .from('blueprints')
      .select('id')
      .eq('user_id', user!.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching blueprint:', fetchError);
      return { success: false, reason: 'DB_ERROR' };
    }

    if (!blueprint) {
      return { success: false, reason: 'DB_ERROR' };
    }

    // Update blueprint with inputs
    const { error } = await supabase
      .from('blueprints')
      .update({
        payload: {
          ...blueprint,
          inputs,
          updated_at: new Date().toISOString(),
        },
      })
      .eq('id', blueprint.id)
      .select()
      .single();

    if (error) {
      console.error('Error saving inputs:', error);
      return { success: false, reason: 'DB_ERROR' };
    }

    return { success: true, data: inputs };
  } catch (error) {
    console.error('Unexpected error saving inputs:', error);
    return { success: false, reason: 'UNKNOWN_ERROR' };
  }
}

export async function fetchBlueprintInputs(): Promise<ActionResult<BlueprintInputs | null>> {
  try {
    const { user, error: authError } = await getAuthenticatedUser();
    if (authError) {
      return { success: false, reason: authError };
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('blueprints')
      .select('payload')
      .eq('user_id', user!.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { success: true, data: null };
      }
      console.error('Error fetching blueprint inputs:', error);
      return { success: false, reason: 'DB_ERROR' };
    }

    const inputs = data?.payload?.inputs || null;
    return { success: true, data: inputs };
  } catch (error) {
    console.error('Unexpected error fetching inputs:', error);
    return { success: false, reason: 'UNKNOWN_ERROR' };
  }
}
