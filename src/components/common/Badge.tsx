import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'danger' | 'warning' | 'success' | 'info' | 'purple' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  id,
}) => {
  const variantStyles = {
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    info: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      id={id}
      className={`inline-flex items-center gap-1 font-mono uppercase tracking-wider rounded-md border whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
