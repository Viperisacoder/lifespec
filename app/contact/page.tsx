'use client';

import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 opacity-20"
          style={{
            background: 'radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        {/* Header */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-light tracking-widest mb-4" style={{ color: 'var(--text-primary)' }}>
            Contact Us
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            We'd love to hear from you. Reach out anytime.
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
          {/* Email Section */}
          <div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}>
                <svg
                  className="w-6 h-6"
                  style={{ color: 'var(--accent-gold)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              {/* Email Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Email</h3>
                <a
                  href="mailto:mylifespec@outlook.com"
                  className="transition-colors duration-300 break-all"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-gold)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  mylifespec@outlook.com
                </a>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div>
            <div className="flex items-start gap-4">
              {/* Location Icon */}
              <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)' }}>
                <svg
                  className="w-6 h-6"
                  style={{ color: 'var(--accent-gold)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>

              {/* Location Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Location</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Los Angeles, California, USA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div
          className={`mt-12 text-center transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: isLoaded ? '400ms' : '0ms' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            We respond as soon as possible
          </p>
        </div>
      </div>
    </div>
  );
}
