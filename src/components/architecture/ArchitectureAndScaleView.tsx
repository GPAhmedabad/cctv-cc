import React, { useState } from 'react';
import {
  Server,
  Cpu,
  Zap,
  TrendingDown,
  Layers,
  ShieldCheck,
  CheckCircle2,
  HardDrive,
  Activity,
  Sliders,
} from 'lucide-react';
import { TacticalCard } from '../common/TacticalCard';
import { Badge } from '../common/Badge';

export const ArchitectureAndScaleView: React.FC = () => {
  const [simulatedCameras, setSimulatedCameras] = useState<number>(42850);

  // Math models:
  // Raw 1080p stream at 4 Mbps = cameras * 4 Mbps
  const rawBandwidthGbps = ((simulatedCameras * 4) / 1000).toFixed(1);
  // Edge metadata stream = 16 Kbps per camera = cameras * 0.016 Mbps
  const edgeBandwidthMbps = (simulatedCameras * 16) / 1000;
  const edgeBandwidthGbps = (edgeBandwidthMbps / 1000).toFixed(2);
  const bandwidthSavings = (
    (1 - (parseFloat(edgeBandwidthGbps) / parseFloat(rawBandwidthGbps))) *
    100
  ).toFixed(1);

  // Monthly storage: 4 Mbps continuous = 1.3 TB / month / camera
  const rawMonthlyPetabytes = ((simulatedCameras * 1.3) / 1000).toFixed(1);
  const metadataMonthlyTerabytes = ((simulatedCameras * 0.005) * 30).toFixed(1);

  return (
    <div id="architecture-and-scale-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              STATEWIDE 80,000+ CAMERA ARCHITECTURE & EFFICIENCY SIMULATOR
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Bandwidth-efficient edge metadata architecture enabling massive statewide scale without network saturation
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="success">99.6% BANDWIDTH SAVINGS</Badge>
        </div>
      </div>

      {/* Interactive Scale Simulator Slider */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-white uppercase">
              INTERACTIVE SCALE SIMULATION WORKLOAD
            </div>
            <div className="text-slate-400 text-xs mt-0.5">
              Simulate Gujarat statewide camera growth from current deployment to 80,000+ camera saturation
            </div>
          </div>

          <div className="text-right">
            <span className="text-cyan-400 font-bold text-xl">
              {simulatedCameras.toLocaleString()} CAMERAS
            </span>
          </div>
        </div>

        <input
          type="range"
          min={5000}
          max={100000}
          step={5000}
          value={simulatedCameras}
          onChange={(e) => setSimulatedCameras(parseInt(e.target.value))}
          className="w-full accent-cyan-500 cursor-pointer h-2"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>5,000 (Pilot)</span>
          <span>42,850 (Current Gujarat Grid)</span>
          <span>80,000 (Phase 2 Target)</span>
          <span>100,000 (Full Statewide Saturation)</span>
        </div>
      </div>

      {/* Comparative Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        {/* Raw Video Streaming Approach */}
        <div className="p-5 rounded-xl bg-slate-900 border border-rose-500/30 space-y-3">
          <div className="text-rose-400 font-bold uppercase text-sm flex items-center justify-between">
            <span>TRADITIONAL CENTRALIZED STREAMING</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/30">
              UNFEASIBLE
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Streaming all RTSP video feeds continuously to the central command centre.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div>
              <div className="text-slate-500 text-[10px]">INGRESS BANDWIDTH REQUIRED</div>
              <div className="text-2xl font-bold text-rose-400">{rawBandwidthGbps} Gbps</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">MONTHLY CLOUD STORAGE</div>
              <div className="text-lg font-bold text-slate-200">{rawMonthlyPetabytes} Petabytes</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">ESTIMATED NETWORK COST</div>
              <div className="text-sm font-bold text-rose-300">₹48.5 Crore / Month</div>
            </div>
          </div>
        </div>

        {/* Sentinel-X Edge Metadata Approach */}
        <div className="p-5 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-3 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40">
          <div className="text-cyan-300 font-bold uppercase text-sm flex items-center justify-between">
            <span>SENTINEL-X EDGE METADATA PIPELINE</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              OPTIMAL
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Edge inference pushes structured OCR and bounding boxes; full video pulled strictly on-demand.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div>
              <div className="text-slate-500 text-[10px]">INGRESS BANDWIDTH REQUIRED</div>
              <div className="text-2xl font-bold text-emerald-400">{edgeBandwidthGbps} Gbps</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">MONTHLY METADATA STORAGE</div>
              <div className="text-lg font-bold text-emerald-400">{metadataMonthlyTerabytes} Terabytes</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">ESTIMATED NETWORK COST</div>
              <div className="text-sm font-bold text-emerald-300">₹18 Lakh / Month</div>
            </div>
          </div>
        </div>

        {/* Efficiency Gains */}
        <div className="p-5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-3">
          <div className="text-emerald-400 font-bold uppercase text-sm">
            EFFICIENCY & ROI SUMMARY
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Massive reduction in state telecom expenditure with sub-second alert response times.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div>
              <div className="text-slate-500 text-[10px]">BANDWIDTH REDUCTION</div>
              <div className="text-2xl font-bold text-cyan-400">{bandwidthSavings}%</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">END-TO-END ALERT LATENCY</div>
              <div className="text-lg font-bold text-emerald-400">&lt; 1.4 Seconds</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">DEPARTMENTAL INTEROPERABILITY</div>
              <div className="text-sm font-bold text-white">100% Non-Disruptive</div>
            </div>
          </div>
        </div>
      </div>

      {/* Microservice Architecture Blueprint Card */}
      <TacticalCard
        title="Federated Microservice Pipeline Blueprint"
        subtitle="Zero vendor lock-in architecture with modular distributed telemetry"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-cyan-400 font-bold">1. Edge Nodes & Adapters</div>
            <p className="text-slate-400 text-[11px]">
              ONVIF Profiles S/G/T, RTSP proxies, and Milestone/Genetec/Hikvision/Dahua plugin adapters.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-cyan-400 font-bold">2. High-Throughput Event Ingestion</div>
            <p className="text-slate-400 text-[11px]">
              Apache Kafka / Apache Pulsar cluster processing 45,000+ events per second.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-cyan-400 font-bold">3. Analytical Storage & GIS</div>
            <p className="text-slate-400 text-[11px]">
              ClickHouse for real-time aggregation + PostGIS spatial indexing + Redis Hot Cache.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="text-emerald-400 font-bold">4. Explainable Decision Engine</div>
            <p className="text-slate-400 text-[11px]">
              Multi-factor scoring algorithm, cross-camera trajectory builder, and RBAC governance.
            </p>
          </div>
        </div>
      </TacticalCard>
    </div>
  );
};
