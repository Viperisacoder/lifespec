'use client';

import React, { useEffect, useState } from 'react';

interface CustomTooltipProps {
  age: number;
  money: number;
  x: number;
  y: number;
  containerWidth: number;
  containerHeight: number;
  millionaireAge: number | null;
  dreamCompletionAge: number | null;
}

export function CustomTooltip({
  age,
  money,
  x,
  y,
  containerWidth,
  containerHeight,
  millionaireAge,
  dreamCompletionAge,
}: CustomTooltipProps) {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipWidth = 200;
  const tooltipHeight = 110;
  const padding = 12;

  useEffect(() => {
    let left = x - tooltipWidth / 2;
    let top = y - tooltipHeight - 20;

    // Adjust if near right edge
    if (left + tooltipWidth > containerWidth - 20) {
      left = containerWidth - tooltipWidth - 20;
    }

    // Adjust if near left edge
    if (left < 20) {
      left = 20;
    }

    // Adjust if near top edge
    if (top < 20) {
      top = y + 20;
    }

    setPosition({ top, left });
  }, [x, y, containerWidth, containerHeight]);

  const formatMoney = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toFixed(0)}`;
  };

  const isMilestone = age === millionaireAge || age === dreamCompletionAge;

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.left}px`,
        top: `${position.top}px`,
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgb(var(--panel))',
          border: '1px solid rgb(var(--border))',
          borderRadius: '8px',
          padding: `${padding}px`,
          boxShadow: 'var(--shadow)',
          width: `${tooltipWidth}px`,
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Age Header */}
        <p
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: 'rgb(var(--text))',
            marginBottom: '6px',
          }}
        >
          Age {age}
        </p>

        {/* Net Worth Value */}
        <p
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: 'rgb(var(--gold))',
            marginBottom: '8px',
          }}
        >
          {formatMoney(money)}
        </p>

        {/* Milestone Indicators */}
        {age === millionaireAge && (
          <p
            style={{
              fontSize: '12px',
              color: 'rgb(var(--gold))',
              marginBottom: '4px',
              fontWeight: '500',
            }}
          >
            ✓ Millionaire milestone
          </p>
        )}

        {age === dreamCompletionAge && (
          <p
            style={{
              fontSize: '12px',
              color: 'rgb(var(--gold))',
              marginBottom: '4px',
              fontWeight: '500',
            }}
          >
            ✓ Dream completed
          </p>
        )}

        {/* Divider */}
        {isMilestone && (
          <div
            style={{
              height: '1px',
              backgroundColor: 'rgb(var(--border))',
              opacity: 0.5,
              marginTop: '6px',
            }}
          />
        )}
      </div>
    </div>
  );
}
