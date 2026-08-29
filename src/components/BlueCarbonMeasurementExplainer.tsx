'use client';

import React, { useState } from 'react';
import { 
  Cpu, 
  TreePine, 
  Leaf, 
  Layers, 
  Scale, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Info,
  HelpCircle,
  X,
  Sliders,
  CheckCircle2,
  Waves
} from 'lucide-react';
import { calculateMangroveMRV } from '@/lib/mrv/mangrove';
import { MangroveTelemetryInput } from '@/types';

export function BlueCarbonMeasurementExplainer() {
  const [activeTab, setActiveTab] = useState<'methodology' | 'simulator'>('methodology');

  // Interactive Live Simulator Parameters
  const [simDbh, setSimDbh] = useState(15.2);
  const [simDensity, setSimDensity] = useState(1350);
  const [simWoodDensity, setSimWoodDensity] = useState(0.74);
  const [simSocPercent, setSimSocPercent] = useState(3.65);
  const [simBulkDensity, setSimBulkDensity] = useState(1.18);
  const [simArea, setSimArea] = useState(150);
  const [simBaseline, setSimBaseline] = useState(35.0);

  const simTelemetry: MangroveTelemetryInput = {
    averageDbhCm: simDbh,
    treeDensityPerHa: simDensity,
    woodDensityGcm3: simWoodDensity,
    canopyHeightMeters: 8.0,
    soilBulkDensityGcm3: simBulkDensity,
    soilOrganicCarbonPercent: simSocPercent,
    soilDepthSampledCm: 100,
    ndwiWaterIndex: 0.42,
    ndviMeanIndex: 0.78,
    baselineCarbonStockPerHa: simBaseline,
    monitoringYear: 2026,
  };

  const simResult = calculateMangroveMRV(simTelemetry, simArea);

  return (
    <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-teal-500/30 space-y-8 shadow-2xl relative overflow-hidden">
      
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" /> Scientific MRV Standard Guide
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            How Blue Carbon Credits Are Measured
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Blue carbon measurement follows IPCC Tier-2 and Verra VM0033 methodologies to quantify above-ground canopy, root biomass, and deep sediment organic carbon.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('methodology')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'methodology'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            6-Stage Formula
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'simulator'
                ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Carbon Simulator
          </button>
        </div>
      </div>

      {/* VIEW 1: 6-Stage Formula Walkthrough */}
      {activeTab === 'methodology' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Stage 1: Above-Ground Biomass */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative group hover:border-teal-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-300 font-mono text-xs font-bold flex items-center justify-center border border-teal-500/30">
                1
              </span>
              <span className="text-[10px] font-mono text-slate-500">IPCC VM0033</span>
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <TreePine className="w-4 h-4 text-teal-400" /> Above-Ground Biomass (AGB)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates dry matter from tree density, diameter at breast height (DBH), and species wood density using the Komiyama allometric equation.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 font-mono text-[11px] text-teal-300">
              AGB = 0.251 × ρ × (DBH)^2.46<br />
              Carbon = AGB × 0.47 (tC/ha)
            </div>
          </div>

          {/* Stage 2: Below-Ground Biomass */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative group hover:border-teal-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center border border-emerald-500/30">
                2
              </span>
              <span className="text-[10px] font-mono text-slate-500">Root Allometry</span>
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-400" /> Below-Ground Roots (BGB)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mangrove and wetland root prop networks anchor massive organic biomass underground, quantified via root-to-shoot ratios.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 font-mono text-[11px] text-emerald-300">
              BGB Biomass = AGB × 0.49<br />
              Carbon = BGB × 0.39 (tC/ha)
            </div>
          </div>

          {/* Stage 3: Soil Organic Carbon */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative group hover:border-teal-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 font-mono text-xs font-bold flex items-center justify-center border border-amber-500/30">
                3
              </span>
              <span className="text-[10px] font-mono text-slate-500">0-100cm Depth</span>
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" /> Soil Organic Carbon (SOC)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Anoxic saline sediment traps carbon for centuries. Measured from soil core bulk density and total organic carbon percentage.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 font-mono text-[11px] text-amber-300">
              SOC = Depth × BulkDensity × SOC%<br />
              SOC = 100cm × 1.18 × 3.65% (tC/ha)
            </div>
          </div>

          {/* Stage 4: Baseline Net Sequestration */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative group hover:border-teal-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center border border-cyan-500/30">
                4
              </span>
              <span className="text-[10px] font-mono text-slate-500">Additionality</span>
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" /> Net Carbon Stock Delta (ΔC)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deducts historical pre-restoration baseline carbon stock from the total measured current stock to prove net additionality.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 font-mono text-[11px] text-cyan-300">
              Total Stock = AGB + BGB + SOC<br />
              Net ΔC = Total Stock - Baseline Stock
            </div>
          </div>

          {/* Stage 5: CO2e Conversion */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative group hover:border-teal-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 font-mono text-xs font-bold flex items-center justify-center border border-purple-500/30">
                5
              </span>
              <span className="text-[10px] font-mono text-slate-500">Stoichiometry</span>
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Gross Sequestration (tCO2e)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Converts elemental carbon tonnes into carbon dioxide equivalent tonnes using the molecular weight ratio 44/12 across the project's spatial area.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 font-mono text-[11px] text-purple-300">
              Gross tCO2e = Net ΔC × (44/12) × Area (ha)
            </div>
          </div>

          {/* Stage 6: Permanence Buffer & Minting */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 relative group hover:border-teal-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-300 font-mono text-xs font-bold flex items-center justify-center border border-rose-500/30">
                6
              </span>
              <span className="text-[10px] font-mono text-slate-500">15% Risk Buffer</span>
            </div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" /> Issuable BCT Token Mint
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Locks a 15% permanence buffer pool into the protocol smart contract to guard against cyclone/sea-level reversal, releasing 85% as tradeable BCT credits.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-850 font-mono text-[11px] text-rose-300">
              Buffer Deduction = Gross × 15%<br />
              Net Minted BCT = Gross × 85%
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: Interactive Live Carbon Simulation Sandbox */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sliders Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-5 p-6 rounded-2xl bg-slate-950 border border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" /> Live Environmental Parameters
            </h4>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Project Area:</span>
                  <strong className="text-teal-300">{simArea} Hectares</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={simArea}
                  onChange={(e) => setSimArea(Number(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Mean Trunk DBH:</span>
                  <strong className="text-teal-300">{simDbh} cm</strong>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="35.0"
                  step="0.5"
                  value={simDbh}
                  onChange={(e) => setSimDbh(Number(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Tree Density:</span>
                  <strong className="text-teal-300">{simDensity} trees/ha</strong>
                </div>
                <input
                  type="range"
                  min="400"
                  max="3000"
                  step="50"
                  value={simDensity}
                  onChange={(e) => setSimDensity(Number(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Soil Organic Carbon (0-100cm Depth):</span>
                  <strong className="text-amber-300">{simSocPercent}% TOC</strong>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="8.0"
                  step="0.1"
                  value={simSocPercent}
                  onChange={(e) => setSimSocPercent(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Historical Baseline Carbon:</span>
                  <strong className="text-slate-400">{simBaseline} tC/ha</strong>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="60.0"
                  step="1.0"
                  value={simBaseline}
                  onChange={(e) => setSimBaseline(Number(e.target.value))}
                  className="w-full accent-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Live Dynamic Computation Card (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-teal-500/40 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-teal-400 font-bold uppercase tracking-wider block">
                Calculated Carbon Stocks
              </span>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Above-Ground (AGB):</span>
                  <strong className="text-white">{simResult.carbonStockAgbTCPerHa.toFixed(2)} tC/ha</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Below-Ground Roots (BGB):</span>
                  <strong className="text-emerald-300">{simResult.carbonStockBgbTCPerHa.toFixed(2)} tC/ha</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                  <span className="text-slate-400">Soil Organic Carbon (SOC):</span>
                  <strong className="text-amber-300">{simResult.carbonStockSocTCPerHa.toFixed(2)} tC/ha</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/40 flex justify-between text-teal-300">
                  <span className="font-bold">Total Carbon Stock:</span>
                  <strong className="text-white font-black">{simResult.totalCarbonStockTCPerHa.toFixed(2)} tC/ha</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs text-slate-400 block font-mono">Net Issuable Blue Carbon Credits:</span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight">
                {simResult.netIssuableCreditsTCO2e.toLocaleString()}{' '}
                <span className="text-sm font-bold text-teal-400">BCT</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Includes 15% Permanence Buffer deduction ({simResult.permanenceBufferPoolTCO2e.toLocaleString()} tCO2e locked).
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
