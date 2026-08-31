import React, { useState } from 'react';
import {
  Flame,
  AlertTriangle,
  MapPin,
  Clock,
  Car,
  Camera as CameraIcon,
  Shield,
  CheckCircle2,
  FolderPlus,
  Radio,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Incident } from '../../types';
import { Badge } from '../common/Badge';
import { TacticalCard } from '../common/TacticalCard';
import { Modal } from '../common/Modal';

interface IncidentCorrelationViewProps {
  incidents: Incident[];
  onUpdateStatus: (id: string, status: any) => void;
  onTrackPlate?: (plate: string) => void;
  onOpenInvestigation?: (incidentId: string) => void;
}

export const IncidentCorrelationView: React.FC<IncidentCorrelationViewProps> = ({
  incidents,
  onUpdateStatus,
  onTrackPlate,
  onOpenInvestigation,
}) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  return (
    <div id="incident-correlation-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              STATEWIDE INCIDENT CORRELATION ENGINE
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated correlation of multi-camera sightings, geofence breaches, and field unit dispatch
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="warning" size="md">
            {incidents.filter((i) => i.status !== 'RESOLVED').length} ACTIVE INCIDENTS
          </Badge>
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {incidents.map((inc) => {
          const isCritical = inc.severity === 'CRITICAL';

          return (
            <div
              key={inc.id}
              onClick={() => setSelectedIncident(inc)}
              className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer space-y-4 shadow-xl group"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={isCritical ? 'danger' : 'warning'} size="sm">
                      {inc.severity}
                    </Badge>
                    <span className="font-mono text-xs text-slate-400 font-bold">
                      {inc.incidentNumber}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {inc.title}
                  </h3>
                </div>

                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-cyan-300 border border-slate-700">
                  {inc.status}
                </span>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-300 font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                {inc.summary}
              </p>

              {/* Linked Cameras & Plates */}
              <div className="space-y-1.5 text-xs font-mono text-slate-400">
                <div className="flex items-center justify-between">
                  <span>CORRIDOR / JURISDICTION:</span>
                  <span className="text-slate-200 font-semibold">{inc.district}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>LINKED VEHICLES:</span>
                  <span className="text-cyan-400 font-bold">
                    {inc.relatedVehiclePlates.join(', ') || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>CORRELATED CAMERAS:</span>
                  <span className="text-purple-300 font-bold">
                    {inc.relatedCameraIds.length} Nodes
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>{inc.timestamp}</span>
                <span className="text-cyan-400">View Dossier →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Incident Dossier Modal */}
      {selectedIncident && (
        <Modal
          isOpen={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
          title={`INCIDENT DOSSIER: ${selectedIncident.incidentNumber}`}
          subtitle={`${selectedIncident.title} • ${selectedIncident.district}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant={selectedIncident.severity === 'CRITICAL' ? 'danger' : 'warning'}
                  size="md"
                >
                  {selectedIncident.severity}
                </Badge>
                <span className="text-slate-400">{selectedIncident.timestamp}</span>
              </div>
              <p className="text-slate-300 leading-relaxed">{selectedIncident.summary}</p>
            </div>

            {/* Linked Cameras Matrix */}
            <div>
              <div className="text-slate-400 mb-2 font-bold uppercase">
                CORRELATED SURVEILLANCE NODES ({selectedIncident.relatedCameraIds.length}):
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedIncident.relatedCameraIds.map((camId) => (
                  <span
                    key={camId}
                    className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300 text-xs font-mono flex items-center gap-1.5"
                  >
                    <CameraIcon className="w-3.5 h-3.5 text-slate-400" />
                    {camId}
                  </span>
                ))}
              </div>
            </div>

            {/* Linked Target Plates */}
            {selectedIncident.relatedVehiclePlates.length > 0 && (
              <div>
                <div className="text-slate-400 mb-2 font-bold uppercase">
                  DETECTED VEHICLE PLATES:
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedIncident.relatedVehiclePlates.map((plate) => (
                    <button
                      key={plate}
                      onClick={() => {
                        if (onTrackPlate) onTrackPlate(plate);
                        setSelectedIncident(null);
                      }}
                      className="px-3 py-1.5 rounded bg-black border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-bold text-xs font-mono flex items-center gap-2 transition-colors"
                    >
                      <Car className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{plate} (Track Route →)</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Responder Dispatch Status */}
            {selectedIncident.responderDispatch && (
              <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-lg space-y-1">
                <div className="text-cyan-300 font-bold">FIELD UNIT DISPATCHED:</div>
                <div className="text-slate-300">
                  Unit: <strong>{selectedIncident.responderDispatch.unit}</strong> • ETA: {selectedIncident.responderDispatch.etaMinutes} mins
                </div>
                <div className="text-slate-400 text-[11px]">
                  Assigned Officer: {selectedIncident.responderDispatch.officer}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  onUpdateStatus(selectedIncident.id, 'RESOLVED');
                  setSelectedIncident(null);
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition-colors"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
