import React, { useState } from 'react';
import {
  BellRing,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  MapPin,
  Camera as CameraIcon,
  ChevronRight,
  TrendingUp,
  FolderPlus,
  Filter,
  Sparkles,
  Info,
  Car,
} from 'lucide-react';
import { ExplainableAlert, AlertSeverity, AlertStatus } from '../../types';
import { Badge } from '../common/Badge';
import { TacticalCard } from '../common/TacticalCard';
import { Modal } from '../common/Modal';

interface ExplainableAlertsViewProps {
  alerts: ExplainableAlert[];
  onAcknowledgeAlert: (id: string, operatorNotes?: string) => void;
  onDismissAlert: (id: string, reason?: string) => void;
  onEscalateToInvestigation: (alert: ExplainableAlert) => void;
  onTrackPlate?: (plate: string) => void;
}

export const ExplainableAlertsView: React.FC<ExplainableAlertsViewProps> = ({
  alerts,
  onAcknowledgeAlert,
  onDismissAlert,
  onEscalateToInvestigation,
  onTrackPlate,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [activeAlertDetail, setActiveAlertDetail] = useState<ExplainableAlert | null>(null);
  const [operatorNotes, setOperatorNotes] = useState('');

  const filteredAlerts = alerts.filter((a) => {
    if (selectedSeverity !== 'ALL' && a.severity !== selectedSeverity) return false;
    if (selectedStatus !== 'ALL' && a.status !== selectedStatus) return false;
    return true;
  });

  const handleAcknowledge = (id: string) => {
    onAcknowledgeAlert(id, operatorNotes || 'Acknowledged in Command Centre');
    setActiveAlertDetail(null);
    setOperatorNotes('');
  };

  const handleDismiss = (id: string) => {
    onDismissAlert(id, operatorNotes || 'Dismissed as false positive');
    setActiveAlertDetail(null);
    setOperatorNotes('');
  };

  const handleEscalate = (alert: ExplainableAlert) => {
    onEscalateToInvestigation(alert);
    setActiveAlertDetail(null);
  };

  return (
    <div id="explainable-alerts-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-6 h-6 text-rose-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              EXPLAINABLE MULTI-FACTOR ALERT MATRIX
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            "NO BLACK-BOX ALARMS" — Every alert presents transparent breakdown weights and decision-support reasoning
          </p>
        </div>

        {/* Severity Legend */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="danger" size="sm">
            {alerts.filter((a) => a.severity === 'CRITICAL').length} CRITICAL
          </Badge>
          <Badge variant="warning" size="sm">
            {alerts.filter((a) => a.severity === 'HIGH').length} HIGH
          </Badge>
          <Badge variant="info" size="sm">
            {alerts.filter((a) => a.severity === 'MEDIUM').length} MEDIUM
          </Badge>
        </div>
      </div>

      {/* Filter and Status Toggles */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">SEVERITY:</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedSeverity === sev
                  ? 'bg-slate-800 text-white font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">STATUS:</span>
          {(['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'CRITICAL';
          const isHigh = alert.severity === 'HIGH';

          return (
            <div
              key={alert.id}
              onClick={() => setActiveAlertDetail(alert)}
              className={`p-4 rounded-xl border bg-slate-900/90 backdrop-blur-md hover:scale-[1.01] transition-all cursor-pointer space-y-3 shadow-xl group ${
                isCritical
                  ? 'border-rose-500/40 hover:border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                  : isHigh
                  ? 'border-amber-500/40 hover:border-amber-400'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isCritical ? 'danger' : isHigh ? 'warning' : 'info'}
                      size="sm"
                    >
                      {alert.severity}
                    </Badge>
                    <span className="font-mono text-xs text-slate-400 font-semibold">
                      {alert.id}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {alert.title}
                  </h3>
                </div>

                <div className="text-right font-mono flex-shrink-0">
                  <div className="text-[10px] text-slate-500">EXPLAINABILITY</div>
                  <div className="text-sm font-bold text-emerald-400">
                    {alert.overallScore}/100
                  </div>
                </div>
              </div>

              {/* Location & Time Sub-bar */}
              <div className="text-xs font-mono text-slate-400 space-y-1 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{alert.locationName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <CameraIcon className="w-3 h-3" />
                    {alert.cameraId}
                  </span>
                  <span>{alert.timestamp.split(' ')[1]} IST</span>
                </div>
              </div>

              {/* Explainable Factor Weights (The USP) */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Factor Breakdown:
                </div>
                <div className="space-y-1">
                  {alert.factors.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded bg-slate-950/80 border border-slate-800 text-[11px] font-mono flex items-center justify-between"
                    >
                      <span className="text-slate-300 truncate max-w-[210px]">
                        ✓ {f.factor}
                      </span>
                      <span className="text-cyan-300 font-bold flex-shrink-0">
                        +{f.score} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Plate & Action Footer */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                {alert.relatedVehiclePlate ? (
                  <span className="text-slate-300">
                    Target: <strong className="text-cyan-400">{alert.relatedVehiclePlate}</strong>
                  </span>
                ) : (
                  <span className="text-slate-500">Spatial Anomaly</span>
                )}

                <span className="text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Inspect <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert Inspection & Decision Support Modal */}
      {activeAlertDetail && (
        <Modal
          isOpen={!!activeAlertDetail}
          onClose={() => setActiveAlertDetail(null)}
          title={`EXPLAINABLE ALERT DOSSIER: ${activeAlertDetail.id}`}
          subtitle={`${activeAlertDetail.title} • ${activeAlertDetail.locationName}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 font-mono text-xs">
            {/* Top Severity Score Bar */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    activeAlertDetail.severity === 'CRITICAL'
                      ? 'danger'
                      : activeAlertDetail.severity === 'HIGH'
                      ? 'warning'
                      : 'info'
                  }
                  size="md"
                >
                  {activeAlertDetail.severity}
                </Badge>
                <span className="text-slate-300">{activeAlertDetail.timestamp}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px]">COMPOSITE THREAT SCORE</span>
                <div className="text-xl font-bold text-emerald-400">
                  {activeAlertDetail.overallScore} / 100
                </div>
              </div>
            </div>

            {/* Factor Breakdown Detailed List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase">
                SCORING MATRIX & EXPLAINABLE EVIDENCE FACTORS
              </div>
              <div className="space-y-2">
                {activeAlertDetail.factors.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-200 font-bold">
                      <span>{f.factor}</span>
                      <span className="text-cyan-400">+{f.score} pts (Weight: {f.weight}x)</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {f.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Operator Notes Input */}
            <div>
              <label className="block text-slate-400 mb-1">
                OPERATOR LOG ENTRY / DISPATCH NOTES
              </label>
              <textarea
                rows={2}
                placeholder="Enter tactical response notes..."
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Decision Actions Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                {activeAlertDetail.relatedVehiclePlate && onTrackPlate && (
                  <button
                    onClick={() => {
                      onTrackPlate(activeAlertDetail.relatedVehiclePlate!);
                      setActiveAlertDetail(null);
                    }}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 flex items-center gap-1.5"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Track Plate</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDismiss(activeAlertDetail.id)}
                  className="px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded hover:bg-rose-500/30"
                >
                  Dismiss False Alarm
                </button>
                <button
                  onClick={() => handleAcknowledge(activeAlertDetail.id)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => handleEscalate(activeAlertDetail)}
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded flex items-center gap-1.5"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Escalate to Case Dossier</span>
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
