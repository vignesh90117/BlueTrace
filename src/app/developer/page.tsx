'use client';

import React from 'react';
import Link from 'next/link';
import { store } from '@/lib/store/registryStore';
import { useRole } from '@/components/RoleContext';
import { RoleGuard } from '@/components/RoleGuard';
import { 
  TreePine, 
  PlusCircle, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Coins, 
  MapPin,
  AlertCircle,
  XCircle
} from 'lucide-react';

export default function DeveloperDashboardPage() {
  const { walletAddress, userName } = useRole();
  const projects = store.getProjects();

  const totalArea = projects.reduce((acc, p) => acc + p.areaHectares, 0);
  const totalIssued = projects.reduce((acc, p) => acc + p.totalCreditsIssued, 0);

  return (
    <RoleGuard 
      allowedRoles={['developer']} 
      workspaceName="Project Owner / Developer Workspace" 
      requiredRoleLabel="Project Owner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 sm:p-10 rounded-3xl glass-panel border border-emerald-500/20 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <TreePine className="w-3.5 h-3.5" /> Project Owner Dashboard
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Coastal Restoration Projects Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your coastal wetland plots, upload drone LiDAR/soil telemetry, edit spatial boundaries, and track credit issuance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/developer/projects/new"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Register New Project</span>
            </Link>
          </div>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl glass-panel">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Active Managed Plots</span>
            <div className="text-3xl font-black font-mono text-white">{projects.length} Plots</div>
            <span className="text-[11px] text-teal-400 font-mono mt-1 block">{totalArea} Hectares Protected</span>
          </div>

          <div className="p-6 rounded-3xl glass-panel">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Verified Credits Minted</span>
            <div className="text-3xl font-black font-mono text-emerald-400">
              {totalIssued.toLocaleString()}{' '}
              <span className="text-sm font-bold text-emerald-400">BCT</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">1 BCT = 1 tCO2e</span>
          </div>

          <div className="p-6 rounded-3xl glass-panel">
            <span className="text-xs text-slate-400 block mb-1 font-medium">3-Stage Pipeline Status</span>
            <div className="text-3xl font-black font-mono text-sky-400">
              {projects.filter(p => p.status === 'credits_issued').length}/{projects.length}
            </div>
            <span className="text-[11px] text-sky-400 font-mono mt-1 block">Fully Minted on Polygon</span>
          </div>
        </div>

        {/* Project Pipeline List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Your Registered Projects
            </h2>
            <span className="text-xs text-slate-400 font-mono">{projects.length} Total</span>
          </div>

          <div className="space-y-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-3xl glass-panel glass-panel-hover flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all group"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950/60 text-teal-400 border border-teal-800/40">
                      {proj.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                      {proj.ecosystemType}
                    </span>
                    {proj.status === 'credits_issued' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Stage 3: Credits Issued
                      </span>
                    ) : proj.status === 'field_approved' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Stage 2: Field Approved
                      </span>
                    ) : proj.status === 'rejected' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Corrections Requested
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3" /> Stage 2: In Field Review
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                    {proj.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {proj.region}, {proj.country}
                    </span>
                    <span>Area: <strong className="text-slate-200">{proj.areaHectares} ha</strong></span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-right">
                    <span className="text-slate-500 block text-[10px]">Issued Credits:</span>
                    <span className="text-emerald-400 font-bold text-base">{proj.totalCreditsIssued.toLocaleString()} BCT</span>
                  </div>

                  <Link
                    href={`/developer/projects/${proj.id}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-teal-500 text-slate-300 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>Manage & Ingest Telemetry</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </RoleGuard>
  );
}
