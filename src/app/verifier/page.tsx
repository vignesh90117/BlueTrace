'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store/registryStore';
import { useRole } from '@/components/RoleContext';
import { RoleGuard } from '@/components/RoleGuard';
import { DynamicMapViewer as MapViewer } from '@/components/DynamicMapViewer';
import { MRVCalculatorCard } from '@/components/MRVCalculatorCard';
import { ReviewStageTracker } from '@/components/ReviewStageTracker';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  FileCheck, 
  Loader2, 
  MapPin, 
  UserCheck, 
  Navigation, 
  Sparkles, 
  AlertCircle, 
  XCircle,
  ArrowRight,
  Wallet,
  ExternalLink
} from 'lucide-react';

export default function VerifierWorkbenchPage() {
  const { walletAddress, userName } = useRole();
  const [refreshKey, setRefreshKey] = useState(0);

  const projects = store.getProjects();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects.find(p => p.status === 'field_approved')?.id || projects[1]?.id || projects[0]?.id
  );
  
  const [verifierNotes, setVerifierNotes] = useState(
    'Audited Stage 2 Field Officer ground-truth report. Soil core chromatography and Sentinel-2 L2A canopy indices cross-checked against IPCC VM0033 allometric models. Authorized for on-chain credit minting.'
  );
  const [isSigning, setIsSigning] = useState(false);
  const [signSuccessTx, setSignSuccessTx] = useState<string | null>(null);
  const [rejectionNotice, setRejectionNotice] = useState<string | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Estimated credits for display
  const issuableCredits = selectedProject.mrvResult?.netIssuableCreditsTCO2e 
    ? Math.round(selectedProject.mrvResult.netIssuableCreditsTCO2e)
    : Math.round(selectedProject.areaHectares * 245.5);

  const handleApproveAndMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setIsSigning(true);
    setSignSuccessTx(null);
    setRejectionNotice(null);

    setTimeout(() => {
      try {
        const result = store.verifyAndIssueCredits(
          selectedProject.id,
          userName,
          walletAddress,
          verifierNotes
        );
        setIsSigning(false);
        setSignSuccessTx(result.txHash);
        setRefreshKey(k => k + 1); // Force immediate UI refresh
      } catch (err: any) {
        alert(err.message);
        setIsSigning(false);
      }
    }, 1200);
  };

  // REJECT ACTION (Verifier / Admin)
  const handleRejectAudit = () => {
    const reason = prompt('Enter the specific audit failure or methodology discrepancy reason to reject this project:');
    if (!reason) return;

    setIsSigning(true);
    setSignSuccessTx(null);

    setTimeout(() => {
      try {
        store.rejectVerifierAudit(selectedProject.id, userName, walletAddress, reason);
        setIsSigning(false);
        setRejectionNotice(`Project ${selectedProject.id} rejected by Auditor. Reason logged on-chain.`);
        setRefreshKey(k => k + 1); // Force immediate UI refresh
      } catch (err: any) {
        alert(err.message);
        setIsSigning(false);
      }
    }, 1000);
  };

  return (
    <RoleGuard 
      allowedRoles={['verifier']} 
      workspaceName="Independent Verifier & Auditor Workbench" 
      requiredRoleLabel="Independent Verifier"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 sm:p-10 rounded-3xl glass-panel border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Stage 3 • Independent Audit & Credit Minting
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Independent Verifier & Admin Workbench
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Audit Stage 2 Field Officer reports, verify IPCC VM0033 carbon stock formulas, and cryptographically sign off on-chain to mint tokenized carbon credits.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 shadow-inner">
            <span className="text-slate-500 block text-[10px]">Accredited Auditor:</span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> ISO 14065 Accredited
            </span>
          </div>
        </div>

        {/* 3-Stage Progress Tracker */}
        <ReviewStageTracker key={`tracker-${refreshKey}-${selectedProject.id}`} project={selectedProject} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Pending Review Queue */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> Audit Verification Queue
              </h3>
              <span className="text-xs font-mono text-slate-400">{projects.length} Total</span>
            </div>

            <div className="space-y-3">
              {projects.map((proj) => {
                const isSelected = proj.id === selectedProjectId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setSignSuccessTx(null);
                      setRejectionNotice(null);
                    }}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/60 shadow-lg shadow-amber-500/10'
                        : 'glass-panel hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
                        {proj.id}
                      </span>
                      {proj.status === 'credits_issued' ? (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Minted
                        </span>
                      ) : proj.status === 'field_approved' ? (
                        <span className="text-[10px] font-semibold text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          <Navigation className="w-3 h-3" /> Field Approved • Ready
                        </span>
                      ) : proj.status === 'rejected' ? (
                        <span className="text-[10px] font-semibold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" /> In Stage 2 Review
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">{proj.name}</h4>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                      <span>{proj.region}</span>
                      <span>{proj.areaHectares} ha</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Inspection & Sign-off Workbench */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-teal-400 font-bold block">PROJECT AUDIT #{selectedProject.id}</span>
                <h2 className="text-xl font-black text-white tracking-tight">{selectedProject.name}</h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" /> {selectedProject.region}, {selectedProject.country} • Owner: <strong className="text-slate-200">{selectedProject.organization}</strong>
                </p>
              </div>

              {selectedProject.status === 'credits_issued' ? (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
                  <CheckCircle2 className="w-4 h-4" /> Credits Minted ({selectedProject.totalCreditsIssued.toLocaleString()} BCT)
                </div>
              ) : (
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                  Status: Ready for Stage 3 Approval
                </div>
              )}
            </div>

            {/* Stage 2 Field Officer Inspection Attestation Box */}
            <div className="p-6 rounded-3xl glass-panel border border-sky-500/40 bg-sky-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Navigation className="w-4 h-4 text-sky-400" /> Stage 2 Field Officer Attestation
                </h4>
                {selectedProject.fieldInspection ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ground Truth Verified
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Direct Auditor Review Active
                  </span>
                )}
              </div>

              {selectedProject.fieldInspection ? (
                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div>Officer: <strong className="text-white">{selectedProject.fieldInspection.officerName}</strong> ({selectedProject.fieldInspection.officerDesignation})</div>
                    <div>Inspected Date: <strong className="text-white">{selectedProject.fieldInspection.inspectedAt}</strong></div>
                    <div>Canopy Vigor Score: <strong className="text-emerald-400">{selectedProject.fieldInspection.canopyVigorScore}%</strong></div>
                    <div>Soil Sample Ref: <strong className="text-teal-300">{selectedProject.fieldInspection.soilCoreSampleRef}</strong></div>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans italic bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    "{selectedProject.fieldInspection.fieldNotes}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Direct Auditor fast-track mode: You can review formulas and execute final on-chain credit minting directly.
                </p>
              )}
            </div>

            <MapViewer
              coordinates={selectedProject.coordinates}
              centerCoordinate={selectedProject.centerCoordinate}
              projectName={selectedProject.name}
              areaHectares={selectedProject.areaHectares}
              ndviScore={selectedProject.telemetryData?.ndviMeanIndex || 0.78}
              heightClass="h-[380px]"
              creditsAvailable={selectedProject.totalCreditsIssued - selectedProject.totalCreditsRetired}
              creditsIssued={selectedProject.totalCreditsIssued}
              status={selectedProject.status}
              batchId={selectedProject.blockchainTx?.issuedTokenBatchId}
              projectId={selectedProject.id}
              ecosystemType={selectedProject.ecosystemType}
            />

            <MRVCalculatorCard
              telemetry={selectedProject.telemetryData}
              mrvResult={selectedProject.mrvResult}
              areaHectares={selectedProject.areaHectares}
            />

            {/* Verification & Minting Action Form */}
            <form onSubmit={handleApproveAndMint} className="p-8 rounded-3xl glass-panel border border-amber-500/30 space-y-5 shadow-2xl">
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Stage 3 Smart Contract Minting Execution</h3>
              </div>

              {signSuccessTx && (
                <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 animate-in zoom-in-95 duration-150">
                  <div className="font-bold flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" /> Final Verification Approved & Credits Minted On-Chain!
                  </div>
                  <div className="font-mono text-[11px] break-all text-slate-300">
                    Smart Contract Mint Tx: <strong className="text-teal-300">{signSuccessTx}</strong>
                  </div>
                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      href="/portfolio"
                      className="px-3.5 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1 hover:bg-teal-600 transition-colors"
                    >
                      <span>View in Portfolio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/registry/${selectedProject.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <span>View Public Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {rejectionNotice && (
                <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in zoom-in-95 duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{rejectionNotice}</span>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Official Auditor Statement & Findings
                </label>
                <textarea
                  rows={3}
                  value={verifierNotes}
                  onChange={(e) => setVerifierNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-xs outline-none transition-colors resize-none"
                  required
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Deterministic SHA-256 Digest:</span>
                  <span className="text-teal-400 font-bold">
                    {(selectedProject.mrvResult?.reportSha256Hash || '0x8f2d659a45e99831d102eef5781a9425c2763f0d').slice(0, 20) + '...'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>PDF Serial Number Format:</span>
                  <span className="text-purple-300 font-bold">
                    {`${selectedProject.id}-2026-B1-0001-${issuableCredits}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Credits to Mint:</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {issuableCredits.toLocaleString()} BCT (tCO2e)
                  </span>
                </div>
              </div>

              {/* Actions: APPROVE OR REJECT */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                
                {/* REJECT OPTION (Verifier / Admin) */}
                <button
                  type="button"
                  onClick={handleRejectAudit}
                  disabled={isSigning || selectedProject.status === 'credits_issued'}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject Project / Deny Issuance</span>
                </button>

                {/* APPROVE AND MINT */}
                <button
                  type="submit"
                  disabled={isSigning || selectedProject.status === 'credits_issued'}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-teal-500 hover:from-amber-600 hover:to-teal-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
                >
                  {isSigning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Executing Smart Contract Mint...</span>
                    </>
                  ) : selectedProject.status === 'credits_issued' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>Credits Already Minted ({selectedProject.totalCreditsIssued.toLocaleString()} BCT)</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                      <span>Sign On-Chain & Mint {issuableCredits.toLocaleString()} BCT Credits</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>
    </RoleGuard>
  );
}
