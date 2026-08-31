import React, { useState } from 'react';
import {
  Database,
  Upload,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface DataIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestDataset: (data: any) => void;
}

export const DataIngestionModal: React.FC<DataIngestionModalProps> = ({
  isOpen,
  onClose,
  onIngestDataset,
}) => {
  const [activeTab, setActiveTab] = useState<'TEMPLATE' | 'CUSTOM_CSV'>('TEMPLATE');
  const [csvContent, setCsvContent] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const sampleDatasets = [
    {
      id: 'gujarat_hackathon_sample',
      name: 'Gujarat ICCC CCTV & ANPR Master Dataset',
      count: '42,850 nodes',
      description: 'Comprehensive Ahmedabad, Gandhinagar, Surat, Vadodara, and Highway corridors',
    },
    {
      id: 'sg_highway_focused',
      name: 'SG Highway High-Speed Corridor Subset',
      count: '1,420 nodes',
      description: 'Dedicated ANPR and PTZ nodes across Sarkhej to Gandhinagar axis',
    },
    {
      id: 'surat_dream_city',
      name: 'Surat DREAM City Smart Surveillance Grid',
      count: '960 nodes',
      description: 'Perimeter and toll checkpoint nodes for Surat diamond hub',
    },
  ];

  const handleApplyTemplate = (id: string) => {
    onIngestDataset({ template: id });
    setSuccessMsg(`Dataset '${id}' successfully bound to Sentinel-X Ingestion Pipeline.`);
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1500);
  };

  const handleCustomUpload = () => {
    if (!csvContent.trim()) return;
    onIngestDataset({ rawCsv: csvContent });
    setSuccessMsg('Custom CSV dataset normalized and loaded into memory.');
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="GOVERNMENT & CUSTOM DATA INGESTION SUITE"
      subtitle="Load real government CSVs, custom hackathon testbeds, or state reference datasets"
      maxWidth="2xl"
    >
      <div className="space-y-4 font-mono text-xs">
        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('TEMPLATE')}
            className={`flex-1 py-1.5 rounded transition-colors text-center ${
              activeTab === 'TEMPLATE'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Preloaded Gujarat Datasets
          </button>
          <button
            onClick={() => setActiveTab('CUSTOM_CSV')}
            className={`flex-1 py-1.5 rounded transition-colors text-center ${
              activeTab === 'CUSTOM_CSV'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Paste Custom CSV / JSON
          </button>
        </div>

        {activeTab === 'TEMPLATE' ? (
          <div className="space-y-3">
            {sampleDatasets.map((ds) => (
              <div
                key={ds.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{ds.name}</span>
                    <Badge variant="info" size="sm">
                      {ds.count}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-snug">
                    {ds.description}
                  </p>
                </div>

                <button
                  onClick={() => handleApplyTemplate(ds.id)}
                  className="px-3.5 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors flex-shrink-0"
                >
                  Load Dataset
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-slate-400">
              Paste your CSV data below (Headers: <code>id, name, department, locationName, lat, lng, vendor, cameraType</code>):
            </p>
            <textarea
              rows={8}
              placeholder="id,name,department,locationName,lat,lng,vendor,cameraType..."
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 text-[11px]"
            />
            <div className="flex justify-end">
              <button
                onClick={handleCustomUpload}
                disabled={!csvContent.trim()}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded transition-colors disabled:opacity-50"
              >
                Ingest & Validate CSV
              </button>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>
    </Modal>
  );
};
