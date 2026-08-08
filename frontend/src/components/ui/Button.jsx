import React from 'react';

export default function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  ...props
}) {
  const baseStyles = 'rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    default: 'bg-f1-card text-f1-dark border border-f1-border shadow-soft-outer hover:shadow-soft-outer-hover active:shadow-soft-inset',
    accent: 'bg-f1-red text-white shadow-soft-outer hover:shadow-accent-glow active:opacity-90',
    ghost: 'bg-transparent text-f1-dark hover:bg-black/5 dark:hover:bg-white/10 active:opacity-80',
    inset: 'bg-f1-card text-f1-dark shadow-soft-inset border border-f1-border'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
