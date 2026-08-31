import React from 'react';
import {
  Camera as CameraIcon,
  Radio,
  ShieldAlert,
  FolderLock,
  Car,
  Eye,
  Activity,
  Layers,
  Play,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Server,
  Cpu,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Camera,
  ExplainableAlert,
  Incident,
  Investigation,
  VMSIntegration,
  VehicleDetection,
} from '../../types';
import { TacticalCard } from '../common/TacticalCard';
import { Badge } from '../common/Badge';
import { StatusDot } from '../common/StatusDot';

interface CommandCentreDashboardProps {
  cameras: Camera[];
  alerts: ExplainableAlert[];
  incidents: Incident[];
  investigations: Investigation[];
  vmsIntegrations: VMSIntegration[];
  detections: VehicleDetection[];
  onNavigate: (view: any) => void;
  onRunDemoScenario: () => void;
  isScenarioRunning?: boolean;
}

export const CommandCentreDashboard: React.FC<CommandCentreDashboardProps> = ({
  cameras,
  alerts,
  incidents,
  investigations,
  vmsIntegrations,
  detections,
  onNavigate,
  onRunDemoScenario,
  isScenarioRunning,
}) => {
  const onlineCameras = cameras.filter((c) => c.status === 'ONLINE').length;
  const degradedCameras = cameras.filter((c) => c.status === 'DEGRADED').length;
  const offlineCameras = cameras.filter((c) => c.status === 'OFFLINE').length;
  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
  const criticalAlerts = activeAlerts.filter((a) => a.severity === 'CRITICAL');
  const activeInvestigations = investigations.filter((i) => i.status === 'ACTIVE');

  // KPI Sparkline Demo Data
  const eventActivityData = [
    { time: '20:00', detections: 2800, alerts: 12 },
    { time: '21:00', detections: 3400, alerts: 15 },
    { time: '22:00', detections: 2900, alerts: 19 },
    { time: '23:00', detections: 2100, alerts: 26 },
    { time: '00:00', detections: 1400, alerts: 22 },
    { time: '01:00', detections: 1100, alerts: 34 },
  ];

  const departmentCameraData = [
    { name: 'Police', cameras: 18450, fill: '#3b82f6' },
    { name: 'Smart City', cameras: 9200, fill: '#06b6d4' },
    { name: 'Municipal', cameras: 6800, fill: '#8b5cf6' },
    { name: 'Transport', cameras: 3400, fill: '#f59e0b' },
    { name: 'Highway', cameras: 2900, fill: '#10b981' },
    { name: 'Ports/Air', cameras: 2100, fill: '#ec4899' },
  ];

  const alertBreakdownData = [
    { name: 'Critical', value: criticalAlerts.length || 1, color: '#ef4444' },
    { name: 'High', value: activeAlerts.filter((a) => a.severity === 'HIGH').length || 2, color: '#f97316' },
    { name: 'Medium', value: activeAlerts.filter((a) => a.severity === 'MEDIUM').length || 1, color: '#eab308' },
    { name: 'Low', value: 1, color: '#3b82f6' },
  ];

  return (
    <div id="command-centre-dashboard" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Banner: Mission & Demo Scenario Trigger */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-display text-lg font-bold tracking-wider text-slate-100 uppercase">
              STATE CCTV INTELLIGENCE & INTEGRATION MATRIX
            </span>
            <Badge variant="info">DECISION-SUPPORT ACTIVE</Badge>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Interoperable state intelligence grid federating{' '}
            <strong className="text-white">6 Departmental VMS Clusters</strong> across Gujarat.
            Provides explainable ANPR matching, cross-camera trajectory reconstruction, GIS telemetry,
            and end-to-end investigation dossiers.
          </p>
          <div className="flex items-center gap-4 mt-2 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Adapter Layer Operational
            </span>
            <span>•</span>
            <span className="text-slate-300">
              Edge Metadata Stream: <strong className="text-cyan-400">3.4 Gbps Ingress</strong>
            </span>
            <span>•</span>
            <span className="text-slate-300">
              Active Latency: <strong className="text-emerald-400">18 ms</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            id="dash-run-demo-btn"
            onClick={onRunDemoScenario}
            disabled={isScenarioRunning}
            className={`px-4 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
              isScenarioRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait animate-pulse'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/40 shadow-cyan-900/30 hover:scale-105'
            }`}
          >
            <Play className={`w-4 h-4 ${isScenarioRunning ? 'animate-spin' : 'fill-current'}`} />
            {isScenarioRunning ? 'Executing 12-Step Scenario...' : 'RUN LIVE DEMO SCENARIO'}
          </button>
          <button
            id="dash-open-gis-btn"
            onClick={() => onNavigate('gis')}
            className="px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs transition-colors flex items-center gap-1.5"
          >
            <span>GIS MAP</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Cameras */}
        <div
          onClick={() => onNavigate('cctv_registry')}
          className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TOTAL CAMERAS</span>
            <CameraIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">42,850</div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>99.1% Online Statewide</span>
          </div>
        </div>

        {/* Active Alerts */}
        <div
          onClick={() => onNavigate('alerts')}
          className="bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ACTIVE ALERTS</span>
            <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-400">
            {activeAlerts.length}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            <span>{criticalAlerts.length} Critical Priority</span>
          </div>
        </div>

        {/* Active Incidents */}
        <div
          onClick={() => onNavigate('incidents')}
          className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ACTIVE INCIDENTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-300">
            {incidents.filter((i) => i.status !== 'RESOLVED').length}
          </div>
          <div className="mt-1 text-[10px] font-mono text-slate-400">
            Correlated Multi-Cam Events
          </div>
        </div>

        {/* Active Investigations */}
        <div
          onClick={() => onNavigate('investigations')}
          className="bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>INVESTIGATIONS</span>
            <FolderLock className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-purple-300">
            {activeInvestigations.length}
          </div>
          <div className="mt-1 text-[10px] font-mono text-purple-400">
            Dossiers Under Review
          </div>
        </div>

        {/* Vehicle Detections (24h) */}
        <div
          onClick={() => onNavigate('vehicles')}
          className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>VEHICLE ANPR (24H)</span>
            <Car className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-300">1.48M</div>
          <div className="mt-1 text-[10px] font-mono text-slate-400">
            Avg OCR Conf: 96.4%
          </div>
        </div>

        {/* VMS Integration Health */}
        <div
          onClick={() => onNavigate('integrations')}
          className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-slate-850 group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>VMS FEDERATION</span>
            <Layers className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">6 / 6</div>
          <div className="mt-1 text-[10px] font-mono text-emerald-400">
            99.8% Grid Uptime
          </div>
        </div>
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Statewide Event Flow & Critical Incidents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Detections & Alert Trajectory Chart */}
          <TacticalCard
            title="Statewide CCTV Ingestion & Alert Velocity"
            subtitle="Real-time telemetry aggregated across Ahmedabad, Surat, Vadodara, Gandhinagar, and Highway grids"
            action={
              <Badge variant="info" size="sm">
                HOURLY TELEMETRY
              </Badge>
            }
          >
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={eventActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDetections" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="detections"
                    name="ANPR Detections"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorDetections)"
                  />
                  <Area
                    type="monotone"
                    dataKey="alerts"
                    name="Alert Triggers"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAlerts)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/80 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  ANPR Detections (Avg 2.4k/hr)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Explainable Alerts (Avg 24/hr)
                </span>
              </div>
              <span className="text-cyan-400">Bandwidth-Aware Edge Metadata Mode</span>
            </div>
          </TacticalCard>

          {/* Active Incidents Ticker */}
          <TacticalCard
            title="Active Statewide Incidents & Interceptions"
            subtitle="Multi-camera correlated events currently active in Gujarat jurisdiction"
            action={
              <button
                id="dash-view-all-incidents-btn"
                onClick={() => onNavigate('incidents')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                <span>VIEW ALL</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            }
          >
            <div className="space-y-3">
              {incidents.slice(0, 3).map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => onNavigate('incidents')}
                  className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={inc.severity === 'CRITICAL' ? 'danger' : 'warning'}
                        size="sm"
                      >
                        {inc.severity}
                      </Badge>
                      <span className="font-mono text-xs text-slate-400 font-semibold">
                        {inc.incidentNumber}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-slate-300 font-medium">
                        {inc.district}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {inc.title}
                    </div>
                    <p className="text-xs text-slate-400 leading-snug line-clamp-1">
                      {inc.summary}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 text-right font-mono flex-shrink-0">
                    <span className="text-xs text-slate-300">
                      Plates: <strong className="text-cyan-400">{inc.relatedVehiclePlates.join(', ') || 'N/A'}</strong>
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {inc.relatedCameraIds.length} Linked Cameras
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TacticalCard>
        </div>

        {/* Right Col: High Priority Alert Feed & Department Distribution */}
        <div className="space-y-6">
          {/* Priority Explainable Alerts Feed */}
          <TacticalCard
            title="Real-Time Explainable Alerts"
            subtitle="Weighted multi-factor security triggers"
            glow={criticalAlerts.length > 0 ? 'rose' : 'none'}
            action={
              <button
                id="dash-view-all-alerts-btn"
                onClick={() => onNavigate('alerts')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
              >
                <span>EXPLORE</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            }
          >
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => onNavigate('alerts')}
                  className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/90 hover:border-cyan-500/40 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        alt.severity === 'CRITICAL'
                          ? 'danger'
                          : alt.severity === 'HIGH'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {alt.severity}
                    </Badge>
                    <span className="font-mono text-xs text-emerald-400 font-bold">
                      SCORE: {alt.overallScore}/100
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-white line-clamp-1">
                    {alt.title}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                    <span>{alt.locationName}</span>
                    <span className="text-slate-500">{alt.timestamp.split(' ')[1]}</span>
                  </div>

                  {/* Explainability Mini Factors */}
                  <div className="space-y-1 pt-1 border-t border-slate-800/60">
                    {alt.factors.slice(0, 2).map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400 truncate max-w-[180px]">
                          ✓ {f.factor}
                        </span>
                        <span className="text-cyan-300 font-bold">+{f.score} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TacticalCard>

          {/* Department Federated Camera Share */}
          <TacticalCard
            title="Departmental Camera Federation"
            subtitle="Distribution of 42,850 cameras across Gujarat state agencies"
          >
            <div className="space-y-2.5">
              {departmentCameraData.map((d) => (
                <div key={d.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300">{d.name}</span>
                    <span className="text-slate-400 font-bold">
                      {d.cameras.toLocaleString()} ({((d.cameras / 42850) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(d.cameras / 42850) * 100}%`,
                        backgroundColor: d.fill,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
              💡 <strong>Core Principle:</strong> Existing VMS clusters (Milestone, Genetec, Dahua, HikCentral) remain operational. SENTINEL-X connects them via lightweight metadata adapters.
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
};
