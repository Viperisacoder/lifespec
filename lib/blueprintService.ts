import { getSupabaseBrowserClient } from './supabase/browser';
import { BlueprintPayload } from './blueprintTypes';

export const PENDING_BLUEPRINT_KEY = 'lifespec_pending_blueprint';

/**
 * Enhanced error result with full error details
 */
interface ErrorDetails {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
  raw?: any;
}

type ServiceResult<T> = 
  | { success: true; data: T }
  | { success: false; reason: string; error: ErrorDetails };

/**
 * Extract full error details from Supabase error
 */
function extractErrorDetails(error: any): ErrorDetails {
  const details: ErrorDetails = {
    message: 'Unknown error occurred',
  };

  if (!error) {
    return details;
  }

  // Handle PostgreSQL/PostgREST error object
  if (error.message) {
    details.message = error.message;
  }
  if (error.code) {
    details.code = error.code;
  }
  if (error.details) {
    details.details = error.details;
  }
  if (error.hint) {
    details.hint = error.hint;
  }

  // Store raw error for debugging
  details.raw = error;

  return details;
}

/**
 * Validate blueprint payload
 */
function validateBlueprint(payload: any): boolean {
  if (!payload || typeof payload !== 'object') return false;
  if (typeof payload.totalMonthly !== 'number') return false;
  if (typeof payload.totalYearly !== 'number') return false;
  if (typeof payload.requiredGrossYearly !== 'number') return false;
  return true;
}

/**
 * Save a blueprint for the current user
 * Uses upsert with onConflict to enforce 1 blueprint per user atomically
 * 
 * @param payload The blueprint data to save
 * @param name Optional name for the blueprint
 * @returns Result with full error details on failure
 */
export async function saveBlueprint(
  payload: BlueprintPayload
): Promise<ServiceResult<any>> {
  try {
    // Validate payload
    if (!validateBlueprint(payload)) {
      return {
        success: false,
        reason: 'VALIDATION_ERROR',
        error: {
          message: 'Invalid blueprint payload: missing required fields (totalMonthly, totalYearly, requiredGrossYearly)',
        },
      };
    }

    const supabase = getSupabaseBrowserClient();

    // Get current user - HARD FAIL if not authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error:', authError);
      return {
        success: false,
        reason: 'AUTH_ERROR',
        error: extractErrorDetails(authError),
      };
    }

    if (!user) {
      return {
        success: false,
        reason: 'UNAUTHENTICATED',
        error: {
          message: 'User must be signed in to save a blueprint',
        },
      };
    }

    console.log(`[saveBlueprint] Saving blueprint for user ${user.id}`);

    // Upsert blueprint with onConflict on user_id
    // This atomically replaces any existing blueprint for this user
    const { data, error } = await (supabase
      .from('blueprints') as any)
      .upsert(
        {
          user_id: user.id,
          blueprint: payload,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id', // Enforce 1 blueprint per user
        }
      )
      .select()
      .single();

    if (error) {
      console.error('[saveBlueprint] Database error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        raw: JSON.stringify(error),
      });

      return {
        success: false,
        reason: 'DATABASE_ERROR',
        error: extractErrorDetails(error),
      };
    }

    console.log('[saveBlueprint] Blueprint saved successfully:', data?.id);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('[saveBlueprint] Unexpected error:', error);

    return {
      success: false,
      reason: 'UNKNOWN_ERROR',
      error: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        raw: error,
      },
    };
  }
}

/**
 * Get the current user's blueprint
 */
export async function getBlueprint(): Promise<ServiceResult<any | null>> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        reason: 'UNAUTHENTICATED',
        error: {
          message: 'User must be signed in',
        },
      };
    }

    const { data, error } = await supabase
      .from('blueprints')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // PGRST116 means no rows found, which is OK
      if (error.code === 'PGRST116') {
        return { success: true, data: null };
      }

      console.error('[getBlueprint] Database error:', extractErrorDetails(error));
      return {
        success: false,
        reason: 'DATABASE_ERROR',
        error: extractErrorDetails(error),
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error('[getBlueprint] Unexpected error:', error);
    return {
      success: false,
      reason: 'UNKNOWN_ERROR',
      error: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        raw: error,
      },
    };
  }
}

/**
 * Delete the current user's blueprint
 */
export async function deleteBlueprint(): Promise<ServiceResult<boolean>> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        reason: 'UNAUTHENTICATED',
        error: {
          message: 'User must be signed in',
        },
      };
    }

    const { error } = await supabase
      .from('blueprints')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('[deleteBlueprint] Database error:', extractErrorDetails(error));
      return {
        success: false,
        reason: 'DATABASE_ERROR',
        error: extractErrorDetails(error),
      };
    }

    return { success: true, data: true };
  } catch (error) {
    console.error('[deleteBlueprint] Unexpected error:', error);
    return {
      success: false,
      reason: 'UNKNOWN_ERROR',
      error: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        raw: error,
      },
    };
  }
}

/**
 * Import pending blueprint from localStorage after user signs in
 */
export async function importPendingBlueprint(): Promise<boolean> {
  try {
    const pendingData = localStorage.getItem(PENDING_BLUEPRINT_KEY);
    if (!pendingData) return false;

    const pendingBlueprint = JSON.parse(pendingData);
    const result = await saveBlueprint(pendingBlueprint.blueprint_json);

    if (result.success) {
      localStorage.removeItem(PENDING_BLUEPRINT_KEY);
      return true;
    }

    return false;
  } catch (error) {
    console.error('[importPendingBlueprint] Error:', error);
    return false;
  }
}
