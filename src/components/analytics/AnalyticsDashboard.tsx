import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Car,
  ShieldAlert,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { TacticalCard } from '../common/TacticalCard';
import { Badge } from '../common/Badge';

export const AnalyticsDashboard: React.FC = () => {
  // District Detections
  const districtData = [
    { district: 'Ahmedabad', detections: 642000, alerts: 142 },
    { district: 'Surat', detections: 410000, alerts: 98 },
    { district: 'Vadodara', detections: 220000, alerts: 54 },
    { district: 'Gandhinagar', detections: 180000, alerts: 32 },
    { district: 'Rajkot', detections: 155000, alerts: 41 },
    { district: 'Highways/NE1', detections: 320000, alerts: 88 },
  ];

  // OCR Confidence Distribution
  const ocrData = [
    { range: '95-100%', count: 78, fill: '#10b981' },
    { range: '90-94%', count: 16, fill: '#06b6d4' },
    { range: '80-89%', count: 4, fill: '#f59e0b' },
    { range: '<80% (Review)', count: 2, fill: '#ef4444' },
  ];

  // Hourly Traffic Volume
  const hourlyData = [
    { hour: '06:00', vehicles: 45000 },
    { hour: '09:00', vehicles: 125000 },
    { hour: '12:00', vehicles: 85000 },
    { hour: '15:00', vehicles: 92000 },
    { hour: '18:00', vehicles: 148000 },
    { hour: '21:00', vehicles: 72000 },
    { hour: '00:00', vehicles: 28000 },
    { hour: '03:00', vehicles: 14000 },
  ];

  return (
    <div id="analytics-dashboard" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              STATE CCTV ANALYTICS & OPERATIONAL KPIS
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Aggregated intelligence metrics, OCR accuracy curves, and cross-corridor throughput
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="info">24-HOUR STATEWIDE AGGREGATION</Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs">TOTAL 24H READS</div>
          <div className="text-2xl font-bold text-white mt-1">1.929M</div>
          <div className="text-[10px] text-emerald-400 mt-0.5">↑ +14.2% vs yesterday</div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs">AVG OCR ACCURACY</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">96.8%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Edge model inference</div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs">WATCHLIST INTERCEPTIONS</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">45 Hits</div>
          <div className="text-[10px] text-rose-400 mt-0.5">100% Verified</div>
        </div>
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-slate-400 text-xs">MEAN TIME TO ALERT (MTTA)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">1.4 sec</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Edge to Dashboard</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District Volume Breakdown */}
        <TacticalCard
          title="Vehicle Reads & Alerts by District"
          subtitle="Ahmedabad and Surat lead urban traffic telemetry"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="district" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="detections" name="ANPR Reads" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TacticalCard>

        {/* Hourly Traffic Velocity */}
        <TacticalCard
          title="24-Hour Diurnal Traffic Throughput"
          subtitle="Peak rush hours recorded at 09:00 IST and 18:00 IST"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="vehicles"
                  name="Vehicles Processed"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TacticalCard>
      </div>

      {/* OCR Accuracy Breakdown */}
      <TacticalCard
        title="OCR Confidence Calibration Spectrum"
        subtitle="94% of detections operate above 90% confidence threshold requiring zero human review"
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono text-xs">
          {ocrData.map((item) => (
            <div key={item.range} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{item.range}</span>
                <span className="text-white font-bold">{item.count}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${item.count}%`, backgroundColor: item.fill }} />
              </div>
            </div>
          ))}
        </div>
      </TacticalCard>
    </div>
  );
};
