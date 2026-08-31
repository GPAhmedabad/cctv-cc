import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Car,
  Camera as CameraIcon,
  Network,
  FolderLock,
  GitGraph,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface DemoScenarioRunnerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: any) => void;
}

export const DemoScenarioRunner: React.FC<DemoScenarioRunnerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const scenarioSteps = [
    {
      step: 1,
      title: 'Statewide Watchlist Hit Triggered',
      desc: 'Target Vehicle GJ01AB1234 (Black Fortuner) flagged under FIR-2025-SG-HIGHWAY-09.',
      view: 'watchlists',
      icon: ShieldAlert,
      color: '#ef4444',
    },
    {
      step: 2,
      title: 'Milestone VMS Adapter Ingestion',
      desc: 'Camera CAM-AMD-001 at Pakwan Crossroad streams normalized ANPR metadata to Sentinel-X.',
      view: 'integrations',
      icon: CameraIcon,
      color: '#06b6d4',
    },
    {
      step: 3,
      title: 'Explainable Multi-Factor Scoring (94/100)',
      desc: 'Weighted breakdown: Hotlist Match (+40), Night-time Transit (+15), Speed Anomaly (+20), Corridor Risk (+19).',
      view: 'alerts',
      icon: Sparkles,
      color: '#f59e0b',
    },
    {
      step: 4,
      title: 'Operator Decision-Support Validation',
      desc: 'Command Centre Operator validates 96.8% OCR accuracy in the Human-in-the-Loop review queue.',
      view: 'vehicles',
      icon: CheckCircle2,
      color: '#10b981',
    },
    {
      step: 5,
      title: 'Cross-Camera Trajectory Reconstruction',
      desc: 'Automated chain generated across 6 consecutive cameras on SG Highway corridor.',
      view: 'cross_camera',
      icon: Network,
      color: '#06b6d4',
    },
    {
      step: 6,
      title: 'GIS Intelligence & Live Map Tracking',
      desc: 'Spatial polyline rendered on GIS map with active telemetry pulse and geofence overlays.',
      view: 'gis',
      icon: Car,
      color: '#3b82f6',
    },
    {
      step: 7,
      title: 'Predictive Next-Camera Handoff Model',
      desc: 'System predicts 92% probability of target reaching GIFT City South Gate in 4 minutes.',
      view: 'cross_camera',
      icon: Network,
      color: '#a855f7',
    },
    {
      step: 8,
      title: 'Multi-Camera Incident Correlation',
      desc: 'Automated grouping into Incident INC-2025-042 with rapid response field unit dispatch.',
      view: 'incidents',
      icon: Flame,
      color: '#f97316',
    },
    {
      step: 9,
      title: 'Unified CCTV Quad-Grid Inspection',
      desc: 'Live multi-vendor RTSP streams locked onto target junctions with virtual PTZ tracking.',
      view: 'cctv_live',
      icon: CameraIcon,
      color: '#06b6d4',
    },
    {
      step: 10,
      title: 'Case Dossier & Evidence Locker Sealing',
      desc: 'Forensic snapshots cryptographically sealed into Investigation INV-2025-042 with SHA-256.',
      view: 'investigations',
      icon: FolderLock,
      color: '#a855f7',
    },
    {
      step: 11,
      title: 'Inter-Entity Investigation Link Graph',
      desc: 'Node-link graph visualizes connections between Vehicle, Suspect, Cameras, and FIR.',
      view: 'investigation_graph',
      icon: GitGraph,
      color: '#a855f7',
    },
    {
      step: 12,
      title: 'Court Dossier & Immutable Audit Signoff',
      desc: 'Court-admissible PDF generated with immutable timestamp and cryptographic audit signature.',
      view: 'audit',
      icon: FileText,
      color: '#10b981',
    },
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= scenarioSteps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const active = scenarioSteps[currentStep];
  const Icon = active.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="STATEWIDE INTELLIGENCE DEMO SCENARIO (12 STEPS)"
      subtitle="Comprehensive walkthrough of Sentinel-X capabilities for Government Evaluators"
      maxWidth="3xl"
    >
      <div className="space-y-5 font-mono text-xs">
        {/* Active Step Showcase Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-lg"
                style={{ backgroundColor: active.color }}
              >
                {active.step}
              </span>
              <Badge variant="info" size="md">
                STEP {active.step} OF 12
              </Badge>
            </div>

            <button
              onClick={() => {
                onNavigate(active.view);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors flex items-center gap-1.5"
            >
              <span>Jump to Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-bold text-white tracking-wide">
              {active.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">{active.desc}</p>
          </div>
        </div>

        {/* Step Scrubber / Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Scenario Progress</span>
            <span className="text-cyan-400 font-bold">
              {Math.round(((currentStep + 1) / 12) * 100)}% Completed
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${((currentStep + 1) / 12) * 100}%` }}
            />
          </div>
        </div>

        {/* 12-Step Matrix Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
          {scenarioSteps.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStep(idx);
                setIsPlaying(false);
              }}
              className={`p-2 rounded-lg text-left transition-all text-[10px] space-y-0.5 ${
                currentStep === idx
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : currentStep > idx
                  ? 'bg-slate-950 text-slate-400 border border-slate-800'
                  : 'bg-slate-950/60 text-slate-500 border border-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>#{s.step}</span>
                {currentStep > idx && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </div>
              <div className="truncate">{s.title}</div>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Resume Scenario'}</span>
            </button>
            <button
              onClick={() => {
                setCurrentStep(0);
                setIsPlaying(true);
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Close Runner
          </button>
        </div>
      </div>
    </Modal>
  );
};
