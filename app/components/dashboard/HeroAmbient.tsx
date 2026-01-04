'use client';

import { useMemo } from 'react';

// Base64 encoded tiny SVG noise pattern
const noiseSvgBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMjAwdjIwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=";

interface HeroAmbientProps {
  savingsViability?: number; // 0-100
  incomeGap?: number; // negative = shortfall, positive = surplus
  lifestyleStress?: number; // 0-100
}

export default function HeroAmbient({
  savingsViability = 50,
  incomeGap = 0,
  lifestyleStress = 50
}: HeroAmbientProps) {
  // Memoize gradient values based on inputs to prevent unnecessary recalculations
  const gradientStyles = useMemo(() => {
    // Normalize values
    const normalizedViability = Math.max(0, Math.min(100, savingsViability)) / 100;
    const normalizedStress = Math.max(0, Math.min(100, lifestyleStress)) / 100;
    const normalizedGap = Math.max(-1, Math.min(1, incomeGap / 100000)); // Assuming $100k as max scale
    
    // Determine gradient colors based on financial health
    let gradientPosition = '70%';
    let primaryColor = 'hsl(45, 80%, 60%)'; // Default warm gold
    let secondaryColor = 'hsl(270, 60%, 40%)'; // Default deep violet
    
    // Adjust colors based on metrics
    if (normalizedViability < 0.4 || normalizedStress > 0.7 || normalizedGap < -0.3) {
      // Poor financial health - more burnt orange
      primaryColor = 'hsl(20, 90%, 55%)';
      secondaryColor = 'hsl(340, 70%, 40%)';
      gradientPosition = '60%';
    } else if (normalizedViability > 0.7 && normalizedGap > 0.3) {
      // Good financial health - more deep violet/blue
      primaryColor = 'hsl(270, 60%, 40%)';
      secondaryColor = 'hsl(220, 70%, 50%)';
      gradientPosition = '80%';
    }
    
    return {
      // Layer 1 - Base gradient
      baseGradient: {
        backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, hsl(45, 80%, 60%) ${gradientPosition}, ${secondaryColor} 100%)`,
        opacity: 0.7
      },
      // Layer 2 - Accent gradient with slight offset
      accentGradient: {
        backgroundImage: `linear-gradient(150deg, hsl(20, 90%, 55%) 0%, hsl(45, 80%, 60%) ${parseInt(gradientPosition) + 10}%, hsl(340, 40%, 70%) 100%)`,
        opacity: 0.3
      }
    };
  }, [savingsViability, incomeGap, lifestyleStress]);

  return (
    <div className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden">
      {/* Base gradient layer */}
      <div
        className="absolute inset-0"
        style={gradientStyles.baseGradient}
      />
      
      {/* Accent gradient layer */}
      <div
        className="absolute inset-0"
        style={gradientStyles.accentGradient}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("${noiseSvgBase64}")`,
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 opacity-30"
        style={{
          boxShadow: 'inset 0 0 100px rgba(212, 175, 55, 0.3)'
        }}
      />
    </div>
  );
}
