import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { TacticalCard } from '../common/TacticalCard';
import { Badge } from '../common/Badge';

export const RbacAndPrivacyView: React.FC = () => {
  const [privacyBlurring, setPrivacyBlurring] = useState(true);
  const [retentionDays, setRetentionDays] = useState(90);

  const rolesMatrix = [
    {
      role: 'STATE_ADMIN',
      title: 'State Director / Admin',
      users: 3,
      access: 'Full Statewide Access, Hotlist Override, Evidence Sealing, VMS Configuration',
      privacyBypass: 'Authorized with Judicial / Senior Warrant only',
    },
    {
      role: 'INVESTIGATOR',
      title: 'CID / Crime Branch Officer',
      users: 28,
      access: 'Case Dossiers, Trajectory Replay, Evidence Export, Hotlist Query',
      privacyBypass: 'Authorized under Active FIR reference',
    },
    {
      role: 'OPERATOR',
      title: 'ICCC Control Room Operator',
      users: 145,
      access: 'Live CCTV Viewer, Alert Acknowledgment, Sighting Validation, PTZ Controls',
      privacyBypass: 'Strictly Masked / Redacted View',
    },
    {
      role: 'AUDITOR',
      title: 'Judicial / Compliance Auditor',
      users: 6,
      access: 'Immutable Audit Log Inspection, Access Traceability, Export Verification',
      privacyBypass: 'Read-only Audit Streams',
    },
  ];

  return (
    <div id="rbac-privacy-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              RBAC GOVERNANCE & PRIVACY COMPLIANCE MATRIX
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Zero-Trust access control, cryptographic audit logging, and automated DPDP Act privacy redaction
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="success">DPDP ACT 2023 COMPLIANT</Badge>
        </div>
      </div>

      {/* Privacy Redaction Policy Card */}
      <TacticalCard
        title="Automated Privacy Protection & Dynamic Redaction Engine"
        subtitle="Ensuring compliance with Indian Digital Personal Data Protection (DPDP) Act 2023"
        glow="cyan"
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              {privacyBlurring ? (
                <EyeOff className="w-5 h-5 text-emerald-400" />
              ) : (
                <Eye className="w-5 h-5 text-amber-400" />
              )}
              <div>
                <div className="font-bold text-white">
                  AUTOMATIC NON-TARGET FACE & VEHICLE BLURRING
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Mask bystanders and non-hotlisted license plates in live monitoring feeds
                </div>
              </div>
            </div>

            <button
              onClick={() => setPrivacyBlurring(!privacyBlurring)}
              className={`px-4 py-1.5 rounded font-bold transition-colors ${
                privacyBlurring
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-amber-600 text-white hover:bg-amber-500'
              }`}
            >
              {privacyBlurring ? 'PRIVACY MASKING ACTIVE' : 'MASKING DISABLED (OVERRIDE)'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-slate-500 text-[10px]">VIDEO RETENTION POLICY</div>
              <div className="text-white font-bold mt-0.5">{retentionDays} Days Maximum</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Auto-purge unless tagged in active FIR
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-slate-500 text-[10px]">EVIDENCE INTEGRITY</div>
              <div className="text-emerald-400 font-bold mt-0.5">SHA-256 Sealed</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Court admissible cryptographic seal
              </div>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="text-slate-500 text-[10px]">ACCESS LOGGING</div>
              <div className="text-cyan-400 font-bold mt-0.5">100% Immutable</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Every query permanently audited
              </div>
            </div>
          </div>
        </div>
      </TacticalCard>

      {/* Role-Based Access Matrix Table */}
      <TacticalCard
        title="Federated Role-Based Access Control (RBAC) Hierarchy"
        subtitle="Strict least-privilege role definitions across State Agencies"
      >
        <div className="space-y-3 font-mono text-xs">
          {rolesMatrix.map((item) => (
            <div
              key={item.role}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <Badge variant="purple" size="sm">
                    {item.role}
                  </Badge>
                  <span className="font-bold text-white text-sm">{item.title}</span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  Active Personnel: <strong className="text-cyan-400">{item.users}</strong>
                </span>
              </div>

              <div className="text-slate-300 text-xs">
                <strong>Granted Permissions:</strong> {item.access}
              </div>

              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                <strong>Privacy Policy:</strong> {item.privacyBypass}
              </div>
            </div>
          ))}
        </div>
      </TacticalCard>
    </div>
  );
};
