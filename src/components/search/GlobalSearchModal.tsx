import React, { useState, useEffect } from 'react';
import {
  Search,
  Car,
  Camera as CameraIcon,
  BellRing,
  FolderLock,
  MapPin,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Camera, ExplainableAlert, Investigation, VehicleDetection } from '../../types';
import { Badge } from '../common/Badge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  cameras: Camera[];
  alerts: ExplainableAlert[];
  investigations: Investigation[];
  detections: VehicleDetection[];
  onNavigate: (view: any) => void;
  onTrackPlate: (plate: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  cameras,
  alerts,
  investigations,
  detections,
  onNavigate,
  onTrackPlate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // toggle modal handled at parent level
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Search Results
  const matchingPlates = q
    ? Array.from(new Set(detections.filter((d) => d.plateNumber.toLowerCase().includes(q)).map((d) => d.plateNumber)))
    : [];

  const matchingCameras = q
    ? cameras.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.locationName.toLowerCase().includes(q)
      )
    : [];

  const matchingAlerts = q
    ? alerts.filter(
        (a) =>
          a.id.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.locationName.toLowerCase().includes(q)
      )
    : [];

  const matchingInvestigations = q
    ? investigations.filter(
        (i) =>
          i.caseNumber.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.summary.toLowerCase().includes(q)
      )
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="NATURAL LANGUAGE & STRUCTURED GLOBAL QUERY"
      subtitle="Search license plates, camera nodes, active alerts, case dossiers, and spatial locations"
      maxWidth="2xl"
    >
      <div className="space-y-4 font-mono text-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-cyan-400 absolute left-3.5 top-3" />
          <input
            type="text"
            autoFocus
            placeholder="Type license plate (e.g. GJ01AB1234), junction name, or alert ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-cyan-500 shadow-inner"
          />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400">
          <span className="text-slate-500">SUGGESTIONS:</span>
          {['GJ01AB1234', 'Pakwan Crossroad', 'Operation Hawk', 'Milestone', 'SG Highway'].map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-1">
          {/* Target Plates */}
          {matchingPlates.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-slate-500 uppercase font-bold">
                VEHICLE INTELLIGENCE ({matchingPlates.length})
              </div>
              {matchingPlates.map((plate) => (
                <div
                  key={plate}
                  onClick={() => {
                    onTrackPlate(plate);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white tracking-wider">{plate}</span>
                  </div>
                  <span className="text-cyan-400 flex items-center gap-1">
                    Reconstruct Journey <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Cameras */}
          {matchingCameras.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-slate-500 uppercase font-bold">
                CCTV NODES ({matchingCameras.length})
              </div>
              {matchingCameras.map((cam) => (
                <div
                  key={cam.id}
                  onClick={() => {
                    onNavigate('cctv_registry');
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <CameraIcon className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="font-bold text-white mr-2">{cam.id}</span>
                      <span className="text-slate-400">{cam.name}</span>
                    </div>
                  </div>
                  <Badge variant="info" size="sm">
                    {cam.department}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Alerts */}
          {matchingAlerts.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-slate-500 uppercase font-bold">
                EXPLAINABLE ALERTS ({matchingAlerts.length})
              </div>
              {matchingAlerts.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => {
                    onNavigate('alerts');
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/40 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">{alt.title}</div>
                    <div className="text-[10px] text-slate-400">{alt.locationName}</div>
                  </div>
                  <Badge variant="danger" size="sm">
                    {alt.severity}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Investigations */}
          {matchingInvestigations.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] text-slate-500 uppercase font-bold">
                INVESTIGATION DOSSIERS ({matchingInvestigations.length})
              </div>
              {matchingInvestigations.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => {
                    onNavigate('investigations');
                    onClose();
                  }}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-purple-500/40 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-purple-300">{inv.caseNumber}</div>
                    <div className="text-slate-200">{inv.title}</div>
                  </div>
                  <Badge variant="purple" size="sm">
                    {inv.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {query &&
            matchingPlates.length === 0 &&
            matchingCameras.length === 0 &&
            matchingAlerts.length === 0 &&
            matchingInvestigations.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No matching records found for "{query}". Try checking plate wildcards or junction names.
              </div>
            )}
        </div>
      </div>
    </Modal>
  );
};
