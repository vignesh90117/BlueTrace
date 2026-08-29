'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { store } from '@/lib/store/registryStore';
import { DynamicMapViewer as MapViewer } from '@/components/DynamicMapViewer';
import { MRVCalculatorCard } from '@/components/MRVCalculatorCard';
import { ReviewStageTracker } from '@/components/ReviewStageTracker';
import { MangroveTelemetryInput } from '@/types';
import { 
  ArrowLeft, 
  TreePine, 
  MapPin, 
  Cpu, 
  UploadCloud, 
  FileCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Loader2,
  Info,
  Satellite,
  Layers,
  Sliders,
  Edit3,
  Navigation,
  X,
  AlertCircle,
  Save
} from 'lucide-react';

export default function DeveloperProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const project = store.getProjectById(id) || store.getProjects()[0];

  // Telemetry Input State
  const [dbh, setDbh] = useState(project.telemetryData?.averageDbhCm || 15.2);
  const [treeDensity, setTreeDensity] = useState(project.telemetryData?.treeDensityPerHa || 1350);
  const [woodDensity, setWoodDensity] = useState(project.telemetryData?.woodDensityGcm3 || 0.74);
  const [canopyHeight, setCanopyHeight] = useState(project.telemetryData?.canopyHeightMeters || 8.2);
  const [soilBulkDensity, setSoilBulkDensity] = useState(project.telemetryData?.soilBulkDensityGcm3 || 1.18);
  const [soilOrganicCarbon, setSoilOrganicCarbon] = useState(project.telemetryData?.soilOrganicCarbonPercent || 3.65);
  const [baselineStock, setBaselineStock] = useState(project.telemetryData?.baselineCarbonStockPerHa || 38.5);
  const [ndvi, setNdvi] = useState(project.telemetryData?.ndviMeanIndex || 0.78);

  const [isCalculating, setIsCalculating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit Location Modal State
  const [isEditLocationOpen, setIsEditLocationOpen] = useState(false);
  const [editLat, setEditLat] = useState(project?.centerCoordinate?.lat ?? 21.8400);
  const [editLng, setEditLng] = useState(project?.centerCoordinate?.lng ?? 88.8425);
  const [editArea, setEditArea] = useState(project?.areaHectares ?? 150);
  const [editRegion, setEditRegion] = useState(project?.region ?? 'Coastal Region');
  const [editCountry, setEditCountry] = useState(project?.country ?? 'India');
  const [isGpsDetecting, setIsGpsDetecting] = useState(false);
  const [locationSuccessMsg, setLocationSuccessMsg] = useState<string | null>(null);

  const handleRunMRV = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setSuccessMessage(null);

    setTimeout(() => {
      const telemetry: MangroveTelemetryInput = {
        averageDbhCm: Number(dbh),
        treeDensityPerHa: Number(treeDensity),
        woodDensityGcm3: Number(woodDensity),
        canopyHeightMeters: Number(canopyHeight),
        soilBulkDensityGcm3: Number(soilBulkDensity),
        soilOrganicCarbonPercent: Number(soilOrganicCarbon),
        soilDepthSampledCm: 100,
        ndwiWaterIndex: 0.42,
        ndviMeanIndex: Number(ndvi),
        baselineCarbonStockPerHa: Number(baselineStock),
        monitoringYear: 2026,
      };

      store.uploadTelemetryAndCalculate(project.id, telemetry);
      setIsCalculating(false);
      setSuccessMessage('MRV calculation executed successfully! Project forwarded to Stage 2 Field Officer Review.');
    }, 1000);
  };

  // GPS Auto-detect for Project Owner
  const handleOwnerDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported by your browser.');
      return;
    }
    setIsGpsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setEditLat(Number(pos.coords.latitude.toFixed(5)));
        setEditLng(Number(pos.coords.longitude.toFixed(5)));
        setIsGpsDetecting(false);
      },
      (err) => {
        alert('GPS error: ' + err.message);
        setIsGpsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Save Location Handler
  const handleSaveLocation = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      store.updateProjectLocation(
        project.id,
        Number(editLat),
        Number(editLng),
        Number(editArea),
        editRegion,
        editCountry
      );
      setLocationSuccessMsg('Project GIS coordinates & boundary polygon updated on-chain!');
      setTimeout(() => {
        setLocationSuccessMsg(null);
        setIsEditLocationOpen(false);
      }, 1500);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Breadcrumb Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/developer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Developer Projects
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
            {project.id}
          </span>
          {project.status === 'credits_issued' ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Stage 3: Credits Minted
            </span>
          ) : project.status === 'field_approved' ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Stage 2: Field Approved
            </span>
          ) : project.status === 'rejected' ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" /> Inspection Rejected / Corrections Needed
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> In Review Pipeline
            </span>
          )}
        </div>
      </div>

      {/* Hero Card with Edit Location Action */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-teal-500/20 space-y-4 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block mb-1 font-mono">
              {project.ecosystemType} Restoration • {project.organization}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {project.name}
            </h1>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-teal-400" /> {project.region}, {project.country} — Area: <strong className="text-white">{project.areaHectares} ha</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* EDIT LOCATION BUTTON (Owner Access) */}
            <button
              onClick={() => setIsEditLocationOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-teal-300 border border-teal-500/40 text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-md"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Project Location & Boundary</span>
            </button>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-slate-300 text-right shadow-inner">
              <span className="text-slate-400 block text-[10px]">Issued Carbon Credits:</span>
              <span className="text-emerald-400 font-bold text-xl">{project.totalCreditsIssued.toLocaleString()} BCT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection Alert Box (if rejected by Field Officer or Verifier) */}
      {project.status === 'rejected' && (
        <div className="p-6 rounded-3xl bg-rose-950/30 border border-rose-500/40 text-xs space-y-2 text-rose-300 shadow-xl animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-2 text-sm text-rose-400 font-mono">
              <AlertCircle className="w-4 h-4" /> Discrepancies Noted During Inspection / Audit
            </span>
            <button
              onClick={() => setIsEditLocationOpen(true)}
              className="px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors"
            >
              Correct Location & Resubmit →
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            {project.fieldInspection?.fieldNotes || 'Field Officer or Auditor requested corrections to spatial boundary coordinates and soil core depth baseline.'}
          </p>
        </div>
      )}

      {/* 3-Stage Progress Tracker */}
      <ReviewStageTracker project={project} />

      {/* FULL SATELLITE MAP VIEWER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Satellite className="w-4 h-4 text-teal-400" /> High-Resolution Google Satellite GIS Inspection
          </h3>
          <span className="text-xs font-mono text-slate-400">Live Boundary Overlay: {project.areaHectares} ha</span>
        </div>

        <MapViewer
          coordinates={project.coordinates}
          centerCoordinate={project.centerCoordinate}
          projectName={project.name}
          areaHectares={project.areaHectares}
          ndviScore={ndvi}
          heightClass="h-[440px]"
        />
      </div>

      {/* Form & Telemetry Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Telemetry Form (8 cols) */}
        <div className="lg:col-span-8">
          <form onSubmit={handleRunMRV} className="p-8 rounded-3xl glass-panel border border-teal-500/30 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Ingest Field & Drone Telemetry</h3>
                  <p className="text-xs text-slate-400">Computes Above-Ground, Root Biomass & Soil Organic Carbon</p>
                </div>
              </div>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 rounded-lg font-semibold">
                VM0033 IPCC Tier-2
              </span>
            </div>

            {successMessage && (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in zoom-in-95 duration-150">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            )}

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Average DBH (Trunk cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={dbh}
                  onChange={(e) => setDbh(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white font-mono text-xs outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Komiyama allometric model</span>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Tree Density (Trees / ha)</label>
                <input
                  type="number"
                  value={treeDensity}
                  onChange={(e) => setTreeDensity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white font-mono text-xs outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">From drone LiDAR point cloud</span>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Species Wood Density ρ (g/cm³)</label>
                <input
                  type="number"
                  step="0.01"
                  value={woodDensity}
                  onChange={(e) => setWoodDensity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white font-mono text-xs outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Rhizophora standard ~0.74</span>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">LiDAR Canopy Height (meters)</label>
                <input
                  type="number"
                  step="0.1"
                  value={canopyHeight}
                  onChange={(e) => setCanopyHeight(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white font-mono text-xs outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Drone survey 2026</span>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Soil Bulk Density (g/cm³)</label>
                <input
                  type="number"
                  step="0.01"
                  value={soilBulkDensity}
                  onChange={(e) => setSoilBulkDensity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white font-mono text-xs outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Soil core lab test (0-100cm)</span>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Soil Organic Carbon (% TOC)</label>
                <input
                  type="number"
                  step="0.05"
                  value={soilOrganicCarbon}
                  onChange={(e) => setSoilOrganicCarbon(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white font-mono text-xs outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Gas chromatography TOC</span>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Baseline Carbon Stock (tC/ha)</label>
                <input
                  type="number"
                  step="0.1"
                  value={baselineStock}
                  onChange={(e) => setBaselineStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white font-mono text-xs outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Pre-restoration measurement</span>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Sentinel-2 NDVI Mean Score</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={ndvi}
                  onChange={(e) => setNdvi(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white font-mono text-xs outline-none"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">Canopy vigor index</span>
              </div>

            </div>

            {/* Run Action Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-teal-400 shrink-0" /> Applies 15% Permanence Buffer automatically
              </span>

              <button
                type="submit"
                disabled={isCalculating}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-slate-950 font-extrabold text-xs shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Computing MRV Model...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 stroke-[2.5]" />
                    <span>Run MRV Engine & Submit to Stage 2 Field Review</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right: Attached Evidence Files (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl glass-panel space-y-4 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Attached Field Evidence</h4>
              <span className="text-[11px] font-mono text-teal-400">{project.evidenceFiles.length} files</span>
            </div>
            
            <div className="space-y-2.5">
              {project.evidenceFiles.map((ev) => (
                <div key={ev.id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-200 block truncate max-w-[180px]">{ev.title}</span>
                    <span className="text-[10px] font-mono text-teal-400">IPFS: {ev.ipfsHash.slice(0, 12)}...</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{ev.fileSizeMb} MB</span>
                </div>
              ))}
              {project.evidenceFiles.length === 0 && (
                <p className="text-xs text-slate-500 py-2">No files attached yet. Telemetry will generate default manifests.</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Dynamic MRV Results Card */}
      <MRVCalculatorCard
        telemetry={project.telemetryData}
        mrvResult={project.mrvResult}
        areaHectares={project.areaHectares}
      />

      {/* EDIT LOCATION MODAL */}
      {isEditLocationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-teal-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Project GIS Location & Boundary</h3>
                  <p className="text-xs text-slate-400">Project Owner Authorized Spatial Mapping</p>
                </div>
              </div>

              <button
                onClick={() => setIsEditLocationOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {locationSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{locationSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveLocation} className="space-y-4 text-xs">
              
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300">Spatial Coordinates</span>
                <button
                  type="button"
                  onClick={handleOwnerDetectGPS}
                  disabled={isGpsDetecting}
                  className="px-3 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 border border-sky-500/40 font-mono text-[11px] font-bold flex items-center gap-1.5"
                >
                  {isGpsDetecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3 fill-current" />}
                  <span>Detect My Current GPS Location</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="text-slate-400 block mb-1">Center Lat (°N) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editLat}
                    onChange={(e) => setEditLat(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Center Lng (°E) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editLng}
                    onChange={(e) => setEditLng(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Area (Hectares) *</label>
                  <input
                    type="number"
                    min="1"
                    value={editArea}
                    onChange={(e) => setEditArea(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Region / State *</label>
                  <input
                    type="text"
                    value={editRegion}
                    onChange={(e) => setEditRegion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Country *</label>
                  <input
                    type="text"
                    value={editCountry}
                    onChange={(e) => setEditCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white outline-none"
                    required
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] leading-relaxed">
                Saving will re-anchor the GIS polygon on the blockchain and automatically re-calculate carbon stock for the updated {editArea} ha area.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditLocationOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-teal-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Update GIS Polygon</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
