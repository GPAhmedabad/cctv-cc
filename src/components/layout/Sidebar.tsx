import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Video,
  Database,
  Car,
  Eye,
  BellRing,
  FolderLock,
  GitGraph,
  Clock,
  BarChart3,
  Activity,
  Layers,
  Network,
  Cpu,
  Server,
  FileText,
  Users,
  Shield,
  FileCheck,
  Settings,
  Flame,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
} from 'lucide-react';
import { ActiveView } from '../../types';

interface SidebarProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  alertsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
  alertsCount = 0,
}) => {
  const commandCentreItems: Array<{
    id: ActiveView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    alertCount?: string;
    isDanger?: boolean;
  }> = [
    { id: 'dashboard', label: 'Command Dashboard', icon: LayoutDashboard },
    { id: 'gis', label: 'GIS Map Workspace', icon: MapPin, badge: 'GIS' },
    { id: 'cctv_live', label: 'Live CCTV Multi-Grid', icon: Video },
    { id: 'cctv_registry', label: 'CCTV Node Registry', icon: Database },
    { id: 'vehicles', label: 'Vehicle Intelligence (ANPR)', icon: Car },
    { id: 'cross_camera', label: 'Cross-Camera Tracking', icon: Network, badge: 'HOT' },
    { id: 'watchlists', label: 'Watchlist Management', icon: Eye },
    {
      id: 'alerts',
      label: 'Explainable Alerts',
      icon: BellRing,
      alertCount: alertsCount > 0 ? String(alertsCount) : undefined,
      isDanger: alertsCount > 0,
    },
    { id: 'incidents', label: 'Incident Correlation', icon: Flame },
    { id: 'investigations', label: 'Investigation Dossiers', icon: FolderLock },
    { id: 'investigation_graph', label: 'Investigation Graph', icon: GitGraph, badge: 'LINK' },
    { id: 'timeline', label: 'Unified Event Chronology', icon: Clock },
    { id: 'analytics', label: 'Analytics & KPIs', icon: BarChart3 },
    { id: 'health', label: 'Camera Telemetry & Health', icon: Activity },
    { id: 'integrations', label: 'VMS Integration Hub', icon: Layers },
    { id: 'coverage_gap', label: 'Coverage & Blind-Spots', icon: MapPin },
    { id: 'scale_simulator', label: '80k Scale Architecture', icon: Server, badge: 'SIM' },
  ];

  const adminItems: Array<{
    id: ActiveView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'users', label: 'Personnel & Identities', icon: Users },
    { id: 'rbac', label: 'RBAC & DPDP Privacy', icon: Shield },
    { id: 'audit', label: 'Immutable Audit Logs', icon: FileCheck },
    { id: 'settings', label: 'System Configuration', icon: Settings },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`border-r border-slate-800 bg-slate-950 flex flex-col h-screen flex-shrink-0 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 flex-shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-display font-bold text-black text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              SX
            </div>
            <div>
              <div className="font-display font-bold text-sm tracking-wider text-white">
                SENTINEL-X
              </div>
              <div className="text-[9px] font-mono text-cyan-400 font-semibold tracking-tight">
                STATEWIDE CCTV AI
              </div>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-display font-bold text-black text-sm mx-auto shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            SX
          </div>
        )}

        {onToggleCollapse && !collapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="p-3 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Command Centre Section */}
        <div>
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase flex items-center justify-between">
              <span>COMMAND CENTRE</span>
              <span className="text-cyan-500">STATEWIDE</span>
            </div>
          )}
          <nav className="space-y-0.5">
            {commandCentreItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/90 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!collapsed && (
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                          {item.badge}
                        </span>
                      )}
                      {item.alertCount && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                            item.isDanger
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}
                        >
                          {item.alertCount}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Administration Section */}
        <div>
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              ADMINISTRATION & GOVERNANCE
            </div>
          )}
          <nav className="space-y-0.5">
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    collapsed ? 'justify-center px-2' : 'justify-between px-3'
                  } py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/90 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!collapsed && isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer System Status */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-850 bg-slate-950/90 text-[11px] font-mono text-slate-400 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">FEDERATED GRID:</span>
            <span className="text-emerald-400 font-semibold">6/6 VMS ONLINE</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">EVENT INGESTION:</span>
            <span className="text-cyan-400 font-semibold">3,420 EVT/SEC</span>
          </div>
          <div className="text-[9px] text-slate-600 tracking-tight pt-1">
            SENTINEL-X STATEWIDE CORE v2.4
          </div>
        </div>
      )}
    </aside>
  );
};
