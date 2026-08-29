'use client';

import React from 'react';
import { Project } from '@/types';
import { 
  UserCheck, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Coins, 
  ArrowRight,
  FileCheck,
  Building,
  Navigation
} from 'lucide-react';
import Link from 'next/link';

interface ReviewStageTrackerProps {
  project: Project;
}

export const ReviewStageTracker: React.FC<ReviewStageTrackerProps> = ({ project }) => {
  // Determine active/completed state for the 3 stages
  const isStage1Done = Boolean(project.registeredDate && project.name);
  const isStage2Done = project.status === 'field_approved' || project.status === 'under_review' || project.status === 'credits_issued';
  const isStage2Active = project.status === 'field_review' || project.status === 'submitted';
  const isStage3Done = project.status === 'credits_issued';
  const isStage3Active = project.status === 'field_approved' || project.status === 'under_review';

  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-teal-500/30 shadow-2xl space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-850 pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-teal-400 uppercase tracking-widest block mb-0.5">
            Credit Approval Lifecycle (PDF Protocol Standard)
          </span>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <span>3-Stage Verification & Minting Workflow</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {project.status === 'credits_issued' ? (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-3.5 h-3.5" /> Stage 3/3 Complete • Credits Minted
            </span>
          ) : isStage3Active ? (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
              <Clock className="w-3.5 h-3.5" /> Stage 3: Awaiting Verifier Sign-off
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1.5 animate-pulse">
              <Navigation className="w-3.5 h-3.5" /> Stage 2: Awaiting Field Officer Ground-Truth
            </span>
          )}
        </div>
      </div>

      {/* 3-Step Visual Progress Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        
        {/* STAGE 1: Project Submission by Owner */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isStage1Done 
            ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
            : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Stage 1
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          <h4 className="text-sm font-bold text-white mb-1">Project Submission</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Submitted by Project Owner with GIS boundary, species mix, and drone LiDAR point cloud.
          </p>

          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-0.5">
            <div>Owner: <strong className="text-white">{project.developerName}</strong></div>
            <div className="text-slate-500 truncate">Tx: {project.blockchainTx?.registryTxHash?.slice(0, 14)}...</div>
          </div>
        </div>

        {/* STAGE 2: Review Field by Field Officer */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isStage2Done 
            ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
            : isStage2Active
              ? 'bg-sky-950/30 border-sky-500/50 shadow-lg shadow-sky-500/10'
              : 'bg-slate-950/60 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
              isStage2Done 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                : 'bg-sky-500/10 text-sky-300 border-sky-500/20'
            }`}>
              Stage 2
            </span>
            {isStage2Done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Navigation className="w-4 h-4 text-sky-400 animate-pulse" />
            )}
          </div>

          <h4 className="text-sm font-bold text-white mb-1">Field Officer Ground-Truth</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            On-site DGPS boundary inspection, soil core testing (0-100cm), and canopy vigor score.
          </p>

          {project.fieldInspection ? (
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-0.5">
              <div>Officer: <strong className="text-sky-300">{project.fieldInspection.officerName}</strong></div>
              <div>Ground Truth: <strong className="text-emerald-400">Verified ({project.fieldInspection.canopyVigorScore}%)</strong></div>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-amber-400 flex items-center justify-between">
              <span>Pending on-site visit</span>
              <Link href="/field-officer" className="text-xs text-sky-400 hover:underline">
                Review →
              </Link>
            </div>
          )}
        </div>

        {/* STAGE 3: Final Verification by Administrator / Verifier */}
        <div className={`p-5 rounded-2xl border transition-all ${
          isStage3Done 
            ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
            : isStage3Active
              ? 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-500/10'
              : 'bg-slate-950/60 border-slate-800 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
              isStage3Done 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
            }`}>
              Stage 3
            </span>
            {isStage3Done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-amber-400 animate-pulse" />
            )}
          </div>

          <h4 className="text-sm font-bold text-white mb-1">Final Verification & Minting</h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Auditor signs report hash with cryptographic keys to mint tokenized BCT carbon credits.
          </p>

          {isStage3Done ? (
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-slate-300 space-y-0.5">
              <div>Minted: <strong className="text-emerald-400">{project.totalCreditsIssued.toLocaleString()} BCT</strong></div>
              <div className="truncate text-teal-300">Batch: {project.blockchainTx?.issuedTokenBatchId}</div>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-amber-400 flex items-center justify-between">
              <span>Awaiting final sign-off</span>
              <Link href="/verifier" className="text-xs text-amber-400 hover:underline">
                Workbench →
              </Link>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
