'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store/registryStore';
import { useRole } from '@/components/RoleContext';
import { RoleGuard } from '@/components/RoleGuard';
import { 
  TreePine, 
  PlusCircle, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Coins, 
  MapPin,
  AlertCircle,
  XCircle,
  Search,
  Navigation,
  Globe2,
  Waves
} from 'lucide-react';

export default function DeveloperDashboardPage() {
  const { walletAddress, userName } = useRole();
  const projects = store.getProjects();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEcosystem, setSelectedEcosystem] = useState('All');

  const totalArea = projects.reduce((acc, p) => acc + p.areaHectares, 0);
  const totalIssued = projects.reduce((acc, p) => acc + p.totalCreditsIssued, 0);

  const ecosystems = ['All', 'Mangrove', 'Seagrass', 'Salt Marsh', 'Coastal Wetland', 'Kelp Forest', 'Tidal Estuary'];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEco = selectedEcosystem === 'All' || p.ecosystemType.toLowerCase() === selectedEcosystem.toLowerCase();
    return matchesSearch && matchesEco;
  });

  const getEcosystemIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'seagrass': return '🌊';
      case 'salt marsh': return '🌾';
      case 'coastal wetland': return '🪸';
      case 'kelp forest': return '🌊';
      case 'tidal estuary': return '💧';
      default: return '🌿';
    }
  };

  return (
    <RoleGuard 
      allowedRoles={['developer']} 
      workspaceName="Project Owner / Developer Workspace" 
      requiredRoleLabel="Project Owner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 sm:p-10 rounded-3xl glass-panel border border-emerald-500/20 bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <TreePine className="w-3.5 h-3.5" /> Project Owner Dashboard
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Coastal Restoration Projects Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Manage your registered blue carbon ecosystems (Mangroves, Seagrass, Salt Marshes, Wetlands), upload drone LiDAR & soil telemetry, edit spatial boundaries, and track on-chain token issuance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/developer/projects/new"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Register New Project</span>
            </Link>
          </div>
        </div>

        {/* Highlight Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Registered Plots</span>
            <div className="text-3xl font-black font-mono text-white">{projects.length}</div>
            <span className="text-[11px] text-teal-400 font-mono mt-1 block">Stored in Persistent DB</span>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Total Area Protected</span>
            <div className="text-3xl font-black font-mono text-teal-300">{totalArea.toLocaleString()} ha</div>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">GPS Polygon Boundaries</span>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Verified Credits Minted</span>
            <div className="text-3xl font-black font-mono text-emerald-400">
              {totalIssued.toLocaleString()}{' '}
              <span className="text-sm font-bold text-emerald-400">BCT</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-1 block">1 BCT = 1 tCO2e</span>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Stage 3 Fully Minted</span>
            <div className="text-3xl font-black font-mono text-sky-400">
              {projects.filter(p => p.status === 'credits_issued').length}/{projects.length}
            </div>
            <span className="text-[11px] text-sky-400 font-mono mt-1 block">On Polygon Blockchain</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by project name, ID, or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none"
              />
            </div>

            {/* Ecosystem Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {ecosystems.map((eco) => (
                <button
                  key={eco}
                  onClick={() => setSelectedEcosystem(eco)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedEcosystem === eco
                      ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {eco}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Project Pipeline List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" /> Your Registered Projects ({filteredProjects.length})
            </h2>
            <Link
              href="/developer/projects/new"
              className="text-xs font-semibold text-teal-400 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" /> + Add New Plot
            </Link>
          </div>

          <div className="space-y-4">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 sm:p-7 rounded-3xl glass-panel glass-panel-hover flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 transition-all group border border-slate-800"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-950/80 text-teal-400 border border-teal-800/40">
                      {proj.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 flex items-center gap-1">
                      <span>{getEcosystemIcon(proj.ecosystemType)}</span>
                      <span>{proj.ecosystemType}</span>
                    </span>
                    
                    {proj.status === 'credits_issued' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Stage 3: Credits Issued
                      </span>
                    ) : proj.status === 'field_approved' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Stage 2: Field Approved
                      </span>
                    ) : proj.status === 'rejected' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Corrections Requested
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                        <Clock className="w-3 h-3" /> Stage 2: In Field Review
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                    {proj.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {proj.region}, {proj.country}
                    </span>
                    <span>Area: <strong className="text-slate-200">{proj.areaHectares} ha</strong></span>
                    <span>GPS: {proj.centerCoordinate.lat}°N, {proj.centerCoordinate.lng}°E</span>
                  </div>

                  {proj.dominantSpecies && proj.dominantSpecies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.dominantSpecies.slice(0, 3).map((sp, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 italic">
                          {sp}
                        </span>
                      ))}
                      {proj.dominantSpecies.length > 3 && (
                        <span className="text-[10px] text-slate-500">+{proj.dominantSpecies.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-right">
                    <span className="text-slate-500 block text-[10px]">Issued Credits:</span>
                    <span className="text-emerald-400 font-bold text-lg">{proj.totalCreditsIssued.toLocaleString()} BCT</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/registry/${proj.id}`}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Public View
                    </Link>

                    <Link
                      href={`/developer/projects/${proj.id}`}
                      className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-teal-500/20 hover:scale-105"
                    >
                      <span>Manage & Ingest Telemetry</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="p-12 text-center glass-panel rounded-3xl space-y-3">
                <p className="text-slate-400 text-xs">No projects match the selected search or ecosystem filter.</p>
                <Link
                  href="/developer/projects/new"
                  className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold inline-block"
                >
                  Register New Project
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </RoleGuard>
  );
}
