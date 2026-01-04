'use client';

import { useEffect, useRef } from 'react';

export default function NoiseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create noise
    const createNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255 * 0.05; // Very subtle noise
        data[i] = value;     // r
        data[i+1] = value;   // g
        data[i+2] = value;   // b
        data[i+3] = 255;     // alpha
      }
      
      ctx.putImageData(imageData, 0, 0);
    };
    
    // Animation loop
    let animationFrame: number;
    const animate = () => {
      createNoise();
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-10"
      style={{ mixBlendMode: 'overlay' }}
    />
  );
}
