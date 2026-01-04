'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlueprintPayload } from '@/lib/blueprintTypes';
import { saveBlueprint, deleteBlueprint, PENDING_BLUEPRINT_KEY } from '@/lib/blueprintService';
import { ResultsLoader } from './ResultsLoader';
import { GraffitiHeader } from './GraffitiHeader';
import { FinancialCard } from './FinancialCard';
import { ActionBar } from './ActionBar';
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

  const handleSaveBlueprint = async () => {
    setSaveState('saving');
    try {
      const result = await saveBlueprint(blueprintPayload);

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
      setSaveState('idle');
      onBlueprintSaved?.();
    } catch (error) {
      console.error('Error deleting blueprint:', error);
      toast.error('Failed to delete blueprint');
      setIsDeleting(false);
    }
  };

  // Transform results into selections format
  const selections = blueprintPayload.selections
    ? Object.entries(blueprintPayload.selections).map(([category, items]: [string, any]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        items: Array.isArray(items)
          ? items.map((item: any) => ({
              name: typeof item === 'string' ? item : item.name || '',
              monthly: typeof item === 'object' ? item.monthly || 0 : 0,
            }))
          : [],
      }))
    : [];

  const monthlyTotal = blueprintPayload.totalMonthly || 0;
  const yearlyTotal = blueprintPayload.totalYearly || monthlyTotal * 12;
  const requiredIncome = yearlyTotal / 0.6;

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'rgb(var(--bg))' }}>
      {/* Loading State */}
      {isLoading && (
        <div className="py-12">
          <ResultsLoader stage={loadingStage} />
        </div>
      )}

      {/* Results Display */}
      {!isLoading && results && (
        <>
          {/* Graffiti Header */}
          <GraffitiHeader />

          {/* Financial Card */}
          <FinancialCard
            monthlyTotal={monthlyTotal}
            yearlyTotal={yearlyTotal}
            requiredIncome={requiredIncome}
            taxRate={25}
            savingsRate={15}
            selections={selections}
          />

          {/* Spacer for Action Bar */}
          <div style={{ height: '100px' }} />

          {/* Action Bar */}
          <ActionBar
            onBack={() => router.back()}
            onFinish={handleSaveBlueprint}
            isLoading={saveState === 'saving'}
          />

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
                style={{ backgroundColor: 'rgb(var(--panel))' }}
              >
                <h2 className="text-2xl font-semibold mb-2" style={{ color: 'rgb(var(--text))' }}>
                  Delete blueprint?
                </h2>
                <p className="mb-6" style={{ color: 'rgb(var(--muted))' }}>
                  This removes your saved blueprint. This can't be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all border"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'rgb(var(--muted))',
                      borderColor: 'rgb(var(--border))',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteBlueprint}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: 'rgb(239, 68, 68)',
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
