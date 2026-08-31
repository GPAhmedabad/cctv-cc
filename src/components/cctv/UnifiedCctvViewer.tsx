import React, { useState, useEffect } from 'react';
import {
  Grid2X2,
  Grid3X3,
  Maximize,
  Minimize,
  Camera as CameraIcon,
  Video,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  ShieldAlert,
  Download,
  Crosshair,
  Sliders,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Sparkles,
} from 'lucide-react';
import { Camera, Department } from '../../types';
import { Badge } from '../common/Badge';
import { TacticalCard } from '../common/TacticalCard';

interface UnifiedCctvViewerProps {
  cameras: Camera[];
  initialCameraId?: string;
  onSaveSnapshotToEvidence?: (cameraId: string, snapshotName: string) => void;
}

export const UnifiedCctvViewer: React.FC<UnifiedCctvViewerProps> = ({
  cameras,
  initialCameraId,
  onSaveSnapshotToEvidence,
}) => {
  const [layout, setLayout] = useState<'1x1' | '2x2' | '3x3'>('2x2');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCamIds, setSelectedCamIds] = useState<string[]>([]);
  const [activeCamForPtz, setActiveCamForPtz] = useState<Camera | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [snapshotSuccessMsg, setSnapshotSuccessMsg] = useState<string | null>(null);

  // Initialize selected camera matrix
  useEffect(() => {
    if (cameras.length === 0) return;
    const defaultIds = cameras.slice(0, 9).map((c) => c.id);
    if (initialCameraId && cameras.some((c) => c.id === initialCameraId)) {
      setSelectedCamIds([initialCameraId, ...defaultIds.filter((id) => id !== initialCameraId).slice(0, 8)]);
    } else {
      setSelectedCamIds(defaultIds);
    }
    setActiveCamForPtz(cameras[0]);
  }, [cameras, initialCameraId]);

  const maxSlots = layout === '1x1' ? 1 : layout === '2x2' ? 4 : 9;
  const currentSlots = selectedCamIds.slice(0, maxSlots);

  const filteredCameraList = cameras.filter((c) => {
    if (selectedDept !== 'ALL' && c.department !== selectedDept) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.locationName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelectCameraForSlot = (camId: string, slotIndex: number) => {
    const updated = [...selectedCamIds];
    updated[slotIndex] = camId;
    setSelectedCamIds(updated);
  };

  const handleCaptureSnapshot = (cam: Camera) => {
    const time = new Date().toISOString();
    const title = `Snapshot Capture: ${cam.id} (${cam.locationName})`;
    if (onSaveSnapshotToEvidence) {
      onSaveSnapshotToEvidence(cam.id, title);
    }
    setSnapshotSuccessMsg(`Snapshot for ${cam.id} cryptographically secured to Evidence Locker with SHA-256 hash.`);
    setTimeout(() => setSnapshotSuccessMsg(null), 4000);
  };

  return (
    <div id="unified-cctv-viewer" className="p-4 space-y-4 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header & Layout Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            <span className="font-display text-sm font-bold tracking-wider text-slate-100 uppercase">
              UNIFIED MULTI-VENDOR CCTV MATRIX
            </span>
          </div>
          <Badge variant="info">SIMULATED VMS ADAPTER GRID</Badge>
        </div>

        {/* Layout Selectors & Stream Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              id="layout-1x1-btn"
              onClick={() => setLayout('1x1')}
              className={`px-2.5 py-1 rounded transition-colors ${
                layout === '1x1' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1x1 Single
            </button>
            <button
              id="layout-2x2-btn"
              onClick={() => setLayout('2x2')}
              className={`px-2.5 py-1 rounded transition-colors ${
                layout === '2x2' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid2X2 className="w-3.5 h-3.5 inline mr-1" />
              2x2 Quad
            </button>
            <button
              id="layout-3x3-btn"
              onClick={() => setLayout('3x3')}
              className={`px-2.5 py-1 rounded transition-colors ${
                layout === '3x3' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5 inline mr-1" />
              3x3 Matrix
            </button>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-amber-400" />}
            <span>{isPaused ? 'Resume Feeds' : 'Freeze All'}</span>
          </button>
        </div>
      </div>

      {snapshotSuccessMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{snapshotSuccessMsg}</span>
        </div>
      )}

      {/* Main Grid & Side Camera Selector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left 3 Cols: Video Matrix Canvas */}
        <div className="lg:col-span-3 space-y-4">
          <div
            className={`grid gap-3 ${
              layout === '1x1'
                ? 'grid-cols-1'
                : layout === '2x2'
                ? 'grid-cols-2'
                : 'grid-cols-3'
            }`}
          >
            {currentSlots.map((camId, index) => {
              const cam = cameras.find((c) => c.id === camId) || cameras[0];
              const isSelectedForPtz = activeCamForPtz?.id === cam?.id;

              return (
                <div
                  key={index}
                  onClick={() => setActiveCamForPtz(cam)}
                  className={`relative rounded-xl overflow-hidden bg-slate-950 border aspect-video transition-all shadow-xl flex flex-col justify-between group cursor-pointer ${
                    isSelectedForPtz
                      ? 'border-cyan-400 ring-1 ring-cyan-400/50'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Video Stream Canvas Simulation */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>

                  {/* Simulated Moving Object / ANPR Box HUD */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-36 h-20 border border-cyan-400/60 rounded relative">
                      <div className="absolute -top-4 left-0 px-1 py-0.2 bg-cyan-950/90 text-cyan-300 text-[8px] font-mono border border-cyan-500/40">
                        ANPR OCR 98.4%
                      </div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-cyan-400"></div>
                      <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-cyan-400"></div>
                    </div>
                  </div>

                  {/* Top Bar HUD */}
                  <div className="p-2 z-10 flex items-center justify-between text-[10px] font-mono bg-gradient-to-b from-slate-950/90 to-transparent">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span className="text-white font-bold tracking-wider">{cam.id}</span>
                      <span className="text-slate-400">• {cam.vendor}</span>
                    </div>
                    <span className="text-cyan-400 bg-black/60 px-1.5 py-0.5 rounded border border-slate-800">
                      {cam.resolution} @ {cam.fps}fps
                    </span>
                  </div>

                  {/* Center Watermark & Status */}
                  <div className="text-center z-10 pointer-events-none">
                    <div className="text-[11px] font-mono text-slate-300 font-semibold drop-shadow">
                      {cam.locationName}
                    </div>
                    <div className="text-[9px] font-mono text-slate-500">
                      Instance: {cam.vmsInstance}
                    </div>
                  </div>

                  {/* Bottom Bar HUD & Controls */}
                  <div className="p-2 z-10 flex items-center justify-between text-[10px] font-mono bg-gradient-to-t from-slate-950/95 to-transparent">
                    <div className="text-slate-400">
                      LATENCY: <strong className="text-emerald-400">{cam.latencyMs}ms</strong>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        title="Capture Forensic Snapshot"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCaptureSnapshot(cam);
                        }}
                        className="p-1 rounded bg-slate-800/90 hover:bg-cyan-600 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                      >
                        <CameraIcon className="w-3 h-3" />
                      </button>
                      <button
                        title="PTZ Controls"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveCamForPtz(cam);
                        }}
                        className="p-1 rounded bg-slate-800/90 hover:bg-cyan-600 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                      >
                        <Crosshair className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Camera Selector & PTZ Control Deck */}
        <div className="space-y-4">
          {/* PTZ Simulation Deck */}
          {activeCamForPtz && (
            <TacticalCard
              title="Tactical PTZ Control Deck"
              subtitle={`Node: ${activeCamForPtz.id} (${activeCamForPtz.cameraType})`}
              glow="cyan"
            >
              <div className="space-y-3 font-mono">
                {/* Virtual Joystick */}
                <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <button className="p-2 rounded bg-slate-900 hover:bg-cyan-600/30 text-slate-300 border border-slate-800 transition-colors">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-3 my-1">
                    <button className="p-2 rounded bg-slate-900 hover:bg-cyan-600/30 text-slate-300 border border-slate-800 transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-cyan-500/40 flex items-center justify-center text-[10px] text-cyan-400 font-bold">
                      PTZ
                    </div>
                    <button className="p-2 rounded bg-slate-900 hover:bg-cyan-600/30 text-slate-300 border border-slate-800 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="p-2 rounded bg-slate-900 hover:bg-cyan-600/30 text-slate-300 border border-slate-800 transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Zoom & Focus Controls */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors">
                    <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Zoom In</span>
                  </button>
                  <button className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors">
                    <ZoomOut className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Zoom Out</span>
                  </button>
                </div>

                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 space-y-1">
                  <div>VMS: <strong>{activeCamForPtz.vendor}</strong></div>
                  <div>BEARING: <strong>{activeCamForPtz.directionBearing}° North</strong></div>
                  <div>ZONE: <strong>{activeCamForPtz.zone}</strong></div>
                </div>
              </div>
            </TacticalCard>
          )}

          {/* Camera Quick Assignment List */}
          <TacticalCard
            title="Federated Camera List"
            subtitle="Click to assign into active multi-grid slots"
          >
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter camera..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1 pr-1">
                {filteredCameraList.map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => handleSelectCameraForSlot(cam.id, 0)}
                    className="w-full text-left p-2 rounded bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 hover:border-cyan-500/40 transition-colors text-xs font-mono flex items-center justify-between"
                  >
                    <div className="truncate mr-2">
                      <div className="font-semibold text-slate-200">{cam.id}</div>
                      <div className="text-[10px] text-slate-400 truncate">{cam.locationName}</div>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 flex-shrink-0">
                      {cam.department}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </TacticalCard>
        </div>
      </div>
    </div>
  );
};
