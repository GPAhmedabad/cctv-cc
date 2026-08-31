import React, { useState } from 'react';
import {
  Eye,
  Plus,
  Search,
  Trash2,
  Edit,
  ShieldAlert,
  Car,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
} from 'lucide-react';
import { WatchlistEntry, WatchlistCategory } from '../../types';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface WatchlistManagementViewProps {
  watchlists: WatchlistEntry[];
  onAddEntry: (entry: Partial<WatchlistEntry>) => void;
  onUpdateEntry: (id: string, entry: Partial<WatchlistEntry>) => void;
  onDeleteEntry: (id: string) => void;
}

export const WatchlistManagementView: React.FC<WatchlistManagementViewProps> = ({
  watchlists,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    plateNumber: '',
    category: 'STOLEN_VEHICLE' as WatchlistCategory,
    reason: '',
    caseNumber: '',
    sourceDepartment: 'Gujarat State Police',
    priority: 'CRITICAL' as const,
  });

  const filteredList = watchlists.filter((w) => {
    if (selectedCategory !== 'ALL' && w.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        w.plateNumber.toLowerCase().includes(q) ||
        w.reason.toLowerCase().includes(q) ||
        w.caseNumber?.toLowerCase().includes(q) ||
        w.sourceDepartment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEntry(formData);
    setIsAddModalOpen(false);
    setFormData({
      plateNumber: '',
      category: 'STOLEN_VEHICLE',
      reason: '',
      caseNumber: '',
      sourceDepartment: 'Gujarat State Police',
      priority: 'CRITICAL',
    });
  };

  const getCategoryBadgeVariant = (cat: WatchlistCategory) => {
    switch (cat) {
      case 'WANTED_CRIMINAL':
      case 'STOLEN_VEHICLE':
        return 'danger';
      case 'SUSPICIOUS_CONVOY':
      case 'EXPIRED_PERMIT':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div id="watchlist-management-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              HOTLIST & WATCHLIST MANAGEMENT
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Active state hotlist triggers instantly matched against incoming CCTV ANPR streams
          </p>
        </div>

        <button
          id="open-add-watchlist-modal-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-900/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target to Watchlist</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by plate number, FIR case number, reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Watchlist Categories</option>
          <option value="STOLEN_VEHICLE">Stolen Vehicle</option>
          <option value="WANTED_CRIMINAL">Wanted Criminal</option>
          <option value="SUSPICIOUS_CONVOY">Suspicious Convoy</option>
          <option value="EXPIRED_PERMIT">Expired Permit</option>
          <option value="VIP_CONVOY">VIP Convoy Track</option>
        </select>
      </div>

      {/* Watchlist Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredList.map((entry) => (
          <div
            key={entry.id}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-mono font-bold text-white tracking-wider bg-black px-2 py-0.5 rounded border border-slate-700 inline-block">
                  {entry.plateNumber}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  CASE: {entry.caseNumber || 'N/A'}
                </div>
              </div>

              <div className="space-y-1 text-right">
                <Badge variant={getCategoryBadgeVariant(entry.category)} size="sm">
                  {entry.category.replace('_', ' ')}
                </Badge>
                <div className="text-[10px] font-mono text-rose-400 font-bold">
                  {entry.priority} PRIORITY
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-mono bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
              {entry.reason}
            </p>

            <div className="text-[11px] font-mono text-slate-400 space-y-1">
              <div className="flex items-center justify-between">
                <span>AUTHORITY:</span>
                <span className="text-slate-200">{entry.sourceDepartment}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>TOTAL HITS:</span>
                <span className="text-cyan-400 font-bold">{entry.hitCount} Sightings</span>
              </div>
              {entry.lastHitTimestamp && (
                <div className="flex items-center justify-between">
                  <span>LAST SEEN:</span>
                  <span className="text-amber-300">{entry.lastHitTimestamp}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                Active since {entry.createdAt.split(' ')[0]}
              </span>
              <button
                id={`delete-watchlist-${entry.id}`}
                onClick={() => onDeleteEntry(entry.id)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                title="Remove from watchlist"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="ADD TARGET TO STATE WATCHLIST"
        subtitle="Immediate broadcast across all federated ANPR edge nodes"
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-1">LICENSE PLATE NUMBER</label>
            <input
              type="text"
              required
              placeholder="e.g. GJ01XY9999"
              value={formData.plateNumber}
              onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-100 uppercase font-bold focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">CATEGORY</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as WatchlistCategory })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="STOLEN_VEHICLE">Stolen Vehicle</option>
                <option value="WANTED_CRIMINAL">Wanted Criminal</option>
                <option value="SUSPICIOUS_CONVOY">Suspicious Convoy</option>
                <option value="EXPIRED_PERMIT">Expired Permit</option>
                <option value="VIP_CONVOY">VIP Convoy</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">ALERT PRIORITY</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="CRITICAL">Critical (Immediate Dispatch)</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">FIR / CASE REFERENCE NUMBER</label>
            <input
              type="text"
              placeholder="e.g. FIR-2025-AMD-094"
              value={formData.caseNumber}
              onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">INTELLIGENCE BRIEF / REASON</label>
            <textarea
              rows={3}
              required
              placeholder="Provide reason for hotlist monitoring..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded"
            >
              Activate Watchlist Rule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
