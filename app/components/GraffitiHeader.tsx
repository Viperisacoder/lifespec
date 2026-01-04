'use client';

import React from 'react';

export function GraffitiHeader() {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: '45vh', backgroundColor: 'rgb(var(--bg))' }}>
      {/* Graffiti/Paint SVG Layer */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        style={{
          animation: 'fadeInDown 0.8s ease-out',
        }}
      >
        <defs>
          <filter id="paintFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" />
          </filter>
        </defs>

        {/* Gold paint strokes - top left */}
        <g opacity="0.6" filter="url(#paintFilter)">
          <path
            d="M 0 0 Q 150 80 300 40 T 600 100"
            stroke="rgb(213, 160, 33)"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 50 20 Q 200 120 400 60"
            stroke="rgb(213, 160, 33)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>

        {/* White/light accent strokes */}
        <g opacity="0.4">
          <path
            d="M 800 0 Q 900 100 1000 50 T 1200 120"
            stroke="rgb(245, 245, 245)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 1100 30 L 950 180"
            stroke="rgb(245, 245, 245)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>

        {/* Charcoal/dark accent strokes */}
        <g opacity="0.3">
          <path
            d="M 200 150 Q 400 200 600 140"
            stroke="rgb(45, 45, 45)"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Subtle warm orange accent */}
        <g opacity="0.25">
          <circle cx="100" cy="80" r="40" fill="rgb(230, 140, 80)" />
          <circle cx="1050" cy="120" r="35" fill="rgb(230, 140, 80)" />
        </g>

        {/* Fade gradient overlay */}
        <defs>
          <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(0, 0, 0)" stopOpacity="0" />
            <stop offset="100%" stopColor="rgb(0, 0, 0)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="1200" height="600" fill="url(#fadeGradient)" />
      </svg>

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8">
        <div className="text-center max-w-3xl">
          {/* Label */}
          <p
            className="text-sm font-semibold uppercase tracking-widest mb-6"
            style={{ color: 'rgb(var(--muted-2))' }}
          >
            LifeSpec Blueprint
          </p>

          {/* Main Number with Glow */}
          <div className="mb-8">
            <h1
              className="text-7xl md:text-8xl font-black mb-4"
              style={{
                color: 'rgb(var(--text))',
                textShadow: '0 0 30px rgba(213, 160, 33, 0.3)',
                letterSpacing: '-0.02em',
              }}
            >
              $95,740
            </h1>
            <p className="text-2xl md:text-3xl font-light" style={{ color: 'rgb(var(--muted))' }}>
              / month
            </p>
          </div>

          {/* Subtext */}
          <p
            className="text-lg md:text-xl"
            style={{ color: 'rgb(var(--muted))' }}
          >
            Your selected lifestyle, priced in real terms.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 0.4;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
