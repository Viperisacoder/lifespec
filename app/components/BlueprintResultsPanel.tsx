'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlueprintPayload } from '@/lib/blueprintTypes';
import { saveBlueprint, deleteBlueprint, PENDING_BLUEPRINT_KEY } from '@/lib/blueprintService';
import { ResultsLoader } from './ResultsLoader';
import { toast } from 'react-hot-toast';

interface BlueprintResultsPanelProps {
  results: any | null;
  isLoading: boolean;
  loadingStage: 'analyzing' | 'estimating' | 'building' | 'complete';
  blueprintPayload: BlueprintPayload;
  onBlueprintSaved?: () => void;
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export function BlueprintResultsPanel({
  results,
  isLoading,
  loadingStage,
  blueprintPayload,
  onBlueprintSaved,
}: BlueprintResultsPanelProps) {
  const router = useRouter();
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveBlueprint = async () => {
    setSaveState('saving');
    try {
      const result = await saveBlueprint(blueprintPayload, 'My Blueprint');

      if (!result.success) {
        if (result.reason === 'UNAUTHENTICATED') {
          // Store pending blueprint and redirect to signup
          localStorage.setItem(PENDING_BLUEPRINT_KEY, JSON.stringify({
            blueprint_json: blueprintPayload,
            name: 'My Blueprint'
          }));
          toast.success('Blueprint saved temporarily. Sign up to save permanently.');
          router.push('/signup?next=/blueprints');
          return;
        }
        toast.error('Failed to save blueprint');
        setSaveState('error');
        setTimeout(() => setSaveState('idle'), 3000);
        return;
      }

      toast.success('Blueprint saved successfully!');
      setSaveState('saved');
      setIsSaved(true);
      onBlueprintSaved?.();
      setTimeout(() => setSaveState('idle'), 2000);
    } catch (error) {
      console.error('Error saving blueprint:', error);
      toast.error('Failed to save blueprint');
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  const handleDeleteBlueprint = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBlueprint();

      if (!result.success) {
        console.error('Error deleting blueprint:', result.reason);
        toast.error('Failed to delete blueprint');
        setIsDeleting(false);
        return;
      }

      toast.success('Blueprint deleted');
      setShowDeleteConfirm(false);
      setIsSaved(false);
      setSaveState('idle');
      onBlueprintSaved?.();
    } catch (error) {
      console.error('Error deleting blueprint:', error);
      toast.error('Failed to delete blueprint');
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      {/* Loading State */}
      {isLoading && (
        <div className="py-12">
          <ResultsLoader stage={loadingStage} />
        </div>
      )}

      {/* Results Display */}
      {!isLoading && results && (
        <>
          {/* Save/Delete Buttons - Bottom Left */}
          <div className="fixed bottom-8 left-8 z-50 flex gap-3">
            <button
              onClick={handleSaveBlueprint}
              disabled={saveState === 'saving'}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300"
              style={{
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--bg-primary)',
                opacity: saveState === 'saving' ? 0.7 : 1,
                cursor: saveState === 'saving' ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (saveState !== 'saving') {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(212, 175, 55, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {saveState === 'saving' && 'Saving...'}
              {saveState === 'saved' && 'Saved ✓'}
              {saveState === 'error' && 'Error'}
              {saveState === 'idle' && (isSaved ? 'Update blueprint' : 'Save blueprint')}
            </button>

            {isSaved && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-3 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                }}
                title="Delete blueprint"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <>
              <div
                className="fixed inset-0 z-40 transition-opacity duration-300"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                onClick={() => setShowDeleteConfirm(false)}
              />
              <div
                className="fixed top-1/2 left-1/2 z-50 w-full max-w-md rounded-2xl p-6 sm:p-8 transform -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Delete blueprint?
                </h2>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                  This removes your saved blueprint. This can't be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteBlueprint}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      opacity: isDeleting ? 0.7 : 1,
                      cursor: isDeleting ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
