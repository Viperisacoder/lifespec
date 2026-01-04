import { supabase } from './supabaseClient';
import { BlueprintPayload, BlueprintInputs, SavedBlueprint } from './blueprintTypes';

/**
 * Save a blueprint for a user, replacing any existing blueprint
 * @param params Blueprint data and optional parameters
 * @returns The saved blueprint or null if error
 */
export async function saveBlueprintForUser(params: {
  userId: string;
  blueprintData: BlueprintPayload;
  name?: string;
  inputs?: BlueprintInputs;
}): Promise<SavedBlueprint | null> {
  try {
    const { userId, blueprintData, name = 'Lifestyle Blueprint', inputs } = params;
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Upsert the blueprint data, replacing any existing blueprint for this user
    const { data, error } = await supabase
      .from('blueprints')
      .upsert(
        {
          user_id: userId,
          name,
          blueprint_json: {
            ...blueprintData,
            inputs: inputs || {}
          },
          metrics_json: {
            totalMonthly: blueprintData.totalMonthly,
            totalYearly: blueprintData.totalYearly,
            requiredGrossYearly: blueprintData.requiredGrossYearly
          },
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' } // This ensures one blueprint per user
      )
      .select()
      .single();

    if (error) {
      console.error('Error saving blueprint:', error);
      throw error;
    }

    return data as SavedBlueprint;
  } catch (error) {
    console.error('Failed to save blueprint:', error);
    return null;
  }
}

/**
 * Delete a blueprint for a user
 * @param userId The user ID
 * @returns True if successful, false otherwise
 */
export async function deleteBlueprintForUser(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('blueprints')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting blueprint:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete blueprint:', error);
    return false;
  }
}

/**
 * Save blueprint for the current authenticated user
 * @param blueprintData The blueprint data to save
 * @param name Optional name for the blueprint
 * @returns The saved blueprint or null if error
 */
export async function saveBlueprint(blueprintData: BlueprintPayload, name?: string): Promise<SavedBlueprint | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    return saveBlueprintForUser({
      userId: user.id,
      blueprintData,
      name
    });
  } catch (error) {
    console.error('Failed to save blueprint:', error);
    return null;
  }
}

/**
 * Fetch the blueprint for the current authenticated user
 * @returns The user's blueprint or null if not found
 */
export async function fetchBlueprint(): Promise<SavedBlueprint | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('blueprints')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      console.error('Error fetching blueprint:', error);
      throw error;
    }

    return data as SavedBlueprint;
  } catch (error) {
    console.error('Failed to fetch blueprint:', error);
    return null;
  }
}

/**
 * Update the inputs for a user's blueprint
 * @param userId The user ID
 * @param inputs The financial inputs to update
 * @returns The updated blueprint or null if error
 */
export async function updateBlueprintInputs(userId: string, inputs: BlueprintInputs): Promise<SavedBlueprint | null> {
  try {
    // First get the current blueprint to update the inputs in blueprint_json
    const { data: currentBlueprint, error: fetchError } = await supabase
      .from('blueprints')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching current blueprint:', fetchError);
      throw fetchError;
    }
    
    // Update the blueprint with new inputs
    const { data, error } = await supabase
      .from('blueprints')
      .update({ 
        blueprint_json: {
          ...currentBlueprint.blueprint_json,
          inputs
        },
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating blueprint inputs:', error);
      throw error;
    }

    return data as SavedBlueprint;
  } catch (error) {
    console.error('Failed to update blueprint inputs:', error);
    return null;
  }
}

/**
 * Reset the inputs for a user's blueprint
 * @param userId The user ID
 * @returns The updated blueprint or null if error
 */
export async function resetBlueprintInputs(userId: string): Promise<SavedBlueprint | null> {
  try {
    // First get the current blueprint to update the inputs in blueprint_json
    const { data: currentBlueprint, error: fetchError } = await supabase
      .from('blueprints')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching current blueprint:', fetchError);
      throw fetchError;
    }
    
    // Update the blueprint with empty inputs
    const { data, error } = await supabase
      .from('blueprints')
      .update({ 
        blueprint_json: {
          ...currentBlueprint.blueprint_json,
          inputs: {}
        },
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error resetting blueprint inputs:', error);
      throw error;
    }

    return data as SavedBlueprint;
  } catch (error) {
    console.error('Failed to reset blueprint inputs:', error);
    return null;
  }
}

/**
 * Get a pending blueprint from localStorage
 * @returns The pending blueprint or null if not found
 */
export function getPendingBlueprint(): BlueprintPayload | null {
  try {
    if (typeof window === 'undefined') return null;
    
    const pending = localStorage.getItem('lifespec_pending_blueprint');
    if (!pending) return null;
    
    return JSON.parse(pending) as BlueprintPayload;
  } catch (error) {
    console.error('Failed to parse pending blueprint:', error);
    return null;
  }
}

/**
 * Save a pending blueprint to localStorage
 * @param payload The blueprint data to save
 */
export function setPendingBlueprint(payload: BlueprintPayload): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lifespec_pending_blueprint', JSON.stringify(payload));
}

/**
 * Clear the pending blueprint from localStorage
 */
export function clearPendingBlueprint(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lifespec_pending_blueprint');
}
