'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRole } from '@/components/RoleContext';
import { DynamicMapViewer as MapViewer } from '@/components/DynamicMapViewer';
import { store } from '@/lib/store/registryStore';
import { BlueCarbonMeasurementExplainer } from '@/components/BlueCarbonMeasurementExplainer';
import { 
  Waves, 
  ShieldCheck, 
  TreePine, 
  Cpu, 
  FileCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Flame, 
  BarChart3, 
  Globe2,
  Lock,
  Satellite,
  Coins,
  Activity,
  Sliders,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const { setRole } = useRole();
  const projects = store.getProjects();
  const featuredProject = projects[0];

  // Interactive Live MRV Simulator State on Home Page
  const [simDbh, setSimDbh] = useState(15.5);
  const [simDensity, setSimDensity] = useState(1400);
  const [simArea, setSimArea] = useState(185);
  const [simSoc, setSimSoc] = useState(3.6);

  // Live Formula Calculations
  const singleTreeAgb = 0.251 * 0.74 * Math.pow(simDbh, 2.46);
  const totalAgbPerHa = (singleTreeAgb * simDensity) / 1000;
  const agbCarbon = totalAgbPerHa * 0.47;
  const bgbCarbon = (totalAgbPerHa * 0.49) * 0.39;
  const socCarbon = 100 * 1.18 * (simSoc / 100) * 100;
  const totalCarbonPerHa = agbCarbon + bgbCarbon + socCarbon;
  const netDeltaPerHa = Math.max(0, totalCarbonPerHa - 38.5);
  const grossTCO2e = netDeltaPerHa * (44 / 12) * simArea;
  const netCredits = grossTCO2e * 0.85;

  const stats = [
    { label: 'Total Coastal Wetland Protected', value: '545.0 Ha', change: '+185 Ha this cycle', icon: Globe2, color: 'text-teal-400' },
    { label: 'Verified Carbon Sequestered', value: '15,303.0 tCO2e', change: 'Tier-2 IPCC VM0033', icon: Activity, color: 'text-emerald-400' },
    { label: 'Tokenized Credits Issued', value: '8,420.5 BCT', change: '100% On-Chain Backed', icon: Coins, color: 'text-sky-400' },
    { label: 'Permanently Retired', value: '2,150.0 BCT', change: 'Zero Double-Counting', icon: Flame, color: 'text-rose-400' },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'GIS Plot Registration',
      desc: 'Developers map mangrove coordinates, upload soil baseline data, and anchor plot polygons to smart contracts.',
      icon: TreePine,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      step: '02',
      title: 'Automated MRV Engine',
      desc: 'Ingests drone LiDAR, Sentinel-2 NDVI, and soil cores to compute AGB, BGB, and deep sediment organic carbon.',
      icon: Cpu,
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
    },
    {
      step: '03',
      title: 'Independent Verification',
      desc: 'Accredited ISO-14065 auditors review mathematical proofs and sign the report hash with cryptographic keys.',
      icon: ShieldCheck,
      color: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30',
    },
    {
      step: '04',
      title: 'On-Chain Credit Lifecycle',
      desc: 'Mint tokenized credits (BCT), transfer seamlessly, or permanently burn with verifiable QR certificates.',
      icon: Flame,
      color: 'from-rose-500/20 to-purple-500/10 text-rose-400 border-rose-500/30',
    },
  ];

  return (
    <div className="space-y-28 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Futuristic glowing backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal-500/15 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />
        
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/40 text-teal-300 text-xs font-semibold tracking-wide shadow-lg shadow-teal-500/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Smart India Hackathon • Blockchain Blue Carbon & MRV Protocol</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.12]">
            Decentralized Blue Carbon{' '}
            <span className="gradient-text-ocean">
              Registry & Automated MRV
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            A trustworthy digital ledger recording real-world coastal mangrove and marine carbon capture with Google Satellite GIS mapping, deterministic IPCC models, and fraud-proof token lifecycle management.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/registry"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-500 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-slate-950 font-extrabold text-sm shadow-xl shadow-teal-500/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Globe2 className="w-4 h-4" />
              <span>Explore Public Registry</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/developer"
              onClick={() => setRole('developer')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm flex items-center gap-2 transition-all hover:border-emerald-500/50 shadow-lg"
            >
              <TreePine className="w-4 h-4 text-emerald-400" />
              <span>Developer Portal</span>
            </Link>

            <Link
              href="/verifier"
              onClick={() => setRole('verifier')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm flex items-center gap-2 transition-all hover:border-amber-500/50 shadow-lg"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Verifier Workbench</span>
            </Link>
          </div>
        </div>

        {/* Global Impact Metrics Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="p-6 rounded-3xl glass-panel glass-panel-hover relative overflow-hidden group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                  <Icon className={'w-5 h-5 ' + stat.color} />
                </div>
                <div className="text-3xl font-black text-white font-mono tracking-tight my-1">
                  {stat.value}
                </div>
                <div className={'text-[11px] font-mono flex items-center gap-1.5 ' + stat.color}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{stat.change}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* LIVE GOOGLE SATELLITE DEMONSTRATION SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Satellite className="w-3.5 h-3.5" /> Live Satellite Mapping Interface
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Interactive Google Satellite Blue Carbon GIS Plot
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Inspect real-time coastal mangrove boundary polygons, live GPS coordinate pins, and Sentinel-2 multispectral NDVI canopy health layers.
            </p>
          </div>

          <Link
            href={'/registry/' + featuredProject.id}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-teal-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all w-fit"
          >
            <span>View Full Project Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Live Map Component */}
        <MapViewer
          coordinates={featuredProject.coordinates}
          centerCoordinate={featuredProject.centerCoordinate}
          projectName={featuredProject.name}
          areaHectares={featuredProject.areaHectares}
          ndviScore={featuredProject.telemetryData?.ndviMeanIndex || 0.78}
          heightClass="h-[480px]"
        />
      </section>

      {/* HOW BLUE CARBON CREDITS ARE MEASURED (Full Scientific 6-Stage Breakdown & Sandbox) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <BlueCarbonMeasurementExplainer />
      </section>

      {/* CORE WORKFLOW BREAKDOWN */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-2">End-to-End Integrity</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How Blue Carbon MRV & Blockchain Sync Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            From coastal mudflat to verified carbon retirement certificate without intermediary black-boxes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((wf, idx) => {
            const Icon = wf.icon;
            return (
              <div key={idx} className="p-6 rounded-3xl glass-panel relative group hover:border-teal-500/40 transition-all">
                <div className="text-3xl font-black font-mono text-slate-800 group-hover:text-teal-500/20 transition-colors absolute top-4 right-4">
                  {wf.step}
                </div>
                <div className={'w-12 h-12 rounded-2xl bg-gradient-to-br ' + wf.color + ' border flex items-center justify-center mb-4 shadow-lg'}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{wf.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{wf.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ROLE SWITCHER PORTALS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Experience All 5 Registry Personas</h2>
          <p className="text-xs text-slate-400 mt-1">
            Test the complete blue carbon lifecycle from registration to retirement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl glass-panel flex flex-col justify-between hover:border-emerald-500/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                <TreePine className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Project Developer</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Register mangrove plots, upload drone point clouds & soil lab tests, and trigger automated MRV calculations.
              </p>
            </div>
            <Link
              href="/developer"
              onClick={() => setRole('developer')}
              className="w-full py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold text-xs text-center border border-emerald-500/30 transition-all block shadow-md"
            >
              Open Developer Portal →
            </Link>
          </div>

          <div className="p-6 rounded-3xl glass-panel flex flex-col justify-between hover:border-amber-500/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/10">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Independent Verifier</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Audit field evidence, verify IPCC equations, and cryptographically sign off on-chain for credit minting.
              </p>
            </div>
            <Link
              href="/verifier"
              onClick={() => setRole('verifier')}
              className="w-full py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs text-center border border-amber-500/30 transition-all block shadow-md"
            >
              Open Verifier Workbench →
            </Link>
          </div>

          <div className="p-6 rounded-3xl glass-panel flex flex-col justify-between hover:border-purple-500/40 transition-all group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 shadow-lg shadow-purple-500/10">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Credit Buyer & Offsetter</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Hold tokenized BCT credits, transfer balances, or permanently burn credits for verifiable Scope 1-3 offsets.
              </p>
            </div>
            <Link
              href="/portfolio"
              onClick={() => setRole('buyer')}
              className="w-full py-3 rounded-xl bg-purple-500/15 hover:bg-purple-500 text-purple-300 hover:text-slate-950 font-bold text-xs text-center border border-purple-500/30 transition-all block shadow-md"
            >
              Open Credit Portfolio →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
