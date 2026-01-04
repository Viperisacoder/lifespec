'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export function AppHeader() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasPaypalCookie, setHasPaypalCookie] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkPaypalCookie = () => {
      const cookies = document.cookie.split(';');
      const hasPaypal = cookies.some(cookie => 
        cookie.trim().startsWith('ls_paypal_return=')
      );
      setHasPaypalCookie(hasPaypal);
    };

    checkPaypalCookie();
  }, []);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await signOut();
    setDropdownOpen(false);
    router.push('/');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
    setDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'rgba(14, 15, 17, 0.8)' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Brand */}
        <button
          onClick={() => router.push('/')}
          className="text-xl md:text-2xl font-light tracking-widest transition-colors duration-300"
          style={{ color: 'var(--text-primary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
        >
          Life<span className="font-semibold">Spec</span>
        </button>

        {/* Right: Auth State */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-10 h-10 rounded-full animate-pulse" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }} />
          ) : user ? (
            /* Logged In: Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.08)',
                  borderColor: dropdownOpen ? 'var(--accent-gold)' : 'var(--border-color)',
                }}
              >
                {/* Avatar Circle */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--bg-primary)' }}>
                  {initials}
                </div>
                {/* Name */}
                <span className="text-sm font-medium hidden sm:inline max-w-[120px] truncate" style={{ color: 'var(--text-primary)' }}>
                  {displayName}
                </span>
                {/* Chevron */}
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 backdrop-blur-md border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" style={{ backgroundColor: 'rgba(26, 29, 34, 0.95)', borderColor: 'var(--border-color)' }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Signed in as</p>
                    <p className="text-sm font-medium truncate mt-1" style={{ color: 'var(--text-primary)' }}>{user.email}</p>
                  </div>

                  <button
                    onClick={handleDashboard}
                    className="w-full px-4 py-3 text-left text-sm transition-colors duration-200 flex items-center gap-2 hover:bg-white/5"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent-gold)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4V3" />
                    </svg>
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm transition-colors duration-200 flex items-center gap-2 border-t hover:bg-red-500/10"
                    style={{ color: '#ff6b6b', borderColor: 'var(--border-color)' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out: Login/Signup Buttons */
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-300 hover:border-opacity-100"
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border-color)',
                  borderWidth: '1px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-gold)';
                  e.currentTarget.style.borderColor = 'var(--accent-gold)';
                  e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Log in
              </button>
              {hasPaypalCookie && (
                <button
                  onClick={() => router.push('/signup')}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--accent-gold)',
                    color: 'var(--bg-primary)',
                  }}
                >
                  Sign up
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
