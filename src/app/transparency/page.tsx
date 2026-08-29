'use client';

import React, { useState } from 'react';
import { store } from '@/lib/store/registryStore';
import { 
  BarChart3, 
  ShieldCheck, 
  Flame, 
  Coins, 
  TreePine, 
  Layers, 
  ExternalLink
} from 'lucide-react';

export default function TransparencyLedgerPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const transactions = store.getTransactions();
  const projects = store.getProjects();
  const certificates = store.getCertificates();

  const totalArea = projects.reduce((acc, p) => acc + p.areaHectares, 0);
  const totalIssued = projects.reduce((acc, p) => acc + p.totalCreditsIssued, 0);
  const totalRetired = certificates.reduce((acc, c) => acc + c.amountTCO2e, 0);
  const activeCirculation = totalIssued - totalRetired;

  const filteredTx = transactions.filter(tx => filterType === 'all' || tx.type === filterType);

  const getTxTypeBadge = (type: string) => {
    switch (type) {
      case 'CREDITS_RETIRED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <Flame className="w-3 h-3" /> Permanent Burn
          </span>
        );
      case 'CREDITS_MINTED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Coins className="w-3 h-3" /> Credit Mint
          </span>
        );
      case 'MRV_VERIFIED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> MRV Verified
          </span>
        );
      case 'PROJECT_REGISTRATION':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
            <TreePine className="w-3 h-3" /> Project Anchor
          </span>
        );
      default:
        return <span className="text-xs text-slate-400">Transaction</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl glass-card border border-teal-500/20 bg-gradient-to-r from-slate-900 via-teal-950/20 to-slate-900">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Public Transparency & Proof of System
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Real-Time Blockchain Ledger Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Every blue carbon project registration, MRV report hash, credit issuance, and permanent retirement is recorded on-chain.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Ledger Live & Synchronized</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl glass-card">
          <span className="text-xs text-slate-400 block mb-1 font-medium">Total Hectares Under MRV</span>
          <div className="text-2xl font-extrabold font-mono text-white">{totalArea} ha</div>
          <span className="text-[11px] text-teal-400 font-mono mt-1 block">{projects.length} Mangrove Plots</span>
        </div>

        <div className="p-6 rounded-2xl glass-card">
          <span className="text-xs text-slate-400 block mb-1 font-medium">Verified Credits Minted</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">{totalIssued.toLocaleString()} BCT</div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">1 BCT = 1 tCO2e</span>
        </div>

        <div className="p-6 rounded-2xl glass-card">
          <span className="text-xs text-slate-400 block mb-1 font-medium">Permanently Retired (Burned)</span>
          <div className="text-2xl font-extrabold font-mono text-rose-400">{totalRetired.toLocaleString()} BCT</div>
          <span className="text-[11px] text-rose-400/80 font-mono mt-1 block">Irreversible Offsets</span>
        </div>

        <div className="p-6 rounded-2xl glass-card">
          <span className="text-xs text-slate-400 block mb-1 font-medium">Available Active Circulation</span>
          <div className="text-2xl font-extrabold font-mono text-teal-300">{activeCirculation.toLocaleString()} BCT</div>
          <span className="text-[11px] text-slate-400 font-mono mt-1 block">Zero Double-Counting</span>
        </div>
      </div>

      <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" /> Live On-Chain Event Stream
            </h3>
            <p className="text-xs text-slate-400">Immutable audit trail of smart contract state changes</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {['all', 'CREDITS_RETIRED', 'CREDITS_MINTED', 'MRV_VERIFIED', 'PROJECT_REGISTRATION'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={'px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ' + (filterType === type ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800')}
              >
                {type === 'all' ? 'All Events' : type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredTx.map((tx) => (
            <div
              key={tx.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs transition-all hover:border-slate-700"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  {getTxTypeBadge(tx.type)}
                  <span className="text-slate-500 text-[11px]">Block #{tx.blockNumber}</span>
                  <span className="text-slate-500 text-[11px]">• {new Date(tx.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-slate-200 font-sans text-xs">{tx.details}</div>
                <div className="text-[11px] text-slate-500 truncate max-w-md">
                  From: <span className="text-slate-400">{tx.from}</span> → To: <span className="text-slate-400">{tx.to}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-slate-500 block text-[10px]">Transaction Hash:</span>
                <span className="text-teal-400 text-xs hover:underline cursor-pointer flex items-center gap-1 justify-end">
                  {tx.txHash.slice(0, 10) + '...' + tx.txHash.slice(-8)}
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
