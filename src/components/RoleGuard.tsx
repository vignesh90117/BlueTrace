'use client';

import React from 'react';
import { useRole } from '@/components/RoleContext';
import { UserRole } from '@/types';
import { ShieldAlert, ArrowRight, Lock, KeyRound } from 'lucide-react';
import Link from 'next/link';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  workspaceName: string;
  requiredRoleLabel: string;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  workspaceName,
  requiredRoleLabel,
  children,
}) => {
  const { role, setRole } = useRole();

  if (role === 'admin' || allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-500/10">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
          Role-Separated Workspace Access
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {workspaceName}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          You are currently in <strong className="text-teal-300 capitalize">{role.replace('_', ' ')}</strong> mode. This dedicated workspace is isolated for <strong className="text-amber-400">{requiredRoleLabel}</strong>.
        </p>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setRole(allowedRoles[0])}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all hover:scale-105"
        >
          <KeyRound className="w-4 h-4" />
          <span>Switch to {requiredRoleLabel} Persona</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <Link
          href="/"
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          Return to Overview
        </Link>
      </div>
    </div>
  );
};
