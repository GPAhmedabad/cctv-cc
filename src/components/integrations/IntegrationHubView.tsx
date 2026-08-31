import React, { useState } from 'react';
import {
  Layers,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Network,
  Activity,
  Server,
  Zap,
  ArrowRight,
  ShieldCheck,
  Lock,
  Cpu,
} from 'lucide-react';
import { VMSIntegration } from '../../types';
import { TacticalCard } from '../common/TacticalCard';
import { Badge } from '../common/Badge';
import { StatusDot } from '../common/StatusDot';

interface IntegrationHubViewProps {
  integrations: VMSIntegration[];
  onSyncIntegration: (id: string) => void;
}

export const IntegrationHubView: React.FC<IntegrationHubViewProps> = ({
  integrations,
  onSyncIntegration,
}) => {
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSync = (id: string) => {
    setSyncingId(id);
    onSyncIntegration(id);
    setTimeout(() => setSyncingId(null), 1200);
  };

  const totalCameras = integrations.reduce((acc, v) => acc + v.cameraCount, 0);

  return (
    <div id="integration-hub-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              MULTI-VENDOR CCTV FEDERATION & VMS INTEGRATION HUB
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            "CONNECT EXISTING CCTV SYSTEMS — DO NOT REPLACE THEM." Interoperability Layer for Gujarat State
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <Badge variant="success" size="md">
            ADAPTER PIPELINE ACTIVE
          </Badge>
        </div>
      </div>

      {/* Architectural Flow Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
          STANDARDIZED VMS INTEROPERABILITY ARCHITECTURE
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center font-mono text-xs">
          {/* Step 1 */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-cyan-400 font-bold">1. DEPARTMENTAL VMS</div>
            <p className="text-slate-400 text-[11px]">
              Milestone, Genetec, Dahua, HikCentral, Uniview remain 100% operational locally.
            </p>
          </div>

          <div className="hidden md:flex justify-center text-slate-600">
            <ArrowRight className="w-5 h-5 text-cyan-400" />
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-cyan-500/40 space-y-1">
            <div className="text-cyan-300 font-bold">2. SENTINEL-X ADAPTER</div>
            <p className="text-slate-400 text-[11px]">
              Normalized ONVIF Profile S/G/T & Vendor SDK metadata ingestion layer.
            </p>
          </div>

          <div className="hidden md:flex justify-center text-slate-600">
            <ArrowRight className="w-5 h-5 text-cyan-400" />
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-bold">3. STATE INTELLIGENCE</div>
            <p className="text-slate-400 text-[11px]">
              Unified GIS, cross-camera tracking, explainable alerts, and investigation dossiers.
            </p>
          </div>
        </div>
      </div>

      {/* Integration Grid Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((vms) => {
          const isConnected = vms.status === 'CONNECTED';
          const isDegraded = vms.status === 'DEGRADED';
          const isSyncing = syncingId === vms.id;

          return (
            <div
              key={vms.id}
              className={`rounded-xl border p-4 bg-slate-900/90 backdrop-blur-md transition-all space-y-3 ${
                isConnected
                  ? 'border-slate-800 hover:border-cyan-500/40'
                  : 'border-amber-500/40 bg-amber-950/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <StatusDot status={vms.status} />
                    <span className="font-bold text-sm text-white font-mono">{vms.name}</span>
                  </div>
                  <div className="text-xs text-cyan-400 font-mono mt-0.5">{vms.vendor}</div>
                </div>

                <Badge variant={isConnected ? 'success' : 'warning'} size="sm">
                  {vms.status}
                </Badge>
              </div>

              {/* Specs & Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <div>
                  <div className="text-slate-500 text-[10px]">FEDERATED CAMERAS</div>
                  <div className="text-slate-200 font-bold">{vms.cameraCount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">UPTIME / SLA</div>
                  <div className="text-emerald-400 font-bold">{vms.uptimePercent}%</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">LATENCY (RTT)</div>
                  <div className="text-slate-200 font-bold">{vms.latencyMs} ms</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">PACKET LOSS</div>
                  <div className={vms.packetLossPercent > 1 ? 'text-amber-400 font-bold' : 'text-slate-200'}>
                    {vms.packetLossPercent}%
                  </div>
                </div>
              </div>

              {/* Telemetry Footer */}
              <div className="text-[10px] font-mono text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>PROTOCOL:</span>
                  <span className="text-slate-300 font-semibold">{vms.protocol} ({vms.authMethod})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>EVENTS INGESTED:</span>
                  <span className="text-cyan-300 font-semibold">{vms.eventsPerMinute} ev/min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>LAST SYNC:</span>
                  <span className="text-slate-400">{vms.lastSync}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">v{vms.version}</span>
                <button
                  id={`sync-vms-${vms.id}`}
                  onClick={() => handleSync(vms.id)}
                  disabled={isSyncing}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Test Connection'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
