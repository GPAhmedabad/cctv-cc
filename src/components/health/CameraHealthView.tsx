import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Camera as CameraIcon,
  Wifi,
  WifiOff,
  Cpu,
  Clock,
} from 'lucide-react';
import { Camera } from '../../types';
import { Badge } from '../common/Badge';
import { TacticalCard } from '../common/TacticalCard';

interface CameraHealthViewProps {
  cameras: Camera[];
}

export const CameraHealthView: React.FC<CameraHealthViewProps> = ({ cameras }) => {
  const [filter, setFilter] = useState<'ALL' | 'ONLINE' | 'DEGRADED' | 'OFFLINE'>('ALL');

  const filteredCameras = cameras.filter((c) => {
    if (filter !== 'ALL' && c.status !== filter) return false;
    return true;
  });

  const online = cameras.filter((c) => c.status === 'ONLINE').length;
  const degraded = cameras.filter((c) => c.status === 'DEGRADED').length;
  const offline = cameras.filter((c) => c.status === 'OFFLINE').length;

  return (
    <div id="camera-health-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              CAMERA TELEMETRY & NETWORK HEALTH
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time ping, packet loss, RTSP latency, and automated network degradation diagnostics
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="success">99.1% STATEWIDE REACHABILITY</Badge>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div
          onClick={() => setFilter('ONLINE')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ONLINE & OPTIMAL</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{online} Nodes</div>
          <div className="text-[10px] text-slate-500 mt-0.5">&lt; 30ms latency • 0% loss</div>
        </div>

        <div
          onClick={() => setFilter('DEGRADED')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>DEGRADED TELEMETRY</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{degraded} Nodes</div>
          <div className="text-[10px] text-slate-500 mt-0.5">High RTT / Frame drops</div>
        </div>

        <div
          onClick={() => setFilter('OFFLINE')}
          className="p-4 bg-slate-900 border border-slate-800 hover:border-rose-500/40 rounded-xl cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>OFFLINE / UNREACHABLE</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-1">{offline} Nodes</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Ticket auto-dispatched</div>
        </div>
      </div>

      {/* Filter Selector */}
      <div className="flex items-center gap-2 font-mono text-xs">
        {(['ALL', 'ONLINE', 'DEGRADED', 'OFFLINE'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded transition-colors ${
              filter === st
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {st} ({st === 'ALL' ? cameras.length : cameras.filter((c) => c.status === st).length})
          </button>
        ))}
      </div>

      {/* Telemetry Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCameras.map((cam) => {
          const isOnline = cam.status === 'ONLINE';
          const isDegraded = cam.status === 'DEGRADED';

          return (
            <div
              key={cam.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-3 font-mono text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <CameraIcon className="w-4 h-4 text-cyan-400" />
                    <span>{cam.id}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5">
                    {cam.name}
                  </div>
                </div>

                <Badge
                  variant={isOnline ? 'success' : isDegraded ? 'warning' : 'danger'}
                  size="sm"
                >
                  {cam.status}
                </Badge>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-[11px]">
                <div>
                  <div className="text-slate-500">HEALTH SCORE</div>
                  <div className="text-slate-200 font-bold">{cam.healthScore}%</div>
                </div>
                <div>
                  <div className="text-slate-500">RTT LATENCY</div>
                  <div className={cam.latencyMs > 50 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {cam.latencyMs} ms
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">PACKET LOSS</div>
                  <div className={cam.packetLoss > 2 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                    {cam.packetLoss}%
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">FRAMERATE</div>
                  <div className="text-slate-200 font-bold">{cam.fps} FPS</div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-800">
                <span>VMS: {cam.vmsInstance}</span>
                <span>Ping: {cam.lastHeartbeat}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
