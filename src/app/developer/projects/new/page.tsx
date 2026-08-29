'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { store } from '@/lib/store/registryStore';
import { useRole } from '@/components/RoleContext';
import { EcosystemType, GeoCoordinate } from '@/types';
import { DynamicMapViewer as MapViewer } from '@/components/DynamicMapViewer';
import { 
  TreePine, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  ShieldCheck,
  Navigation,
  Sparkles,
  Waves,
  Leaf,
  Layers,
  Sliders,
  Maximize2
} from 'lucide-react';

export default function NewProjectWizardPage() {
  const router = useRouter();
  const { walletAddress, userName } = useRole();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  // Step 1: Project Identity
  const [name, setName] = useState('');
  const [ecosystemType, setEcosystemType] = useState<EcosystemType>('Mangrove');
  const [country, setCountry] = useState('India');
  const [region, setRegion] = useState('');
  const [areaHectares, setAreaHectares] = useState(150);
  const [organization, setOrganization] = useState('Coastal Wetland Bio-Restoration Council');
  
  // Step 2: Location & Scaling
  const [centerLat, setCenterLat] = useState(21.8420);
  const [centerLng, setCenterLng] = useState(88.8250);
  const [boundaryScale, setBoundaryScale] = useState(1.0); // 0.5x to 3.0x scale multiplier

  // Step 3: Methodology & Species
  const [plantingStartDate, setPlantingStartDate] = useState('2025-01-15');
  const [methodology, setMethodology] = useState('VM0033 (Tidal Wetland Restoration)');
  const [speciesInput, setSpeciesInput] = useState('Rhizophora mucronata, Avicennia marina, Ceriops decandra');
  const [description, setDescription] = useState('');
  const [baselineSummary, setBaselineSummary] = useState('');

  // Preset ecosystem templates
  const ecosystemPresets = [
    { 
      type: 'Mangrove', 
      icon: '🌿', 
      defaultMethodology: 'VM0033 (Tidal Wetland Restoration)', 
      defaultSpecies: 'Rhizophora mucronata, Avicennia marina, Bruguiera gymnorhiza',
      desc: 'Intertidal forested wetland with high above-ground biomass and deep anoxic sediment carbon burial.' 
    },
    { 
      type: 'Seagrass', 
      icon: '🌊', 
      defaultMethodology: 'VM0033 / Verra Seagrass Meadow Methodology', 
      defaultSpecies: 'Zostera marina, Posidonia oceanica, Halodule wrightii',
      desc: 'Submerged marine angiosperm meadow with extreme benthic sediment carbon accumulation rates.' 
    },
    { 
      type: 'Salt Marsh', 
      icon: '🌾', 
      defaultMethodology: 'VM0033 (Tidal Salt Marsh Carbon Sequestration)', 
      defaultSpecies: 'Spartina alterniflora, Salicornia virginica, Juncus roemerianus',
      desc: 'Temperate and sub-tropical tidal saline herbaceous wetland with peat accumulation.' 
    },
    { 
      type: 'Coastal Wetland', 
      icon: '🪸', 
      defaultMethodology: 'AR-ACM0003 Coastal Wetland Restoration Protocol', 
      defaultSpecies: 'Phragmites australis, Typha domingensis, Scirpus maritimus',
      desc: 'Brackish and freshwater coastal marsh buffer with high sediment accretion.' 
    },
    { 
      type: 'Kelp Forest', 
      icon: '🌊', 
      defaultMethodology: 'Plan Vivo Marine Macroalgae Sequestration Standard', 
      defaultSpecies: 'Macrocystis pyrifera, Laminaria hyperborea, Ecklonia radiata',
      desc: 'Sub-tidal canopy macroalgae sequestering carbon and depositing biomass into deep ocean trenches.' 
    },
    { 
      type: 'Tidal Estuary', 
      icon: '💧', 
      defaultMethodology: 'Gold Standard Estuarine Sediment Carbon Accounting', 
      defaultSpecies: 'Kandelia obovata, Sonneratia alba, Aegiceras corniculatum',
      desc: 'River-ocean dynamic confluence zone trapping fluvial terrigenous organic carbon.' 
    }
  ];

  const handleSelectEcosystem = (item: typeof ecosystemPresets[0]) => {
    setEcosystemType(item.type);
    setMethodology(item.defaultMethodology);
    setSpeciesInput(item.defaultSpecies);
  };

  // Compute dynamic polygon coordinates based on center & boundary scale
  const dynamicCoordinates: GeoCoordinate[] = [
    { lat: Number((centerLat + 0.015 * boundaryScale).toFixed(5)), lng: Number((centerLng - 0.015 * boundaryScale).toFixed(5)) },
    { lat: Number((centerLat + 0.018 * boundaryScale).toFixed(5)), lng: Number((centerLng + 0.012 * boundaryScale).toFixed(5)) },
    { lat: Number((centerLat - 0.012 * boundaryScale).toFixed(5)), lng: Number((centerLng + 0.016 * boundaryScale).toFixed(5)) },
    { lat: Number((centerLat - 0.015 * boundaryScale).toFixed(5)), lng: Number((centerLng - 0.010 * boundaryScale).toFixed(5)) },
  ];

  // GPS Auto-Detection Handler
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported by your browser.');
      setTimeout(() => setGpsStatus(null), 4000);
      return;
    }

    setIsDetectingGps(true);
    setGpsStatus('Acquiring high-accuracy GPS fix from your device...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setCenterLat(Number(latitude.toFixed(5)));
        setCenterLng(Number(longitude.toFixed(5)));
        setIsDetectingGps(false);
        setGpsStatus(`GPS Fix Acquired: ${latitude.toFixed(5)}°N, ${longitude.toFixed(5)}°E (±${Math.round(accuracy)}m)`);
        setTimeout(() => setGpsStatus(null), 6000);
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsStatus(`GPS error: ${err.message}`);
        setTimeout(() => setGpsStatus(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // When scaling slider moves, dynamically adjust estimated hectares
  const handleScaleChange = (newScale: number) => {
    setBoundaryScale(newScale);
    const scaledArea = Math.round(150 * Math.pow(newScale, 2));
    setAreaHectares(scaledArea);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const species = speciesInput.split(',').map(s => s.trim()).filter(Boolean);
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const newProject = store.registerProject({
        name,
        slug,
        ecosystemType,
        country,
        region,
        areaHectares: Number(areaHectares),
        developerName: userName || 'Project Developer',
        developerWallet: walletAddress || '0x71C836052f5E3A68b1a45b854a23b185675e81f1',
        organization,
        plantingStartDate,
        methodology,
        dominantSpecies: species.length > 0 ? species : ['Coastal Blue Carbon Flora'],
        coordinates: dynamicCoordinates,
        centerCoordinate: { lat: centerLat, lng: centerLng },
        description: description || `Large-scale ${ecosystemType} coastal restoration project covering ${areaHectares} hectares.`,
        baselineSummary: baselineSummary || `Degraded coastal intertidal zone. Baseline carbon stock measured before restorative interventions.`,
      });

      setIsSubmitting(false);
      router.push(`/developer/projects/${newProject.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/developer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects Hub
        </Link>
        <span className="text-xs font-mono text-teal-400 font-bold">
          Step {step} of 3
        </span>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <TreePine className="w-3.5 h-3.5" /> Project Registration Wizard
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Register Blue Carbon Project
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Register any blue carbon project (Mangrove, Seagrass, Salt Marsh, Kelp, Wetlands) into the persistent blockchain registry with interactive location scaling.
        </p>
      </div>

      {/* Progress Pills */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono font-semibold">
        <div className={`p-3 rounded-2xl border transition-all ${step >= 1 ? 'bg-teal-500/15 border-teal-500/40 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
          1. Ecosystem & Name
        </div>
        <div className={`p-3 rounded-2xl border transition-all ${step >= 2 ? 'bg-teal-500/15 border-teal-500/40 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
          2. GPS & Location Scaling
        </div>
        <div className={`p-3 rounded-2xl border transition-all ${step >= 3 ? 'bg-teal-500/15 border-teal-500/40 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
          3. Species & Baseline
        </div>
      </div>

      {/* Form Canvas */}
      <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl glass-panel border border-teal-500/25 space-y-6 shadow-2xl">
        
        {/* STEP 1: Ecosystem & Identity */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Waves className="w-4 h-4 text-teal-400" /> Select Ecosystem Type
              </h3>
              <p className="text-xs text-slate-400 mb-3">Choose any blue carbon ecosystem category:</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ecosystemPresets.map((preset) => (
                  <button
                    type="button"
                    key={preset.type}
                    onClick={() => handleSelectEcosystem(preset)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      ecosystemType === preset.type 
                        ? 'bg-teal-500/20 border-teal-500/60 shadow-lg shadow-teal-500/10 text-white' 
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xl block mb-1">{preset.icon}</span>
                    <span className="text-xs font-bold block">{preset.type}</span>
                    <span className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gulf of Mannar Seagrass & Mangrove Bio-Shield"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Managing Organization *
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Initial Restoration Area (Hectares) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={areaHectares}
                    onChange={(e) => setAreaHectares(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white font-mono text-xs outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                disabled={!name}
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all"
              >
                <span>Continue to Location & Scaling</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Location, GPS & Interactive Boundary Scaling */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-400" /> Geographic Location & Boundary Scaling
                </h3>
                <p className="text-xs text-slate-400">Position the plot center, detect device GPS, and adjust the spatial boundary scaling slider.</p>
              </div>

              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isDetectingGps}
                className="px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 border border-sky-500/40 font-mono text-xs font-bold flex items-center gap-2 transition-all"
              >
                {isDetectingGps ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Detecting GPS...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5 fill-current" />
                    <span>Detect My Current GPS</span>
                  </>
                )}
              </button>
            </div>

            {gpsStatus && (
              <div className="p-3.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-mono flex items-center gap-2 animate-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{gpsStatus}</span>
              </div>
            )}

            {/* INTERACTIVE LOCATION SCALING SLIDER */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-teal-500/30 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-teal-300 flex items-center gap-2 font-mono uppercase">
                  <Sliders className="w-4 h-4 text-teal-400" /> Boundary Scaling & Spread Factor
                </label>
                <span className="text-xs font-mono font-bold text-white bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                  {boundaryScale.toFixed(2)}x Multiplier ({areaHectares} ha)
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Drag the slider to scale the boundary polygon spread and recalculate project coverage area in real-time:
              </p>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={boundaryScale}
                onChange={(e) => handleScaleChange(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.5x (Tight Core Plot)</span>
                <span>1.0x (Standard Wetland)</span>
                <span>2.0x (Regional Delta)</span>
                <span>3.0x (Macro Estuary)</span>
              </div>
            </div>

            {/* LIVE SATELLITE MAP PREVIEW */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 block font-mono">
                Live Google Satellite Boundary Preview:
              </span>
              <MapViewer
                coordinates={dynamicCoordinates}
                centerCoordinate={{ lat: centerLat, lng: centerLng }}
                projectName={name || 'New Project Boundary'}
                areaHectares={areaHectares}
                ndviScore={0.78}
                heightClass="h-72"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Region / State / Province *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tamil Nadu / West Bengal / Gujarat"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Center Latitude (°N) *
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={centerLat}
                  onChange={(e) => setCenterLat(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white font-mono text-xs outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Center Longitude (°E) *
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={centerLng}
                  onChange={(e) => setCenterLng(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white font-mono text-xs outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-850 text-slate-400 hover:text-white text-xs font-semibold"
              >
                ← Back
              </button>

              <button
                type="button"
                disabled={!region}
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all"
              >
                <span>Continue to Species & Methodology</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Methodology, Species & Baseline */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-teal-400" /> Carbon Methodology & Floral Inventory
              </h3>
              <p className="text-xs text-slate-400">Carbon standard methodology, dominant vegetation species, and baseline.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Methodology Standard *
                </label>
                <input
                  type="text"
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white font-mono text-xs outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Dominant Species (comma separated) *
                </label>
                <input
                  type="text"
                  value={speciesInput}
                  onChange={(e) => setSpeciesInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors italic"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Project Description & Restoration Plan
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the historical degradation, hydrology rehabilitation, and planting strategy..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Pre-Project Baseline Carbon Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Barren saline mudflat with pre-restoration carbon stock of 25.0 tC/ha."
                  value={baselineSummary}
                  onChange={(e) => setBaselineSummary(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-850 text-slate-400 hover:text-white text-xs font-semibold"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-slate-950 font-black text-xs shadow-xl shadow-teal-500/25 flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering On-Chain & Database...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Complete Registration & Save to Database</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </form>

    </div>
  );
}
