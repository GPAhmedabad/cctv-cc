import React, { useState } from 'react';
import {
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Layers,
  Printer,
  Shield,
  Share2,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';

interface AutomatedReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AutomatedReportsModal: React.FC<AutomatedReportsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [reportType, setReportType] = useState<string>('STATEWIDE_EXECUTIVE');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedPdf('SENTINEL-X_Statewide_CCTV_Intelligence_Report_2025.pdf');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AUTOMATED INTELLIGENCE REPORTS & COURT DOSSIERS"
      subtitle="Generate tamper-sealed executive summaries and court-admissible forensic packages"
      maxWidth="2xl"
    >
      <div className="space-y-4 font-mono text-xs">
        <div className="space-y-2">
          <label className="block text-slate-400 font-bold uppercase">
            SELECT REPORT TEMPLATE:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'STATEWIDE_EXECUTIVE',
                title: 'Statewide Executive Briefing',
                desc: 'High-level KPIs, multi-district ANPR volumes, uptime SLA',
              },
              {
                id: 'COURT_EVIDENCE_DOSSIER',
                title: 'Court Evidence Dossier',
                desc: 'Case trajectory with SHA-256 hashes and timestamp chain',
              },
              {
                id: 'CORRIDOR_SECURITY_AUDIT',
                title: 'Corridor Security Audit',
                desc: 'SG Highway & Expressway blind-spot analysis and coverage %',
              },
              {
                id: 'VMS_FEDERATION_HEALTH',
                title: 'VMS Federation Health Audit',
                desc: 'Milestone, Genetec, Dahua, HikCentral adapter uptime & latency',
              },
            ].map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => setReportType(tmpl.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-colors space-y-1 ${
                  reportType === tmpl.id
                    ? 'bg-cyan-500/20 border-cyan-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-slate-200">{tmpl.title}</div>
                <p className="text-[10px] text-slate-400 leading-snug">{tmpl.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Export includes digital signature of Gujarat State Police ICCC
          </span>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isGenerating ? 'animate-bounce' : ''}`} />
            <span>{isGenerating ? 'Compiling Dossier...' : 'Generate & Export Report'}</span>
          </button>
        </div>

        {generatedPdf && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Report Compiled Successfully: {generatedPdf}</span>
            </div>
            <p className="text-[11px] text-slate-300">
              SHA-256 Sealed: <code>8f4c2b9a78e12d45c678...4b92</code> • Ready for judicial submission.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
