import React from 'react';

interface TacticalCardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'rose' | 'amber' | 'emerald' | 'none';
  id?: string;
  badge?: React.ReactNode;
}

export const TacticalCard: React.FC<TacticalCardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  glow = 'none',
  id,
  badge,
}) => {
  const glowStyles = {
    none: 'border-slate-800/80 bg-slate-900/90',
    cyan: 'border-cyan-500/40 bg-slate-900/95 shadow-[0_0_20px_-5px_rgba(6,182,212,0.15)]',
    rose: 'border-rose-500/40 bg-slate-900/95 shadow-[0_0_20px_-5px_rgba(244,63,94,0.15)]',
    amber: 'border-amber-500/40 bg-slate-900/95 shadow-[0_0_20px_-5px_rgba(245,158,11,0.15)]',
    emerald: 'border-emerald-500/40 bg-slate-900/95 shadow-[0_0_20px_-5px_rgba(16,185,129,0.15)]',
  };

  return (
    <div
      id={id}
      className={`rounded-xl border backdrop-blur-md transition-all duration-200 flex flex-col ${glowStyles[glow]} ${className}`}
    >
      {(title || action || badge) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-semibold text-sm tracking-wide text-slate-100 uppercase">
                  {title}
                </h3>
                {badge}
              </div>
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className="p-4 flex-1">{children}</div>
    </div>
  );
};
