'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export function AppHeader() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060A0F]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Brand */}
        <button
          onClick={() => router.push('/')}
          className="text-xl md:text-2xl font-light tracking-widest text-white hover:text-[#2DD4BF] transition-colors duration-300"
        >
          Life<span className="font-semibold">Spec</span>
        </button>

        {/* Right: Auth State */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
            /* Logged In: Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:border-[#2DD4BF]/50 transition-all duration-300 hover:bg-white/15"
              >
                {/* Avatar Circle */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2DD4BF] to-[#0F766E] flex items-center justify-center text-xs font-semibold text-white">
                  {initials}
                </div>
                {/* Name */}
                <span className="text-sm font-medium text-white hidden sm:inline max-w-[120px] truncate">
                  {displayName}
                </span>
                {/* Chevron */}
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0B1220]/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate mt-1">{user.email}</p>
                  </div>

                  <button
                    onClick={handleDashboard}
                    className="w-full px-4 py-3 text-left text-sm text-white hover:bg-white/10 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 text-[#2DD4BF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l4-4m0 0l4 4m-4-4V3" />
                    </svg>
                    Dashboard
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200 flex items-center gap-2 border-t border-white/10"
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
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300"
              >
                Log in
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#0F766E] to-[#2DD4BF] hover:from-[#0D5F5B] hover:to-[#1BA39F] rounded-lg transition-all duration-300"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
