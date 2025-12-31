'use client';

import { useState, useEffect } from 'react';

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#060A0F]">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 opacity-20"
          style={{
            background: 'radial-gradient(circle at center, rgba(45,212,191,0.15) 0%, transparent 70%)',
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
          <h1 className="text-4xl md:text-5xl font-light tracking-widest text-white mb-4">
            Contact Us
          </h1>
          <p className="text-slate-400 text-lg">
            Want to report a issue or something else? Contact Us
          </p>
        </div>

        {/* Contact Card */}
        <div
          className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: isLoaded ? '200ms' : '0ms' }}
        >
          {/* Email Section */}
          <div className="mb-8 pb-8 border-b border-white/10 last:mb-0 last:pb-0 last:border-b-0">
            <div className="flex items-start gap-4">
              {/* Email Icon */}
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#F6C66A]/20 to-[#F6C66A]/10 flex items-center justify-center flex-shrink-0 mt-1">
                <svg
                  className="w-6 h-6 text-[#F6C66A]"
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
                <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                <a
                  href="mailto:mylifespec@outlook.com"
                  className="text-slate-300 hover:text-[#F6C66A] transition-colors duration-300 break-all"
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
                <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
                <p className="text-slate-300">Los Angeles, California, USA</p>
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
          <p className="text-slate-500 text-sm">
            We respond as soon as possible
          </p>
        </div>
      </div>
    </div>
  );
}
