'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { getBlueprint } from '@/lib/blueprintService';
import { SavedBlueprint } from '@/lib/blueprintTypes';

function formatMoney(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

function formatMonthly(n: number): string {
  return formatMoney(n) + '/mo';
}

export default function BlueprintViewPage() {
  const router = useRouter();
  const [blueprint, setBlueprint] = useState<SavedBlueprint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetchBlueprint = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Auth error:', authError);
          router.push('/signup?next=/blueprints/view');
          return;
        }
        
        if (!user) {
          console.log('No user found, redirecting to signup');
          router.push('/signup?next=/blueprints/view');
          return;
        }

        console.log('User authenticated:', user.id);
        const result = await getBlueprint();
        console.log('Fetched blueprint result:', result);
        
        if (!result.success || !result.data) {
          console.log('No blueprint found, redirecting to blueprints list');
          router.push('/blueprints');
          return;
        }
        
        const savedBlueprint = result.data;

        setBlueprint(savedBlueprint);
      } catch (error) {
        console.error('Error fetching blueprint:', error);
        router.push('/blueprints');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchBlueprint();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>
      </div>
    );
  }

  if (!blueprint) {
    return null;
  }

  const formattedDate = new Date(blueprint.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen px-4 py-8 sm:py-16" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div>
            <h1 className="text-3xl sm:text-5xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>LifeSpec Blueprint</h1>
            <p className="text-sm sm:text-lg" style={{ color: 'var(--text-secondary)' }}>Your lifestyle cost breakdown</p>
          </div>
          <button
            onClick={() => router.push('/blueprints')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            Back
          </button>
        </div>

        {/* Main Stats */}
        <div className="mb-8 sm:mb-12">
          <div className="text-4xl sm:text-6xl font-bold mb-2" style={{ color: 'var(--white)' }}>
            {formatMonthly(blueprint.blueprint?.totalMonthly || 0)}
          </div>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>Monthly Lifestyle Cost</p>
        </div>

        {/* Stat Tiles */}
        <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
          <div className="backdrop-blur-sm border rounded-xl p-3 sm:p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Yearly Lifestyle Cost</p>
            <p className="text-lg sm:text-2xl font-semibold" style={{ color: 'var(--white)' }}>
              {formatMoney(blueprint.blueprint?.totalYearly || 0)}
            </p>
          </div>

          <div className="backdrop-blur-sm border rounded-xl p-3 sm:p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Saved On</p>
            <p className="text-lg sm:text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {formattedDate}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
