import React from 'react';

interface StatusDotProps {
  status: 'ONLINE' | 'CONNECTED' | 'ACTIVE' | 'GOOD' | 'DEGRADED' | 'WARNING' | 'OFFLINE' | 'CRITICAL' | 'DRAFT';
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
}

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  pulse = true,
  size = 'md',
  id,
}) => {
  const isGood = ['ONLINE', 'CONNECTED', 'ACTIVE', 'GOOD'].includes(status);
  const isWarning = ['DEGRADED', 'WARNING'].includes(status);
  const isCritical = ['OFFLINE', 'CRITICAL'].includes(status);

  const colorClass = isGood
    ? 'bg-emerald-500'
    : isWarning
    ? 'bg-amber-500'
    : isCritical
    ? 'bg-rose-500'
    : 'bg-slate-400';

  const glowClass = isGood
    ? 'bg-emerald-400'
    : isWarning
    ? 'bg-amber-400'
    : isCritical
    ? 'bg-rose-400'
    : 'bg-slate-400';

  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <span id={id} className="relative inline-flex items-center justify-center">
      {pulse && (
        <span
          className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${glowClass}`}
        />
      )}
      <span className={`relative inline-flex rounded-full ${sizeClasses[size]} ${colorClass}`} />
    </span>
  );
};
