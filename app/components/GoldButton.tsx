'use client';

import React from 'react';

interface GoldButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function GoldButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
  type = 'button',
}: GoldButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: `
      text-black font-bold
      hover:shadow-lg hover:shadow-gold/20
      focus:ring-offset-black
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    secondary: `
      border border-opacity-30
      text-white
      hover:border-opacity-50 hover:bg-opacity-10
      focus:ring-offset-black
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    tertiary: `
      text-white
      hover:bg-opacity-10
      focus:ring-offset-black
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
  };

  const variantStyles = variants[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
      style={
        variant === 'primary'
          ? {
              backgroundColor: 'rgb(var(--gold))',
              boxShadow: 'var(--shadow)',
            }
          : variant === 'secondary'
          ? {
              borderColor: 'rgb(var(--gold))',
              backgroundColor: 'rgb(var(--gold) / 0.05)',
            }
          : {
              backgroundColor: 'transparent',
            }
      }
    >
      {children}
    </button>
  );
}
