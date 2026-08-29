'use client';

import React, { useState } from 'react';
import { CreditHolding } from '@/types';
import { store } from '@/lib/store/registryStore';
import { 
  Flame, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  X, 
  FileCheck
} from 'lucide-react';
import Link from 'next/link';

interface RetirementModalProps {
  holding: CreditHolding | null;
  onClose: () => void;
  onSuccess: (certId: string) => void;
}

export const RetirementModal: React.FC<RetirementModalProps> = ({
  holding,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<number>(holding ? Math.min(100, holding.availableCredits) : 50);
  const [retireeName, setRetireeName] = useState('EcoTech Global Corp');
  const [beneficiary, setBeneficiary] = useState('EcoTech Global Infrastructure Ltd');
  const [reason, setReason] = useState('Scope 3 Data Center Carbon Neutrality Declaration Q1 2026');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdCertId, setCreatedCertId] = useState<string | null>(null);

  if (!holding) return null;

  const handleRetire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > holding.availableCredits) return;

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const cert = store.retireCredits(
          holding.id,
          amount,
          retireeName,
          beneficiary,
          reason
        );
        setIsSubmitting(false);
        setCreatedCertId(cert.certificateId);
        onSuccess(cert.certificateId);
      } catch (err: any) {
        alert(err.message);
        setIsSubmitting(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
        
        <div className="p-5 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Retire & Burn Carbon Credits</h3>
              <p className="text-xs text-slate-400">Permanent on-chain impact settlement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!createdCertId ? (
          <form onSubmit={handleRetire} className="p-6 space-y-4">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[11px]">Source Project:</span>
                <span className="text-slate-200 font-semibold">{holding.projectName}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[11px]">Available Balance:</span>
                <span className="text-teal-400 font-mono font-bold">{holding.availableCredits.toLocaleString()} BCT</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Irreversible Action:</strong> Retiring credits permanently burns the token on the blockchain ledger. These credits can never be re-sold or transferred again.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-300">Quantity to Retire (tCO2e)</label>
                <button
                  type="button"
                  onClick={() => setAmount(holding.availableCredits)}
                  className="text-[11px] text-teal-400 hover:underline font-mono"
                >
                  Max ({holding.availableCredits} BCT)
                </button>
              </div>
              <input
                type="number"
                min="1"
                max={holding.availableCredits}
                step="0.5"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 text-white font-mono text-sm outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Beneficiary / Retiring Entity</label>
              <input
                type="text"
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                placeholder="e.g. EcoTech Global Solutions"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 text-white text-xs outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Retirement Statement / Purpose</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder="e.g. Corporate Scope 1 & 2 Emissions Offset for 2026"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500 text-white text-xs outline-none transition-colors resize-none"
                required
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || amount <= 0 || amount > holding.availableCredits}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white shadow-lg shadow-rose-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing On-Chain Burn...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4" />
                    <span>Confirm & Burn {amount} Credits</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-white">Credits Successfully Retired!</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {amount} tCO2e Blue Carbon credits permanently burned on-chain. Your tamper-proof retirement certificate is ready.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
              Certificate ID: <strong className="text-teal-400">{createdCertId}</strong>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href={'/portfolio/retirements/' + createdCertId}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all"
              >
                <FileCheck className="w-4 h-4" />
                <span>View Official Certificate & QR</span>
              </Link>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
