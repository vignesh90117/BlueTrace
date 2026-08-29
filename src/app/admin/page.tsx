'use client';

import React from 'react';
import { useRole } from '@/components/RoleContext';
import { RoleGuard } from '@/components/RoleGuard';
import { store } from '@/lib/store/registryStore';
import { 
  ShieldAlert, 
  Layers, 
  UserCheck, 
  KeyRound, 
  Activity, 
  Database, 
  CheckCircle2, 
  Lock,
  Globe2,
  Sliders
} from 'lucide-react';

export default function AdminConsolePage() {
  const { walletAddress } = useRole();
  const projects = store.getProjects();
  const txs = store.getTransactions();

  const verifierList = [
    { name: 'Dr. Elena Rostova', org: 'Global Blue Marine Audits Ltd', standard: 'ISO 14065 / Verra Accredited', status: 'Active', address: '0x435422896A62024CE95B7286375F119a0A678d10' },
    { name: 'Dr. Rajesh Sen', org: 'Forest & Intertidal Ecosystem Board', standard: 'Govt Wildlife & Forestry Inspector', status: 'Active', address: '0x5592EC0cfb4dbc12D3aD100b257153436a1f0FEa' },
    { name: 'Marine Carbon Solutions LLC', org: 'UN Ocean Decade Partner', standard: 'Plan Vivo / IPCC Tier-2 Expert', status: 'Active', address: '0x772153436a1f0FEaD3aD100b250cfb4dbc12D3aD' }
  ];

  return (
    <RoleGuard
      allowedRoles={['admin']}
      workspaceName="Registry Governance & Admin Console"
      requiredRoleLabel="Registry Administrator"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 sm:p-10 rounded-3xl glass-panel border border-rose-500/20 bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5" /> Registry Governance
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Registry Authority Admin Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Configure system parameters, manage ISO 14065 independent verifier whitelisting, and monitor protocol-wide smart contract health.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 shadow-inner">
            <span className="text-slate-500 block text-[10px]">Governance Root Key:</span>
            <span className="text-rose-400 font-bold">{walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</span>
          </div>
        </div>

        {/* Global Protocol Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Smart Contracts</span>
            <div className="text-2xl font-black font-mono text-teal-400">3 Active</div>
            <span className="text-[11px] text-slate-500 font-mono mt-1 block">Registry, MRV & Tokens</span>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Accredited Auditors</span>
            <div className="text-2xl font-black font-mono text-amber-400">3 Whitelisted</div>
            <span className="text-[11px] text-slate-500 font-mono mt-1 block">ISO 14065 Certified</span>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Permanence Buffer Pool</span>
            <div className="text-2xl font-black font-mono text-emerald-400">15.0%</div>
            <span className="text-[11px] text-slate-500 font-mono mt-1 block">Locked Risk Reserve</span>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Transactions Anchored</span>
            <div className="text-2xl font-black font-mono text-purple-400">{txs.length}</div>
            <span className="text-[11px] text-slate-500 font-mono mt-1 block">Polygon Mainnet Sync</span>
          </div>
        </div>

        {/* Whitelisted Verifiers Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" /> Whitelisted Independent Verifiers & Field Officers
            </h2>
            <span className="text-xs font-mono text-slate-400">Smart Contract Authorized</span>
          </div>

          <div className="space-y-3">
            {verifierList.map((v, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{v.name}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                      {v.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{v.org} • {v.standard}</p>
                </div>

                <div className="font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Auditor Key:</span>
                  <span className="text-teal-400">{v.address}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </RoleGuard>
  );
}
