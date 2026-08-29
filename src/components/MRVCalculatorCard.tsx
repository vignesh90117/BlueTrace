'use client';

import React from 'react';
import { MRVCalculationResult, MangroveTelemetryInput } from '@/types';
import { 
  Cpu, 
  Leaf, 
  TreePine, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Hash, 
  Scale, 
  Droplets,
  Activity
} from 'lucide-react';

interface MRVCalculatorCardProps {
  telemetry?: MangroveTelemetryInput;
  mrvResult?: MRVCalculationResult;
  areaHectares: number;
}

export const MRVCalculatorCard: React.FC<MRVCalculatorCardProps> = ({
  telemetry,
  mrvResult,
  areaHectares,
}) => {
  if (!mrvResult || !telemetry) {
    return (
      <div className="p-8 rounded-3xl glass-panel border border-slate-800 text-center space-y-3">
        <Cpu className="w-8 h-8 text-teal-400 mx-auto animate-pulse" />
        <h4 className="text-base font-bold text-white">Telemetry & MRV Pending</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          No monitoring data has been ingested for this project yet. Input drone LiDAR and soil core measurements to execute the IPCC Tier-2 calculation model.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-teal-500/30 space-y-6 shadow-2xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
            <Cpu className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-teal-400 font-bold uppercase tracking-wider block">
              IPCC Tier-2 / VM0033 Methodology
            </span>
            <h3 className="text-lg font-black text-white">
              Automated Carbon Stock Breakdown
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" /> Deterministic Verification
          </span>
        </div>
      </div>

      {/* 3 Component Pillars (AGB, BGB, SOC) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Above-Ground Biomass */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider font-mono">
              <TreePine className="w-4 h-4" />
              <span>Above-Ground (AGB)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Komiyama Model</span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              {mrvResult.carbonStockAgbTCPerHa.toFixed(2)}{' '}
              <span className="text-xs font-semibold text-teal-400">tC/ha</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 block mt-1">
              Biomass: {mrvResult.totalAgbDryMatterTonnesPerHa.toFixed(2)} dry t/ha
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-mono pt-2 border-t border-slate-850">
            Formula: AGB = 0.251 × ρ × (DBH)^2.46 (Carbon fraction: 0.47)
          </p>
        </div>

        {/* Below-Ground Biomass */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider font-mono">
              <Leaf className="w-4 h-4" />
              <span>Below-Ground (BGB)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Root Integral</span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              {mrvResult.carbonStockBgbTCPerHa.toFixed(2)}{' '}
              <span className="text-xs font-semibold text-emerald-400">tC/ha</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 block mt-1">
              Root ratio: 0.49 × AGB
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-mono pt-2 border-t border-slate-850">
            Formula: BGB = 0.49 × AGB (Carbon fraction: 0.39)
          </p>
        </div>

        {/* Soil Organic Carbon */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider font-mono">
              <Layers className="w-4 h-4" />
              <span>Sediment (SOC)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">0-100cm Depth</span>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              {mrvResult.carbonStockSocTCPerHa.toFixed(2)}{' '}
              <span className="text-xs font-semibold text-sky-400">tC/ha</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 block mt-1">
              Bulk Density: {telemetry.soilBulkDensityGcm3} g/cm³ • TOC: {telemetry.soilOrganicCarbonPercent}%
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-mono pt-2 border-t border-slate-850">
            Formula: Depth × BD × %TOC × 100
          </p>
        </div>

      </div>

      {/* Net Crediting Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-emerald-950/80 border border-teal-500/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 max-w-lg">
          <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest block">
            Net Issuable Carbon Credits (BCT)
          </span>
          <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
            {mrvResult.netIssuableCreditsTCO2e.toLocaleString()}{' '}
            <span className="text-sm font-bold text-emerald-400">BCT Tokens (tCO2e)</span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Gross: {mrvResult.grossSequesteredTCO2e.toLocaleString()} tCO2e — Permanence Buffer (15%): -{mrvResult.permanenceBufferPoolTCO2e.toLocaleString()} tCO2e
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1 shrink-0 shadow-inner">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Gross Sequestration:</span>
            <strong className="text-white">{mrvResult.grossSequesteredTCO2e.toLocaleString()} tCO2e</strong>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Baseline Carbon:</span>
            <strong className="text-slate-300">{telemetry.baselineCarbonStockPerHa} tC/ha</strong>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Permanence Buffer:</span>
            <strong className="text-rose-400">15% Locked On-Chain</strong>
          </div>
        </div>
      </div>

      {/* Report SHA-256 Digest Anchor */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-400 truncate">
          <Hash className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="text-slate-500">Report SHA-256 Digest:</span>
          <span className="text-teal-300 font-bold truncate">{mrvResult.reportSha256Hash}</span>
        </div>

        <span className="text-[11px] text-slate-500 shrink-0">
          Calculated: {new Date(mrvResult.calculatedAt).toLocaleString()}
        </span>
      </div>

    </div>
  );
};
