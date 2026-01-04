'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viaPaypal = searchParams.get('via') === 'paypal';
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  useEffect(() => {
    if (!viaPaypal) {
      router.push('/');
      return;
    }
  }, [viaPaypal, router]);

  const handleAccountCreated = async () => {
    setIsCreatingAccount(true);
    try {
      await fetch('/api/paypal/clear-cookie', { method: 'POST' });
      router.push('/redeem');
    } catch (error) {
      console.error('Error clearing cookie:', error);
      router.push('/redeem');
    }
  };

  if (!viaPaypal) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-8" style={{ backgroundColor: '#0E0E0E' }}>
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#FFFFFF' }}>
          Payment complete
        </h1>
        <p className="mb-6" style={{ color: '#A8B3C7' }}>
          Create your LifeSpec account
        </p>
        <button
          onClick={handleAccountCreated}
          disabled={isCreatingAccount}
          className="px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
          style={{
            backgroundColor: 'var(--accent-gold)',
            color: 'var(--bg-primary)',
          }}
        >
          {isCreatingAccount ? 'Creating account...' : 'Continue to account setup'}
        </button>
      </div>
    </div>
  );
}
