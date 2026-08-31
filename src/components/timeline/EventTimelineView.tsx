import React, { useState } from 'react';
import {
  Clock,
  Car,
  BellRing,
  ShieldAlert,
  Activity,
  MapPin,
  Camera as CameraIcon,
  Filter,
  Search,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { ExplainableAlert, VehicleDetection, Camera } from '../../types';
import { Badge } from '../common/Badge';

interface EventTimelineViewProps {
  alerts: ExplainableAlert[];
  detections: VehicleDetection[];
  cameras: Camera[];
  onTrackPlate?: (plate: string) => void;
}

export const EventTimelineView: React.FC<EventTimelineViewProps> = ({
  alerts,
  detections,
  cameras,
  onTrackPlate,
}) => {
  const [eventType, setEventType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Unify events into chronological timeline
  const unifiedEvents = [
    ...alerts.map((a) => ({
      id: a.id,
      timestamp: a.timestamp,
      type: 'ALERT' as const,
      title: a.title,
      location: a.locationName,
      cameraId: a.cameraId,
      severity: a.severity,
      plate: a.relatedVehiclePlate,
      details: a.factors.map((f) => f.factor).join(' • '),
    })),
    ...detections.map((d) => ({
      id: d.id,
      timestamp: d.timestamp,
      type: 'ANPR_DETECTION' as const,
      title: `ANPR Read: ${d.plateNumber} (${d.makeModel})`,
      location: d.locationName,
      cameraId: d.cameraId,
      severity: d.watchlistMatch ? ('CRITICAL' as const) : ('INFO' as const),
      plate: d.plateNumber,
      details: `OCR Conf: ${d.confidence}% • Heading: ${d.direction} • Lane: ${d.lane}`,
    })),
  ].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  const filteredEvents = unifiedEvents.filter((evt) => {
    if (eventType !== 'ALL' && evt.type !== eventType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        evt.title.toLowerCase().includes(q) ||
        evt.location.toLowerCase().includes(q) ||
        evt.cameraId.toLowerCase().includes(q) ||
        (evt.plate && evt.plate.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div id="event-timeline-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              STATEWIDE UNIFIED EVENT CHRONOLOGY
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time merged event stream of ANPR reads, multi-factor alerts, and telemetry logs
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <Badge variant="info">
            {filteredEvents.length} MERGED EVENTS
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search events by Plate, Camera ID, Junction name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">TYPE:</span>
          {(['ALL', 'ALERT', 'ANPR_DETECTION'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setEventType(t)}
              className={`px-3 py-1.5 rounded transition-colors ${
                eventType === t
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {filteredEvents.map((evt) => {
            const isAlert = evt.type === 'ALERT';
            const isCrit = evt.severity === 'CRITICAL';

            return (
              <div key={evt.id} className="relative group font-mono text-xs">
                {/* Bullet */}
                <div
                  className={`absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                    isAlert
                      ? isCrit
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                      : 'bg-cyan-500'
                  }`}
                />

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 transition-all space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={isAlert ? (isCrit ? 'danger' : 'warning') : 'info'}
                        size="sm"
                      >
                        {evt.type.replace('_', ' ')}
                      </Badge>
                      <span className="font-bold text-white text-sm">
                        {evt.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{evt.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {evt.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <CameraIcon className="w-3 h-3 text-slate-500" />
                      {evt.cameraId}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800/60">
                    {evt.details}
                  </p>

                  {evt.plate && onTrackPlate && (
                    <div className="pt-1 flex items-center justify-end">
                      <button
                        onClick={() => onTrackPlate(evt.plate!)}
                        className="text-cyan-400 hover:text-cyan-300 text-[11px] flex items-center gap-1"
                      >
                        <Car className="w-3 h-3" />
                        <span>Track {evt.plate} →</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
