import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Play,
  Database,
  UserCheck,
  Radio,
  Clock,
  Sparkles,
  RefreshCw,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { User, DataMode, ExplainableAlert } from '../../types';
import { Badge } from '../common/Badge';

interface HeaderProps {
  currentUser: User;
  availableUsers: User[];
  onSwitchUser: (userId: string) => void;
  dataMode: DataMode;
  onToggleDataMode: (mode: DataMode) => void;
  onOpenDataIngestion: () => void;
  onOpenGlobalSearch: () => void;
  onRunDemoScenario: () => void;
  activeAlerts: ExplainableAlert[];
  onNavigateToAlerts: () => void;
  isScenarioRunning?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  availableUsers,
  onSwitchUser,
  dataMode,
  onToggleDataMode,
  onOpenDataIngestion,
  onOpenGlobalSearch,
  onRunDemoScenario,
  activeAlerts,
  onNavigateToAlerts,
  isScenarioRunning,
}) => {
  const [time, setTime] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const criticalCount = activeAlerts.filter((a) => a.severity === 'CRITICAL').length;

  return (
    <header
      id="main-header"
      className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-40"
    >
      {/* Left: Brand Identity */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-400/40">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-wider text-white">
                SENTINEL-X
              </span>
              <Badge variant="info" size="sm">
                STATE COMMAND
              </Badge>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-tight flex items-center gap-1.5">
              <span>GUJARAT ICCC CCTV INTEGRATION GRID</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Divider */}
        <div className="hidden lg:block h-6 w-px bg-slate-800 ml-2" />

        {/* Global Natural Language & Structured Search Trigger */}
        <button
          id="global-search-trigger"
          onClick={onOpenGlobalSearch}
          className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/70 text-slate-300 hover:text-white transition-all text-xs font-mono w-64 justify-between group"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-400 group-hover:text-slate-200">
              Query Plate / Location / NL...
            </span>
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Center: Live Ticker & Operational Mode */}
      <div className="hidden xl:flex items-center gap-3">
        {/* Run Demo Scenario Button */}
        <button
          id="run-demo-scenario-btn"
          onClick={onRunDemoScenario}
          disabled={isScenarioRunning}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold tracking-wider uppercase transition-all shadow-lg ${
            isScenarioRunning
              ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 animate-pulse cursor-wait'
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/40 shadow-cyan-900/20 hover:scale-[1.02]'
          }`}
        >
          <Play className={`w-3.5 h-3.5 ${isScenarioRunning ? 'animate-spin' : 'fill-current'}`} />
          {isScenarioRunning ? 'Scenario In Progress...' : '▶ RUN DEMO SCENARIO'}
        </button>

        {/* Data Mode Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            id="data-mode-demo-btn"
            onClick={() => onToggleDataMode('DEMO_DATA')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              dataMode === 'DEMO_DATA'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DEMO DATA
          </button>
          <button
            id="data-mode-govt-btn"
            onClick={() => onToggleDataMode('GOVERNMENT_DATA')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              dataMode === 'GOVERNMENT_DATA'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            GOVT DATA
          </button>
          <button
            id="open-data-ingestion-btn"
            onClick={onOpenDataIngestion}
            title="Import custom CSV / Government dataset"
            className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Clock, Active Alerts, RBAC Profile */}
      <div className="flex items-center gap-3">
        {/* Live Clock */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-400">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{time || '01:30:00 IST'}</span>
        </div>

        {/* Active Critical Alerts Notification Pill */}
        <button
          id="alerts-bell-btn"
          onClick={onNavigateToAlerts}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
            criticalCount > 0
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-400 hover:bg-rose-500/25'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className={`w-3.5 h-3.5 ${criticalCount > 0 ? 'animate-bounce' : ''}`} />
          <span className="text-xs font-mono font-bold">{activeAlerts.length}</span>
          {criticalCount > 0 && (
            <span className="text-[10px] bg-rose-600 text-white font-mono px-1 rounded-full">
              {criticalCount} CRIT
            </span>
          )}
        </button>

        {/* User RBAC Selector */}
        <div className="relative">
          <button
            id="user-profile-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-left transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center text-[10px] font-bold text-cyan-300">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-medium text-slate-200 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <span>{currentUser.role}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{currentUser.badgeNumber}</span>
              </div>
            </div>
          </button>

          {/* User Switching Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
              <div className="px-3 py-2 border-b border-slate-800 text-xs font-mono text-slate-400">
                SWITCH OPERATIONAL ROLE (RBAC)
              </div>
              <div className="mt-1 space-y-1">
                {availableUsers.map((u) => (
                  <button
                    key={u.id}
                    id={`switch-user-${u.id}`}
                    onClick={() => {
                      onSwitchUser(u.id);
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      u.id === currentUser.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {u.role} | {u.department}
                      </div>
                    </div>
                    {u.id === currentUser.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
