import React, { useState } from 'react';
import {
  Car,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Camera as CameraIcon,
  ShieldAlert,
  SlidersHorizontal,
  Compass,
  FileCheck,
  Eye,
} from 'lucide-react';
import { VehicleDetection, VehicleType, Direction } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface VehicleIntelligenceViewProps {
  detections: VehicleDetection[];
  onSearch: (params: Record<string, string>) => void;
  onReviewDetection: (id: string, decision: 'CONFIRMED' | 'REJECTED', correctedPlate?: string) => void;
  onTrackPlate: (plate: string) => void;
}

export const VehicleIntelligenceView: React.FC<VehicleIntelligenceViewProps> = ({
  detections,
  onSearch,
  onReviewDetection,
  onTrackPlate,
}) => {
  const [plateQuery, setPlateQuery] = useState('');
  const [vehicleType, setVehicleType] = useState<string>('ALL');
  const [district, setDistrict] = useState<string>('ALL');
  const [minConfidence, setMinConfidence] = useState<number>(70);
  const [watchlistOnly, setWatchlistOnly] = useState<boolean>(false);

  // Review Modal State
  const [reviewItem, setReviewItem] = useState<VehicleDetection | null>(null);
  const [correctedPlate, setCorrectedPlate] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (plateQuery) params.query = plateQuery;
    if (vehicleType !== 'ALL') params.vehicleType = vehicleType;
    if (district !== 'ALL') params.district = district;
    if (minConfidence > 0) params.minConfidence = String(minConfidence);
    if (watchlistOnly) params.watchlistOnly = 'true';
    onSearch(params);
  };

  const handleOpenReview = (det: VehicleDetection) => {
    setReviewItem(det);
    setCorrectedPlate(det.plateNumber);
  };

  const handleConfirmReview = () => {
    if (reviewItem) {
      onReviewDetection(reviewItem.id, 'CONFIRMED', correctedPlate);
      setReviewItem(null);
    }
  };

  const handleRejectReview = () => {
    if (reviewItem) {
      onReviewDetection(reviewItem.id, 'REJECTED');
      setReviewItem(null);
    }
  };

  return (
    <div id="vehicle-intelligence-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Car className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              VEHICLE INTELLIGENCE & ANPR / OCR WORKSPACE
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated license plate recognition, wildcard query search, confidence scoring, and human review loop
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="info">DEMO ANPR ENGINE ACTIVE</Badge>
        </div>
      </div>

      {/* Advanced Search Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <form onSubmit={handleSearchSubmit} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* License Plate Search (Supports Wildcards) */}
            <div className="md:col-span-2">
              <label className="block text-slate-400 mb-1">
                PLATE NUMBER / WILDCARD (e.g. GJ01AB*, GJ01*1234)
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Enter full or partial plate..."
                  value={plateQuery}
                  onChange={(e) => setPlateQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 uppercase font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-slate-400 mb-1">VEHICLE CLASSIFIER</label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Vehicle Types</option>
                <option value="SUV">SUV</option>
                <option value="SEDAN">Sedan</option>
                <option value="HATCHBACK">Hatchback</option>
                <option value="TRUCK">Heavy Truck</option>
                <option value="BUS">Bus / Transit</option>
                <option value="TWO_WHEELER">Two-Wheeler</option>
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-slate-400 mb-1">DISTRICT / CORRIDOR</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">Statewide Gujarat</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Gandhinagar">Gandhinagar</option>
                <option value="Surat">Surat</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Rajkot">Rajkot</option>
              </select>
            </div>
          </div>

          {/* Sliders & Checkbox */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Min OCR Confidence:</span>
                <span className="text-cyan-400 font-bold">{minConfidence}%</span>
                <input
                  type="range"
                  min={50}
                  max={99}
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(parseInt(e.target.value))}
                  className="w-28 accent-cyan-500"
                />
              </div>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={watchlistOnly}
                  onChange={(e) => setWatchlistOnly(e.target.checked)}
                  className="accent-cyan-500"
                />
                <span>Watchlist Matches Only</span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setPlateQuery('GJ01AB1234');
                  onSearch({ query: 'GJ01AB1234' });
                }}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
              >
                Quick Target: GJ01AB1234
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors shadow-lg shadow-cyan-900/20"
              >
                Execute ANPR Query
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Detections Results Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>MATCHING SIGHTINGS: {detections.length} RECORDS FOUND</span>
          <span>Avg OCR Confidence: 96.4%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {detections.map((det) => {
            const isHighConf = det.confidence >= 85;
            const needsReview = det.requiresReview || det.confidence < 80;

            return (
              <div
                key={det.id}
                className={`rounded-xl border p-4 bg-slate-900/90 backdrop-blur-md transition-all space-y-3 ${
                  det.watchlistMatch
                    ? 'border-rose-500/50 bg-rose-950/10 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Plate Crop Simulation & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-white tracking-widest bg-black px-2.5 py-0.5 rounded border border-slate-700">
                        {det.plateNumber}
                      </span>
                      {det.watchlistMatch && (
                        <Badge variant="danger" size="sm">
                          WATCHLIST HIT
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      {det.makeModel}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-[10px] text-slate-400">CONFIDENCE</div>
                    <div
                      className={`text-sm font-bold ${
                        isHighConf ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {det.confidence}%
                    </div>
                  </div>
                </div>

                {/* Sighting Details */}
                <div className="space-y-1.5 text-xs font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{det.locationName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <CameraIcon className="w-3 h-3 text-slate-500" />
                      {det.cameraName}
                    </span>
                    <span>{det.timestamp.split(' ')[1]}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                    <span>
                      DIR: <strong>{det.direction}</strong> (Lane {det.lane})
                    </span>
                    {det.speedKmph && (
                      <span>
                        SPEED: <strong className="text-cyan-300">{det.speedKmph} km/h</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Prompt or Action Footer */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  {needsReview ? (
                    <button
                      id={`review-det-${det.id}`}
                      onClick={() => handleOpenReview(det)}
                      className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1 hover:bg-amber-500/30 transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Review OCR ({det.confidence}%)</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified Detection
                    </span>
                  )}

                  <button
                    id={`track-plate-${det.plateNumber}`}
                    onClick={() => onTrackPlate(det.plateNumber)}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-cyan-600 text-xs font-mono text-slate-200 hover:text-white transition-colors"
                  >
                    Track Journey →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Human Review Modal for AI Decision Support */}
      {reviewItem && (
        <Modal
          isOpen={!!reviewItem}
          onClose={() => setReviewItem(null)}
          title="HUMAN REVIEW & ANPR VALIDATION"
          subtitle="AI is decision support — operator confirmation required for low confidence triggers"
          maxWidth="md"
        >
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
              <div className="text-slate-400">DETECTED OCR STRING:</div>
              <div className="text-xl font-bold text-amber-400 tracking-wider">
                {reviewItem.plateNumber}
              </div>
              <div className="text-[11px] text-slate-500">
                Confidence: {reviewItem.confidence}% • Location: {reviewItem.locationName}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                CORRECTED PLATE NUMBER (IF MISREAD):
              </label>
              <input
                type="text"
                value={correctedPlate}
                onChange={(e) => setCorrectedPlate(e.target.value.toUpperCase())}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100 font-bold focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="p-2.5 bg-cyan-950/20 border border-cyan-500/20 rounded text-[11px] text-cyan-300">
              ℹ️ Your review decision will be permanently sealed into the immutable Audit Log.
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={handleRejectReview}
                className="px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded hover:bg-rose-500/30"
              >
                Reject False Positive
              </button>
              <button
                onClick={handleConfirmReview}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded"
              >
                Confirm & Seal
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
