import React from 'react';
import {
  Users,
  Shield,
  UserCheck,
  Building,
  Key,
  CheckCircle2,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { Badge } from '../common/Badge';

interface UsersManagementViewProps {
  currentUser: User;
  onSwitchRole?: (role: UserRole) => void;
}

export const UsersManagementView: React.FC<UsersManagementViewProps> = ({
  currentUser,
  onSwitchRole,
}) => {
  const usersList: User[] = [
    {
      id: 'usr-001',
      name: 'Dr. D. G. Vaghela, IPS',
      badgeNumber: 'GJ-IPS-1092',
      department: 'State Directorate of Police Operations',
      role: UserRole.STATE_ADMIN,
      jurisdiction: 'State of Gujarat (All 33 Districts)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-002',
      name: 'Inspector R. K. Patel',
      badgeNumber: 'CID-CRIME-402',
      department: 'Gujarat CID Crime Branch',
      role: UserRole.INVESTIGATOR,
      jurisdiction: 'Ahmedabad & Gandhinagar Range',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-003',
      name: 'S. K. Desai',
      badgeNumber: 'ICCC-AMD-088',
      department: 'Ahmedabad Smart City ICCC',
      role: UserRole.OPERATOR,
      jurisdiction: 'AMC Urban Municipal Area',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    },
    {
      id: 'usr-004',
      name: 'Advocate Meera Trivedi',
      badgeNumber: 'BAR-GJ-8821',
      department: 'Judicial Oversight & DPDP Compliance Cell',
      role: UserRole.AUDITOR,
      jurisdiction: 'Statewide Audit & Forensic Review',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div id="users-management-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              PERSONNEL ROSTER & FEDERATED IDENTITY MANAGEMENT
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Departmental credential mapping, multi-agency access levels, and active operator sessions
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Badge variant="info">4 FEDERATED AGENCIES</Badge>
        </div>
      </div>

      {/* Role Switcher Demo Bar */}
      {onSwitchRole && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 font-mono text-xs">
          <div className="text-slate-400 font-bold uppercase">
            HACKATHON EVALUATION ROLE SWITCHER:
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.values(UserRole).map((role) => (
              <button
                key={role}
                onClick={() => onSwitchRole(role)}
                className={`px-3.5 py-1.5 rounded transition-colors ${
                  currentUser.role === role
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                Switch to {role}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {usersList.map((user) => {
          const isCurrent = currentUser.id === user.id || currentUser.role === user.role;

          return (
            <div
              key={user.id}
              className={`p-5 rounded-xl border space-y-3 ${
                isCurrent
                  ? 'bg-slate-900 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{user.name}</div>
                    <div className="text-slate-400 text-[11px]">Badge: {user.badgeNumber}</div>
                  </div>
                </div>

                <Badge variant={user.role === UserRole.STATE_ADMIN ? 'purple' : 'info'} size="sm">
                  {user.role}
                </Badge>
              </div>

              <div className="space-y-1 text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">DEPARTMENT:</span>
                  <span className="text-slate-200">{user.department}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">JURISDICTION:</span>
                  <span className="text-cyan-400">{user.jurisdiction}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
