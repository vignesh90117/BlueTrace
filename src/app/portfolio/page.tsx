'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store/registryStore';
import { useRole } from '@/components/RoleContext';
import { RoleGuard } from '@/components/RoleGuard';
import { 
  Wallet, 
  Flame, 
  ArrowUpRight, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Coins, 
  TreePine, 
  Award,
  Loader2,
  ExternalLink,
  History
} from 'lucide-react';

export default function PortfolioPage() {
  const { walletAddress, userName } = useRole();
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedHoldingId, setSelectedHoldingId] = useState<string | null>(null);
  const [retireAmount, setRetireAmount] = useState<number>(100);
  const [retireeName, setRetireeName] = useState<string>('EcoTech Global ESG Portfolio');
  const [beneficiary, setBeneficiary] = useState<string>('EcoTech Global Infrastructure Ltd');
  const [reason, setReason] = useState<string>('Corporate Scope 1 & 2 Emissions Offset Q1 2026');
  const [isRetiring, setIsRetiring] = useState(false);
  const [retirementSuccessCertId, setRetirementSuccessCertId] = useState<string | null>(null);

  const holdings = store.getHoldings();
  const certificates = store.getCertificates();
  const totalCreditsHeld = holdings.reduce((acc, h) => acc + h.availableCredits, 0);
  const totalCreditsRetired = certificates.reduce((acc, c) => acc + c.amountTCO2e, 0);
  const selectedHolding = holdings.find(h => h.id === selectedHoldingId);

  const handleRetireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHoldingId) return;

    setIsRetiring(true);
    setTimeout(() => {
      try {
        const cert = store.retireCredits(
          selectedHoldingId,
          Number(retireAmount),
          retireeName,
          beneficiary,
          reason
        );
        setIsRetiring(false);
        setRefreshKey(k => k + 1);
        setRetirementSuccessCertId(cert.certificateId);
      } catch (err: any) {
        alert(err.message);
        setIsRetiring(false);
      }
    }, 1500);
  };

  return (
    <RoleGuard
      allowedRoles={['buyer', 'developer']}
      workspaceName="Credit Buyer & Portfolio Workspace"
      requiredRoleLabel="Credit Buyer / Offsetter"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 sm:p-10 rounded-3xl glass-panel border border-purple-500/20 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Wallet className="w-3.5 h-3.5" /> BCT Token Holdings & Retirement
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Carbon Credit Portfolio & Offsets
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Hold verified Blue Carbon Tokens (BCT), transfer to secondary markets, or permanently retire credits on-chain with zero double counting.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 shadow-inner">
            <span className="text-slate-500 block text-[10px]">Connected Wallet:</span>
            <span className="text-teal-400 font-bold">{walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</span>
          </div>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Available Carbon Credits</span>
            <div className="text-3xl font-black font-mono text-emerald-400">
              {totalCreditsHeld.toLocaleString()}{' '}
              <span className="text-sm font-bold text-teal-400">BCT</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">1 BCT = 1 tCO2e Verified Offsets</span>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Permanently Retired</span>
            <div className="text-3xl font-black font-mono text-rose-400">
              {totalCreditsRetired.toLocaleString()}{' '}
              <span className="text-sm font-bold text-rose-400">tCO2e</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">Burned on Smart Contract</span>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Official Certificates</span>
            <div className="text-3xl font-black font-mono text-purple-400">
              {certificates.length}
            </div>
            <span className="text-[11px] text-purple-300 font-mono mt-1 block">With Dynamic Verification QR</span>
          </div>
        </div>

        {/* Token Holdings Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-teal-400" /> Active BCT Token Holdings
            </h2>
            <span className="text-xs font-mono text-slate-400">{holdings.length} Token Batches</span>
          </div>

          <div className="space-y-4">
            {holdings.map((h) => (
              <div
                key={h.id}
                className="p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all hover:border-teal-500/30"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-950/80 text-teal-300 border border-teal-800/40">
                      Batch: {h.batchId}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                      Vintage {h.vintage}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                      {h.ecosystemType}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{h.projectName}</h3>
                  <div className="text-xs text-slate-400 font-mono space-y-0.5">
                    <p>Serial Number Range: <strong className="text-purple-300">{h.serialRange}</strong></p>
                    <p className="text-[11px] text-slate-500 truncate">Issuance Tx: {h.issuanceTxHash}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-right">
                    <span className="text-slate-500 block text-[10px]">Available Balance:</span>
                    <span className="text-emerald-400 font-bold text-lg">{h.availableCredits.toLocaleString()} BCT</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedHoldingId(h.id);
                      setRetirementSuccessCertId(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-lg shadow-rose-500/20 flex items-center gap-1.5 transition-all hover:scale-105"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Permanently Retire / Offset</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retirement Certificates History */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" /> Tamper-Proof Retirement Certificates
            </h2>
            <span className="text-xs font-mono text-slate-400">{certificates.length} Total</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.certificateId}
                className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2.5 py-0.5 rounded-lg">
                    {cert.certificateId}
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> Burned On-Chain
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{cert.beneficiary}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Project: {cert.projectName}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Retired Amount:</span>
                    <strong className="text-emerald-400 font-bold">{cert.amountTCO2e.toLocaleString()} tCO2e</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Serial Range:</span>
                    <strong className="text-purple-300 truncate max-w-[200px]">{cert.serialRange}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timestamp:</span>
                    <strong className="text-slate-300">{new Date(cert.retiredAt).toLocaleDateString()}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-mono text-slate-500 truncate max-w-[180px]">
                    Hash: {cert.immutableCertificateHash.slice(0, 14)}...
                  </span>

                  <Link
                    href={`/portfolio/retirements/${cert.certificateId}`}
                    className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-slate-950 text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
                  >
                    <span>View Official Certificate</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Retirement Modal Form */}
        {selectedHoldingId && selectedHolding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-rose-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Permanently Retire Carbon Credits</h3>
                    <p className="text-xs text-slate-400 font-mono">Irreversible on-chain burn</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedHoldingId(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  ✕
                </button>
              </div>

              {retirementSuccessCertId ? (
                <div className="space-y-4 py-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Carbon Credits Successfully Retired!</h4>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      Certificate ID: <strong className="text-purple-300">{retirementSuccessCertId}</strong>
                    </p>
                  </div>
                  <Link
                    href={`/portfolio/retirements/${retirementSuccessCertId}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20"
                  >
                    <span>Open & Print Official Certificate</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleRetireSubmit} className="space-y-4 text-xs">
                  
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Source Project:</span>
                      <strong className="text-slate-200">{selectedHolding.projectName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Available to Retire:</span>
                      <strong className="text-emerald-400 font-bold">{selectedHolding.availableCredits.toLocaleString()} BCT</strong>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Retirement Amount (tCO2e) *</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedHolding.availableCredits}
                      value={retireAmount}
                      onChange={(e) => setRetireAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 text-white font-mono outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Beneficiary Name (To whom offset is credited) *</label>
                    <input
                      type="text"
                      value={beneficiary}
                      onChange={(e) => setBeneficiary(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 text-white outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Retiring Organization / Individual *</label>
                    <input
                      type="text"
                      value={retireeName}
                      onChange={(e) => setRetireeName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 text-white outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Retirement Reason / ESG Declaration *</label>
                    <textarea
                      rows={2}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 text-white outline-none resize-none"
                      required
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] leading-relaxed">
                    ⚠️ Warning: Carbon token retirement is mathematically permanent and cannot be reversed or transferred back.
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedHoldingId(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isRetiring}
                      className="px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold flex items-center gap-2 shadow-lg shadow-rose-500/20 disabled:opacity-50"
                    >
                      {isRetiring ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Burning on Blockchain...</span>
                        </>
                      ) : (
                        <>
                          <Flame className="w-4 h-4" />
                          <span>Confirm Permanent Burn</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </RoleGuard>
  );
}
