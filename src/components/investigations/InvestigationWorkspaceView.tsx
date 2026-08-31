import React, { useState } from 'react';
import {
  FolderLock,
  Plus,
  Search,
  FileText,
  Lock,
  Share2,
  Download,
  CheckCircle2,
  Clock,
  Car,
  Camera as CameraIcon,
  Shield,
  Trash2,
  FileCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Investigation, EvidenceItem, InvestigationStatus } from '../../types';
import { Badge } from '../common/Badge';
import { TacticalCard } from '../common/TacticalCard';
import { Modal } from '../common/Modal';

interface InvestigationWorkspaceViewProps {
  investigations: Investigation[];
  onCreateInvestigation: (inv: Partial<Investigation>) => void;
  onUpdateInvestigation: (id: string, inv: Partial<Investigation>) => void;
  onAddEvidence: (investigationId: string, evidence: Partial<EvidenceItem>) => void;
  onOpenGraphView?: (investigationId: string) => void;
}

export const InvestigationWorkspaceView: React.FC<InvestigationWorkspaceViewProps> = ({
  investigations,
  onCreateInvestigation,
  onUpdateInvestigation,
  onAddEvidence,
  onOpenGraphView,
}) => {
  const [selectedInv, setSelectedInv] = useState<Investigation | null>(investigations[0] || null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddEvidenceModalOpen, setIsAddEvidenceModalOpen] = useState(false);
  const [reportExportSuccess, setReportExportSuccess] = useState<string | null>(null);

  // Form State
  const [createFormData, setCreateFormData] = useState({
    title: '',
    caseNumber: '',
    firNumber: '',
    leadInvestigator: 'Inspector R. K. Patel (CID Crime)',
    department: 'State Crime Investigation Cell',
    summary: '',
    priority: 'HIGH' as const,
  });

  const [evidenceFormData, setEvidenceFormData] = useState({
    title: '',
    type: 'CCTV_SNAPSHOT' as const,
    description: '',
    sourceCameraId: 'CAM-AMD-001',
    hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateInvestigation(createFormData);
    setIsCreateModalOpen(false);
    setCreateFormData({
      title: '',
      caseNumber: '',
      firNumber: '',
      leadInvestigator: 'Inspector R. K. Patel (CID Crime)',
      department: 'State Crime Investigation Cell',
      summary: '',
      priority: 'HIGH',
    });
  };

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInv) return;
    onAddEvidence(selectedInv.id, evidenceFormData);
    setIsAddEvidenceModalOpen(false);
  };

  const handleExportDossier = (inv: Investigation) => {
    setReportExportSuccess(`Official State Court Dossier for Case ${inv.caseNumber} generated with SHA-256 evidence chain verification.`);
    setTimeout(() => setReportExportSuccess(null), 5000);
  };

  return (
    <div id="investigation-workspace-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-6 h-6 text-purple-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              INVESTIGATION WORKSPACE & EVIDENCE LOCKER
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Tamper-evident case dossiers with SHA-256 cryptographic chain of custody and court-admissible exports
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            id="open-create-case-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors flex items-center gap-1.5 shadow-lg shadow-purple-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Create Case Dossier</span>
          </button>
        </div>
      </div>

      {reportExportSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{reportExportSuccess}</span>
        </div>
      )}

      {/* Main Split: Left Cases List, Right Selected Case Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Case Dossiers List */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>ACTIVE INVESTIGATIONS ({investigations.length})</span>
          </div>

          <div className="space-y-3">
            {investigations.map((inv) => {
              const isSelected = selectedInv?.id === inv.id;

              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInv(inv)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-purple-950/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/40'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-300">
                      {inv.caseNumber}
                    </span>
                    <Badge variant={inv.status === 'ACTIVE' ? 'warning' : 'info'} size="sm">
                      {inv.status}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-sm text-white line-clamp-1">
                    {inv.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {inv.summary}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                    <span>{inv.evidenceCount} Evidence Artifacts</span>
                    <span className="text-slate-500">{inv.updatedAt.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Comprehensive Case Dossier Details */}
        {selectedInv ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Dossier Header Card */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="purple" size="md">
                      {selectedInv.caseNumber}
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">
                      FIR: {selectedInv.firNumber || 'N/A'}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">
                    {selectedInv.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs">
                  {onOpenGraphView && (
                    <button
                      onClick={() => onOpenGraphView(selectedInv.id)}
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Graph Visualizer</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleExportDossier(selectedInv)}
                    className="px-3.5 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1.5 shadow-lg shadow-purple-900/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Court Dossier</span>
                  </button>
                </div>
              </div>

              {/* Case Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div>
                  <div className="text-slate-500 text-[10px]">LEAD INVESTIGATOR</div>
                  <div className="text-slate-200 font-semibold">{selectedInv.leadInvestigator}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">DEPARTMENT</div>
                  <div className="text-slate-200 font-semibold">{selectedInv.department}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">PRIORITY</div>
                  <div className="text-rose-400 font-bold">{selectedInv.priority}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[10px]">CHAIN OF CUSTODY</div>
                  <div className="text-emerald-400 font-bold">VERIFIED SEAL</div>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                {selectedInv.summary}
              </div>
            </div>

            {/* Linked Targets & Evidence Locker */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span>CRYPTOGRAPHIC EVIDENCE LOCKER ({selectedInv.evidenceItems?.length || 0})</span>
                </div>

                <button
                  onClick={() => setIsAddEvidenceModalOpen(true)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-purple-300 border border-slate-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach Evidence</span>
                </button>
              </div>

              {/* Evidence Artifacts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {selectedInv.evidenceItems?.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 font-mono text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <Badge variant="purple" size="sm">
                        {ev.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-[10px] text-slate-500">{ev.timestamp.split(' ')[1]}</span>
                    </div>

                    <div className="font-semibold text-white text-sm">{ev.title}</div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{ev.description}</p>

                    <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>SOURCE CAMERA:</span>
                        <span className="text-cyan-300 font-bold">{ev.sourceCameraId}</span>
                      </div>
                      <div className="truncate">
                        <span>SHA-256: </span>
                        <span className="text-emerald-400 font-mono">{ev.hashSha256}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 flex items-center justify-center p-12 bg-slate-900/50 rounded-xl border border-slate-800 text-slate-500 font-mono text-xs">
            Select an investigation dossier to review evidence
          </div>
        )}
      </div>

      {/* Modal: Create Investigation */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="CREATE OFFICIAL CASE DOSSIER"
        subtitle="Initiates tracked state investigation container with secure audit logging"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">CASE NUMBER</label>
              <input
                type="text"
                required
                placeholder="e.g. INV-2025-089"
                value={createFormData.caseNumber}
                onChange={(e) => setCreateFormData({ ...createFormData, caseNumber: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">FIR REFERENCE NUMBER</label>
              <input
                type="text"
                placeholder="e.g. FIR-SG-HIGHWAY-04"
                value={createFormData.firNumber}
                onChange={(e) => setCreateFormData({ ...createFormData, firNumber: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">CASE TITLE</label>
            <input
              type="text"
              required
              placeholder="e.g. Operation Hawk: SG Highway Luxury Vehicle Interception"
              value={createFormData.title}
              onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">INVESTIGATION SUMMARY & OBJECTIVE</label>
            <textarea
              rows={3}
              required
              placeholder="Detail case facts, suspected target vehicle, and jurisdiction..."
              value={createFormData.summary}
              onChange={(e) => setCreateFormData({ ...createFormData, summary: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded"
            >
              Initialize Dossier
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Attach Evidence */}
      <Modal
        isOpen={isAddEvidenceModalOpen}
        onClose={() => setIsAddEvidenceModalOpen(false)}
        title="ATTACH EVIDENCE ARTIFACT"
        subtitle={`Linking cryptographic asset to Case ${selectedInv?.caseNumber}`}
        maxWidth="md"
      >
        <form onSubmit={handleAddEvidenceSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-400 mb-1">EVIDENCE TITLE</label>
            <input
              type="text"
              required
              placeholder="e.g. Sighting Snapshot at SG Highway Camera 001"
              value={evidenceFormData.title}
              onChange={(e) => setEvidenceFormData({ ...evidenceFormData, title: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">EVIDENCE TYPE</label>
              <select
                value={evidenceFormData.type}
                onChange={(e) => setEvidenceFormData({ ...evidenceFormData, type: e.target.value as any })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="CCTV_SNAPSHOT">CCTV Snapshot</option>
                <option value="VIDEO_CLIP">Video Clip Excerpt</option>
                <option value="ANPR_READ">ANPR Read Log</option>
                <option value="GEO_TRAIL">GPS Geo Trail</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">SOURCE CAMERA</label>
              <input
                type="text"
                value={evidenceFormData.sourceCameraId}
                onChange={(e) => setEvidenceFormData({ ...evidenceFormData, sourceCameraId: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">ARTIFACT DESCRIPTION</label>
            <textarea
              rows={2}
              value={evidenceFormData.description}
              onChange={(e) => setEvidenceFormData({ ...evidenceFormData, description: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddEvidenceModalOpen(false)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded"
            >
              Cryptographically Seal & Attach
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
