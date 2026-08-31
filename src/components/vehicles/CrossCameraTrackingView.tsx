import React, { useState } from 'react';
import {
  Network,
  Car,
  Clock,
  MapPin,
  Play,
  ArrowRight,
  TrendingUp,
  Compass,
  AlertTriangle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { JourneyReconstruction, Camera } from '../../types';
import { Badge } from '../common/Badge';
import { TacticalCard } from '../common/TacticalCard';
import { JourneyReplayModal } from './JourneyReplayModal';
import { MOCK_TARGET_JOURNEY } from '../../data/mockData';

interface CrossCameraTrackingViewProps {
  journey?: JourneyReconstruction;
  cameras?: Camera[];
  initialPlate?: string;
  onAddToInvestigation?: (plate: string, journeyId?: string) => void;
  onSearchPlate?: (plate: string) => void;
  onOpenJourneyReplay?: (plate: string) => void;
}

export const CrossCameraTrackingView: React.FC<CrossCameraTrackingViewProps> = ({
  journey: propJourney,
  cameras = [],
  initialPlate = 'GJ01AB1234',
  onAddToInvestigation,
  onSearchPlate,
  onOpenJourneyReplay,
}) => {
  const [isReplayOpen, setIsReplayOpen] = useState(false);
  const [queryPlate, setQueryPlate] = useState(initialPlate);

  const journey = propJourney || MOCK_TARGET_JOURNEY;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchPlate) {
      onSearchPlate(queryPlate);
    }
  };

  const handleOpenReplay = () => {
    if (onOpenJourneyReplay) {
      onOpenJourneyReplay(queryPlate);
    } else {
      setIsReplayOpen(true);
    }
  };

  const waypoints = journey?.waypoints || [];
  const handoffs = journey?.predictiveHandoffs || [];

  return (
    <div id="cross-camera-tracking-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              CROSS-CAMERA TRAJECTORY RECONSTRUCTION
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Correlated multi-junction CCTV tracking, time-gap velocity analysis, and predictive camera handoff
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            id="open-journey-replay-btn"
            onClick={handleOpenReplay}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-all shadow-lg shadow-cyan-900/30 flex items-center gap-2 hover:scale-105"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>▶ REPLAY TIMELINE (ANIMATED)</span>
          </button>
        </div>
      </div>

      {/* Target Info Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">TARGET VEHICLE:</span>
          <input
            type="text"
            value={queryPlate}
            onChange={(e) => setQueryPlate(e.target.value.toUpperCase())}
            className="px-3 py-1.5 bg-black border border-slate-700 rounded text-cyan-300 font-bold text-sm tracking-wider w-36 uppercase focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
          >
            Reconstruct
          </button>
        </form>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">TOTAL SIGHTINGS:</span>
            <span className="text-white font-bold">{waypoints.length} Cameras</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">DISTANCE:</span>
            <span className="text-cyan-400 font-bold">{journey.distanceKm} km</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">AVG VELOCITY:</span>
            <span className="text-emerald-400 font-bold">{journey.averageSpeedKmph} km/h</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">WINDOW:</span>
            <span className="text-purple-400 font-bold">{journey.durationMinutes} mins</span>
          </div>
        </div>
      </div>

      {/* Main Chronological Sighting Chain */}
      <TacticalCard
        title="Chronological Sighting Trajectory"
        subtitle="Ordered spatial trail captured across multi-department VMS nodes"
        glow="cyan"
      >
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyan-500/40">
          {waypoints.map((wp, index) => {
            const isFirst = index === 0;
            const isLast = index === waypoints.length - 1;

            return (
              <div key={wp.cameraId + index} className="relative group">
                {/* Node Bullet */}
                <div
                  className={`absolute -left-[27px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 flex items-center justify-center ${
                    isLast
                      ? 'bg-rose-500 animate-ping'
                      : isFirst
                      ? 'bg-emerald-500'
                      : 'bg-cyan-500'
                  }`}
                />

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-cyan-500/40 transition-all space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 text-xs font-mono font-bold">
                        STEP #{index + 1}
                      </span>
                      <span className="font-semibold text-sm text-white">
                        {wp.cameraName}
                      </span>
                      <Badge variant="info" size="sm">
                        {wp.cameraId}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        {wp.timestamp}
                      </span>
                      {wp.timeGapMinutes > 0 && (
                        <span className="text-amber-400">
                          (+{wp.timeGapMinutes} min gap)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sighting Details Sub-bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-2 border-t border-slate-800/60 text-slate-400">
                    <div>
                      LOCATION: <strong className="text-slate-200">{wp.locationName}</strong>
                    </div>
                    <div>
                      DIRECTION: <strong className="text-slate-200">{wp.direction}</strong>
                    </div>
                    <div>
                      DISTRICT: <strong className="text-slate-200">{wp.district}</strong>
                    </div>
                    <div>
                      OCR CONF: <strong className="text-cyan-300">{wp.confidence}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </TacticalCard>

      {/* Predictive Next Camera Handoff Card */}
      <TacticalCard
        title="Predictive Trajectory & Next-Camera Handoff Model"
        subtitle="Calculated handoff probability vectors based on heading, speed, and road graph network"
        glow="purple"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {handoffs.map((pred, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 transition-colors space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-purple-400 font-bold">PREDICTED NODE #{i + 1}</span>
                <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 text-xs font-bold border border-purple-500/30">
                  {pred.probability}% PROBABILITY
                </span>
              </div>

              <div className="font-semibold text-white text-sm">
                {pred.cameraName}
              </div>
              <div className="text-slate-400 text-[11px]">
                Road: <strong className="text-slate-200">{pred.roadName}</strong>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-400">
                <span>ESTIMATED ETA:</span>
                <span className="text-emerald-400 font-bold">{pred.estimatedEtaSeconds}s</span>
              </div>
              <p className="text-[10px] text-slate-500">{pred.rationale}</p>
            </div>
          ))}
        </div>
      </TacticalCard>

      {/* Journey Replay Modal */}
      {isReplayOpen && (
        <JourneyReplayModal
          isOpen={isReplayOpen}
          onClose={() => setIsReplayOpen(false)}
          journey={journey}
          cameras={cameras}
        />
      )}
    </div>
  );
};
