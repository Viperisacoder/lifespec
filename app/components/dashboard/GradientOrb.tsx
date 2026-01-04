'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface GradientOrbProps {
  savingsViability?: number; // 0-100
  incomeGap?: number; // negative = shortfall, positive = surplus
  lifestyleStress?: number; // 0-100
}

export default function GradientOrb({ 
  savingsViability = 50, 
  incomeGap = 0, 
  lifestyleStress = 50 
}: GradientOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Normalize values for visual representation
  const normalizedViability = Math.max(0, Math.min(100, savingsViability)) / 100;
  const normalizedStress = Math.max(0, Math.min(100, lifestyleStress)) / 100;
  const normalizedGap = Math.max(-1, Math.min(1, incomeGap / 100000)); // Assuming $100k as max scale
  
  // Calculate colors based on inputs
  const getColor = () => {
    // Base colors from our palette
    const colors = {
      burntOrange: [220, 100, 60],
      warmGold: [45, 80, 60],
      mutedRose: [340, 40, 70],
      deepViolet: [270, 60, 40]
    };
    
    // Adjust color mix based on metrics
    return {
      primary: normalizedViability < 0.4 ? colors.burntOrange : 
               normalizedViability > 0.7 ? colors.deepViolet : colors.warmGold,
      secondary: normalizedStress > 0.7 ? colors.burntOrange : 
                 normalizedStress < 0.3 ? colors.mutedRose : colors.warmGold,
      accent: normalizedGap < -0.3 ? colors.burntOrange : 
              normalizedGap > 0.3 ? colors.deepViolet : colors.warmGold
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const width = canvas.width = 400;
    const height = canvas.height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Animation variables
    let time = 0;
    const colors = getColor();
    
    // Add subtle noise texture
    const addNoise = (ctx: CanvasRenderingContext2D, amount: number) => {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * amount;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise));
      }
      
      ctx.putImageData(imageData, 0, 0);
    };
    
    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Create gradient
      const gradient = ctx.createRadialGradient(
        centerX + Math.sin(time * 0.2) * 30 * normalizedGap,
        centerY + Math.cos(time * 0.3) * 30 * normalizedStress,
        10,
        centerX,
        centerY,
        width * 0.6 * (0.8 + 0.2 * Math.sin(time * 0.1))
      );
      
      // Add color stops
      const hslToString = (hsl: number[]) => `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
      gradient.addColorStop(0, hslToString(colors.primary));
      gradient.addColorStop(0.4, hslToString(colors.secondary));
      gradient.addColorStop(1, hslToString(colors.accent));
      
      // Draw shape
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = gradient;
      
      ctx.beginPath();
      
      // Create organic, flowing shape
      const radius = width * 0.3;
      const points = 6;
      const angleStep = (Math.PI * 2) / points;
      
      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep + time * 0.1;
        const distortion = 0.2 + 0.1 * Math.sin(time * 0.3 + i);
        const x = centerX + Math.cos(angle) * radius * (1 + distortion * normalizedStress);
        const y = centerY + Math.sin(angle) * radius * (1 + distortion * (1 - normalizedViability));
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Use bezier curves for smoother shape
          const prevAngle = (i - 1) * angleStep + time * 0.1;
          const prevX = centerX + Math.cos(prevAngle) * radius * (1 + distortion * normalizedStress);
          const prevY = centerY + Math.sin(prevAngle) * radius * (1 + distortion * (1 - normalizedViability));
          
          const cp1x = prevX + Math.cos(prevAngle + Math.PI/2) * radius * 0.4;
          const cp1y = prevY + Math.sin(prevAngle + Math.PI/2) * radius * 0.4;
          const cp2x = x + Math.cos(angle - Math.PI/2) * radius * 0.4;
          const cp2y = y + Math.sin(angle - Math.PI/2) * radius * 0.4;
          
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        }
      }
      
      ctx.closePath();
      ctx.fill();
      
      // Add glow effect
      const glowSize = 30 * (0.5 + 0.5 * normalizedViability);
      ctx.shadowColor = hslToString(colors.primary);
      ctx.shadowBlur = glowSize;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      
      // Reset shadow
      ctx.shadowBlur = 0;
      
      // Add subtle noise
      addNoise(ctx, 5);
      
      // Update time
      time += 0.01;
      
      // Continue animation
      requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      // Nothing to clean up for canvas
    };
  }, [savingsViability, incomeGap, lifestyleStress]);

  return (
    <div className="relative flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative"
      >
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="max-w-full h-auto"
        />
        <div 
          className="absolute inset-0 bg-[#0E0F11] opacity-10 pointer-events-none"
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            mixBlendMode: 'overlay'
          }}
        />
      </motion.div>
    </div>
  );
}
