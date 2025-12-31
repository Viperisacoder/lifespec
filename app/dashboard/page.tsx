'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full animate-pulse mx-auto mb-4" style={{ background: 'linear-gradient(to bottom right, var(--accent-gold), var(--accent-gold-muted))' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-light tracking-widest mb-4" style={{ color: 'var(--text-primary)' }}>
            Access Denied
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Please log in to access your dashboard.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-3 font-semibold rounded-lg transition-all duration-300"
            style={{
              backgroundColor: 'var(--accent-gold)',
              color: 'var(--bg-primary)',
              boxShadow: '0 10px 25px rgba(212, 175, 55, 0.25)',
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light tracking-widest mb-2" style={{ color: 'var(--text-primary)' }}>
            Welcome back, <span className="font-semibold" style={{ color: 'var(--accent-gold)' }}>{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your blueprints and life specifications</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Blueprints Card */}
          <div className="border rounded-2xl p-8 transition-all duration-300" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'linear-gradient(to bottom right, var(--accent-gold), var(--accent-gold-muted))' }}>
              <svg className="w-6 h-6" style={{ color: 'var(--bg-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>My Blueprints</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>View and manage your saved life blueprints</p>
            <button className="font-medium text-sm transition-colors" style={{ color: 'var(--accent-gold)' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold-muted)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-gold)')}>View Blueprints →</button>
          </div>

          {/* Create Blueprint Card */}
          <div className="border rounded-2xl p-8 transition-all duration-300" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'linear-gradient(to bottom right, var(--accent-gold), var(--accent-gold-muted))' }}>
              <svg className="w-6 h-6" style={{ color: 'var(--bg-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Create Blueprint</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Start a new life specification wizard</p>
            <button 
              onClick={() => router.push('/wizard')}
              className="font-medium text-sm transition-colors"
              style={{ color: 'var(--accent-gold)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold-muted)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-gold)')}
            >
              Go to Wizard →
            </button>
          </div>

          {/* Settings Card */}
          <div className="border rounded-2xl p-8 transition-all duration-300" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'linear-gradient(to bottom right, var(--accent-gold), var(--accent-gold-muted))' }}>
              <svg className="w-6 h-6" style={{ color: 'var(--bg-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Settings</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Manage your account and preferences</p>
            <button className="font-medium text-sm transition-colors" style={{ color: 'var(--accent-gold)' }} onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold-muted)')} onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--accent-gold)')}>Go to Settings →</button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-2xl p-6" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Total Blueprints</p>
            <p className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>0</p>
          </div>
          <div className="border rounded-2xl p-6" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Last Updated</p>
            <p className="text-lg font-semibold" style={{ color: 'var(--accent-gold)' }}>Never</p>
          </div>
          <div className="border rounded-2xl p-6" style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderColor: 'var(--border-color)' }}>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>Account Status</p>
            <p className="text-lg font-semibold" style={{ color: 'var(--accent-gold)' }}>Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
