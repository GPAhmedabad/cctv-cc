import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  Lock,
  CheckCircle2,
  ShieldCheck,
  Clock,
  User,
  Filter,
} from 'lucide-react';
import { AuditLog } from '../../types';
import { Badge } from '../common/Badge';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter((log) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.userName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div id="audit-logs-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-emerald-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              IMMUTABLE AUDIT TRAIL & ACCESS COMPLIANCE
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Every query, live feed access, export, and watchlist mutation is cryptographically signed and sealed
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>CHAIN VERIFIED (SHA-256)</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-3 font-mono text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit logs by User, Action, IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="text-slate-400 text-xs font-mono">
          Showing {filteredLogs.length} verified log entries
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Timestamp (IST)</th>
                <th className="p-3.5">Operator & Role</th>
                <th className="p-3.5">Action Executed</th>
                <th className="p-3.5">Target Entity / Details</th>
                <th className="p-3.5">Client IP Address</th>
                <th className="p-3.5 text-right">Integrity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3.5">
                    <div className="text-white font-bold">{log.userName}</div>
                    <div className="text-[10px] text-slate-400">{log.role}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-200">
                    <div>{log.details}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Target: {log.targetEntityId}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-400 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="p-3.5 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Sealed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
