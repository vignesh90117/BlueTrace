'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { store } from '@/lib/store/registryStore';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ArrowLeft, 
  Award, 
  CheckCircle2, 
  Flame, 
  Printer, 
  Share2, 
  ShieldCheck, 
  ExternalLink, 
  Trees, 
  FileCheck,
  Calendar,
  Building,
  User,
  Hash
} from 'lucide-react';

export default function RetirementCertificatePage() {
  const params = useParams();
  const id = params?.id as string;
  const cert = store.getCertificateById(id) || store.getCertificates()[0];

  if (!cert) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">Certificate Not Found</h2>
        <Link href="/portfolio" className="text-xs text-teal-400 hover:underline mt-2 inline-block">
          ← Back to Portfolio
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const verifyUrl = 'https://aquacarbon.registry/retirements/' + cert.certificateId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Actions */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Certificate</span>
          </button>
        </div>
      </div>

      {/* High-Integrity Official Certificate Canvas */}
      <div className="relative p-8 sm:p-14 rounded-3xl bg-slate-950 border-2 border-teal-500/40 shadow-2xl space-y-8 overflow-hidden print:border-slate-300 print:text-black">
        
        {/* Certificate Decorative Border Accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/10 rounded-br-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/10 rounded-tl-full blur-2xl pointer-events-none" />

        {/* Certificate Header */}
        <div className="text-center space-y-3 border-b border-slate-800 pb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center mx-auto shadow-xl shadow-teal-500/25">
            <Award className="w-9 h-9 text-slate-950 stroke-[2.2]" />
          </div>

          <div>
            <span className="text-[11px] font-mono font-bold text-teal-400 uppercase tracking-widest block">
              Official Blockchain Carbon Offset Record
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Certificate of Blue Carbon Retirement
            </h1>
            <p className="text-xs text-slate-400 max-w-lg mx-auto mt-1">
              This document serves as definitive proof that the carbon credits specified below have been permanently retired on-chain with zero double-counting.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-mono font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>Tokens Burned & Invalidated Permanently</span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="space-y-6 text-center">
          
          <div className="space-y-1">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Presented To Beneficiary</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 tracking-tight">
              {cert.beneficiary}
            </div>
            <span className="text-xs text-slate-400 font-mono">Retiring Entity: {cert.retireeName}</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 max-w-lg mx-auto">
            <span className="text-xs text-slate-400 block">Total Carbon Emissions Offset</span>
            <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
              {cert.amountTCO2e.toLocaleString()}{' '}
              <span className="text-lg font-bold text-teal-400">tCO2e</span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Equivalent to 1 tonne of verified coastal wetland carbon sequestration per credit.
            </p>
          </div>

          <div className="space-y-1 max-w-xl mx-auto">
            <span className="text-xs text-slate-400 uppercase tracking-wider block">Declaration Purpose</span>
            <p className="text-xs sm:text-sm text-slate-200 italic font-medium leading-relaxed">
              "{cert.reason}"
            </p>
          </div>

        </div>

        {/* Project & Batch Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs font-mono">
          <div className="space-y-2">
            <div>
              <span className="text-slate-500 block text-[10px]">Source Project:</span>
              <strong className="text-slate-200">{cert.projectName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Token Batch ID:</span>
              <strong className="text-teal-400">{cert.batchId}</strong>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-slate-500 block text-[10px]">Retirement Serial Range:</span>
              <strong className="text-purple-300 break-all">{cert.serialRange}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Retirement Timestamp:</span>
              <strong className="text-slate-200">{new Date(cert.retiredAt).toUTCString()}</strong>
            </div>
          </div>
        </div>

        {/* Dynamic Verification QR Code & Blockchain Proof */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-teal-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Cryptographic On-Chain Verification</span>
            </div>
            <div className="text-[11px] text-slate-400 break-all">
              Burn Tx: <span className="text-slate-200">{cert.burnTxHash}</span>
            </div>
            <div className="text-[11px] text-slate-400 break-all">
              Certificate Hash: <span className="text-slate-200">{cert.immutableCertificateHash}</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="p-2.5 rounded-xl bg-white shrink-0 shadow-lg">
            <QRCodeSVG value={verifyUrl} size={90} />
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500">
          <span>Certificate ID: {cert.certificateId}</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Blue Carbon Registry Protocol
          </span>
        </div>

      </div>

    </div>
  );
}
