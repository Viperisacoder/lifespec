import { useState, useEffect } from 'react';

export function useCountUp(
  targetValue: number,
  duration: number = 600,
  decimals: number = 0
): number {
  const [displayValue, setDisplayValue] = useState(targetValue);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const newValue = targetValue * easeProgress;
      setDisplayValue(Math.round(newValue * Math.pow(10, decimals)) / Math.pow(10, decimals));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetValue, duration, decimals]);

  return displayValue;
}
