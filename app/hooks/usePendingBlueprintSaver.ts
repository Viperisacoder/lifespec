'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { saveBlueprint, PENDING_BLUEPRINT_KEY } from '@/lib/blueprintService';
import { toast } from 'react-hot-toast';

/**
 * Hook to automatically save pending blueprints when a user logs in
 * @returns Object with auto-save status information
 */
export function usePendingBlueprintSaver() {
  const { user } = useAuth();
  const hasRunRef = useRef(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [autoSaveComplete, setAutoSaveComplete] = useState(false);

  useEffect(() => {
    // Only run once when the user becomes available and hasn't run before
    if (!user || hasRunRef.current) return;

    hasRunRef.current = true;

    const autoSavePendingBlueprint = async () => {
      try {
        // Check if there's a pending blueprint in localStorage
        const pendingBlueprintStr = localStorage.getItem(PENDING_BLUEPRINT_KEY);
        if (!pendingBlueprintStr) return;
        
        const pendingBlueprintData = JSON.parse(pendingBlueprintStr);
        const pendingBlueprint = pendingBlueprintData.blueprint_json;

        setIsAutoSaving(true);
        
        // Save the blueprint to Supabase using the saveBlueprint function
        const result = await saveBlueprint(pendingBlueprint);
        
        if (!result.success) {
          throw new Error(`Failed to save blueprint: ${result.reason}`);
        }
        
        // Clear the pending blueprint from localStorage
        localStorage.removeItem(PENDING_BLUEPRINT_KEY);
        
        // Show success notification and update state
        if (typeof window !== 'undefined') {
          // Use toast if available, otherwise fallback to console
          try {
            toast.success('Blueprint saved to your account');
          } catch (e) {
            console.log('Blueprint saved to your account');
          }
        }
        
        setAutoSaveComplete(true);
      } catch (error) {
        console.error('Failed to auto-save pending blueprint:', error);
        
        // Show error notification
        if (typeof window !== 'undefined') {
          try {
            toast.error('Failed to save your blueprint');
          } catch (e) {
            console.error('Failed to save blueprint');
          }
        }
      } finally {
        setIsAutoSaving(false);
      }
    };

    // Run the auto-save function
    autoSavePendingBlueprint();
  }, [user]);

  return { isAutoSaving, autoSaveComplete };
}
