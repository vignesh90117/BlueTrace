'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store/registryStore';
import { ProjectStatus } from '@/types';
import { DynamicMapViewer as MapViewer } from '@/components/DynamicMapViewer';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Coins,
  Satellite,
  Waves
} from 'lucide-react';

export default function RegistryExplorerPage() {
  const [search, setSearch] = useState('');
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const projects = store.getProjects();
  const featured = projects.find(p => p.status === 'credits_issued') || projects[0];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.region.toLowerCase().includes(search.toLowerCase()) ||
      p.organization.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());

    const matchesEcosystem = selectedEcosystem === 'all' || p.ecosystemType === selectedEcosystem;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;

    return matchesSearch && matchesEcosystem && matchesStatus;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'credits_issued':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Credits Issued
          </span>
        );
      case 'field_approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Field Verified
          </span>
        );
      case 'under_review':
      case 'field_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
            <Clock className="w-3.5 h-3.5" /> In Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            Registered
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-1">Public Registry Explorer</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Blue Carbon Registry & GIS Explorer
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Explore registered coastal restoration projects. Look for glowing <strong className="text-emerald-400">🪙 Carbon Credit Beacons</strong> on the map indicating verified BCT tokens ready for purchase or retirement.
        </p>
      </div>

      {/* SATELLITE GIS MAP WITH CARBON CREDIT AVAILABILITY BEACON */}
      {featured && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
              <Satellite className="w-4 h-4 text-teal-400" /> Featured Active Plot Satellite GIS
            </h3>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
              <Coins className="w-3.5 h-3.5" />
              {(featured.totalCreditsIssued - featured.totalCreditsRetired).toLocaleString()} BCT Available Here
            </span>
          </div>

          <MapViewer
            coordinates={featured.coordinates}
            centerCoordinate={featured.centerCoordinate}
            projectName={featured.name}
            areaHectares={featured.areaHectares}
            ndviScore={featured.telemetryData?.ndviMeanIndex || 0.78}
            heightClass="h-[420px]"
            creditsAvailable={featured.totalCreditsIssued - featured.totalCreditsRetired}
            creditsIssued={featured.totalCreditsIssued}
            status={featured.status}
            batchId={featured.blockchainTx?.issuedTokenBatchId}
            projectId={featured.id}
            ecosystemType={featured.ecosystemType}
          />
        </div>
      )}

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project name, location, ID, or developer..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedEcosystem}
            onChange={(e) => setSelectedEcosystem(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Ecosystem Types</option>
            <option value="Mangrove">Mangroves</option>
            <option value="Seagrass">Seagrass Meadows</option>
            <option value="Salt Marsh">Salt Marshes</option>
            <option value="Coastal Wetland">Coastal Wetlands</option>
            <option value="Kelp Forest">Kelp Forests</option>
            <option value="Tidal Estuary">Tidal Estuaries</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors cursor-pointer"
          >
            <option value="all">All Verification Statuses</option>
            <option value="credits_issued">Credits Issued</option>
            <option value="field_approved">Field Approved</option>
            <option value="field_review">In Review</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="p-6 rounded-3xl glass-panel flex flex-col justify-between hover:border-teal-500/40 transition-all group border border-slate-800"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-[11px] text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded-md font-bold">
                  {project.id}
                </span>
                {getStatusBadge(project.status)}
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2 mb-2">
                {project.name}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{project.region}, {project.country}</span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                {project.description}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-850">
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/60">
                  <span className="text-slate-500 block text-[10px]">Protected Area</span>
                  <span className="text-white font-bold">{project.areaHectares} ha</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/60">
                  <span className="text-slate-500 block text-[10px]">Available Credits</span>
                  <span className="text-emerald-400 font-bold">
                    {(project.totalCreditsIssued - project.totalCreditsRetired).toLocaleString()} BCT
                  </span>
                </div>
              </div>

              <Link
                href={'/registry/' + project.id}
                className="w-full py-2.5 rounded-xl bg-slate-850 hover:bg-teal-500 text-slate-300 hover:text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span>View Public Project Profile & Map</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="p-12 text-center rounded-3xl glass-panel border-dashed border-slate-800">
          <p className="text-sm text-slate-400">No blue carbon projects match your search filters.</p>
        </div>
      )}

    </div>
  );
}
