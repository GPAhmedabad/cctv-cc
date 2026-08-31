import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Server,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  Database,
  Radio,
} from 'lucide-react';
import { TacticalCard } from '../common/TacticalCard';
import { Badge } from '../common/Badge';

export const SystemSettingsView: React.FC = () => {
  const [geminiEnabled, setGeminiEnabled] = useState(true);
  const [ocrConfidenceThreshold, setOcrConfidenceThreshold] = useState(85);
  const [retentionDays, setRetentionDays] = useState(90);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div id="system-settings-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              SYSTEM CONFIGURATION & PLATFORM PARAMETERS
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Statewide algorithmic thresholds, Gemini decision-support parameters, and retention policies
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 font-mono text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>System parameters updated and synchronized to state broker.</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* Gemini AI & Algorithmic Parameters */}
        <TacticalCard
          title="Server-Side Gemini & Decision Support Engine"
          subtitle="AI-driven incident correlation and explainable multi-factor scoring"
          glow="cyan"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div>
                <div className="font-bold text-white">Gemini 2.5 Flash Inference</div>
                <div className="text-[11px] text-slate-400">
                  Automated natural language summaries of multi-camera sightings
                </div>
              </div>
              <input
                type="checkbox"
                checked={geminiEnabled}
                onChange={(e) => setGeminiEnabled(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400">OCR CONFIDENCE REVIEW THRESHOLD</label>
                <span className="text-cyan-400 font-bold">{ocrConfidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min={60}
                max={98}
                value={ocrConfidenceThreshold}
                onChange={(e) => setOcrConfidenceThreshold(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500 mt-1">
                Detections below this threshold are routed to the Operator Review Queue
              </div>
            </div>
          </div>
        </TacticalCard>

        {/* Data Retention & Storage Policy */}
        <TacticalCard
          title="Data Retention & Cryptographic Sealing"
          subtitle="Compliance with Ministry of Home Affairs CCTV Guidelines"
        >
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-400">METADATA & VIDEO LOG RETENTION</label>
                <span className="text-cyan-400 font-bold">{retentionDays} Days</span>
              </div>
              <input
                type="range"
                min={30}
                max={365}
                step={30}
                value={retentionDays}
                onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <div className="text-slate-200 font-bold">STATE CLUSTER CONNECTION</div>
              <div className="text-slate-400 text-[11px]">Endpoint: <code>https://iccc.gujarat.gov.in/api/v1</code></div>
              <div className="text-emerald-400 text-[10px] flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Encrypted mTLS Connection Active</span>
              </div>
            </div>
          </div>
        </TacticalCard>
      </div>
    </div>
  );
};
