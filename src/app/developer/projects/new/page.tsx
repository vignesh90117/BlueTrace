'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { store } from '@/lib/store/registryStore';
import { useRole } from '@/components/RoleContext';
import { EcosystemType } from '@/types';
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
  Sparkles
} from 'lucide-react';

export default function NewProjectWizardPage() {
  const router = useRouter();
  const { walletAddress, userName } = useRole();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [ecosystemType, setEcosystemType] = useState<EcosystemType>('Mangrove');
  const [country, setCountry] = useState('India');
  const [region, setRegion] = useState('');
  const [areaHectares, setAreaHectares] = useState(150);
  const [organization, setOrganization] = useState('Deltaic Coastal Conservation Trust');
  const [plantingStartDate, setPlantingStartDate] = useState('2025-01-15');
  const [methodology, setMethodology] = useState('VM0033 (Tidal Wetland Restoration)');
  const [speciesInput, setSpeciesInput] = useState('Rhizophora mucronata, Avicennia marina, Bruguiera gymnorhiza');
  const [description, setDescription] = useState('');
  const [baselineSummary, setBaselineSummary] = useState('');
  const [centerLat, setCenterLat] = useState(21.8500);
  const [centerLng, setCenterLng] = useState(88.8500);

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
        setGpsStatus(`GPS Acquired: ${latitude.toFixed(5)}°N, ${longitude.toFixed(5)}°E (±${Math.round(accuracy)}m)`);
        setTimeout(() => setGpsStatus(null), 6000);
      },
      (err) => {
        setIsDetectingGps(false);
        setGpsStatus(`GPS error: ${err.message}`);
        setTimeout(() => setGpsStatus(null), 4000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const species = speciesInput.split(',').map(s => s.trim()).filter(Boolean);
      
      const coords = [
        { lat: centerLat + 0.015, lng: centerLng - 0.015 },
        { lat: centerLat + 0.018, lng: centerLng + 0.012 },
        { lat: centerLat - 0.012, lng: centerLng + 0.016 },
        { lat: centerLat - 0.015, lng: centerLng - 0.010 },
      ];

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const newProject = store.registerProject({
        name,
        slug,
        ecosystemType,
        country,
        region,
        areaHectares: Number(areaHectares),
        developerName: userName,
        developerWallet: walletAddress,
        organization,
        plantingStartDate,
        methodology,
        dominantSpecies: species,
        coordinates: coords,
        centerCoordinate: { lat: centerLat, lng: centerLng },
        description: description || 'Tidal mangrove ecological restoration initiative restoring degraded coastal wetland sediment.',
        baselineSummary: baselineSummary || 'Degraded coastal saline mudflat with baseline soil organic carbon under 22.0 tC/ha.',
      });

      setIsSubmitting(false);
      router.push('/developer/projects/' + newProject.id);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between">
        <Link
          href="/developer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Back to Dashboard
        </Link>
        <span className="text-xs font-mono text-teal-400">Step {step} of 3</span>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Register New Blue Carbon Project
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Anchor a new coastal restoration project to the decentralized registry.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className={`h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-teal-500' : 'bg-slate-800'}`} />
        <div className={`h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-teal-500' : 'bg-slate-800'}`} />
        <div className={`h-1.5 rounded-full transition-colors ${step >= 3 ? 'bg-teal-500' : 'bg-slate-800'}`} />
      </div>

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
        
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TreePine className="w-4 h-4 text-emerald-400" /> 1. Project Details & Ecosystem
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Project Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Godavari Estuarine Mangrove Biosphere Project"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Ecosystem Type *</label>
                <select
                  value={ecosystemType}
                  onChange={(e) => setEcosystemType(e.target.value as EcosystemType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors cursor-pointer"
                >
                  <option value="Mangrove">Mangroves</option>
                  <option value="Seagrass">Seagrass Meadows</option>
                  <option value="Salt Marsh">Salt Marshes</option>
                  <option value="Coastal Wetland">Coastal Wetland</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Methodology Standard *</label>
                <input
                  type="text"
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Country *</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Region / State *</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Andhra Pradesh, India"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Developer Organization</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors"
                required
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" /> 2. GIS Location & Spatial Boundary
              </h3>

              {/* Detect My GPS Location Button */}
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isDetectingGps}
                className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 border border-sky-500/40 text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-sm w-fit"
              >
                {isDetectingGps ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Acquiring GPS...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5 fill-current" />
                    <span>Detect My Current GPS Location</span>
                  </>
                )}
              </button>
            </div>

            {gpsStatus && (
              <div className="p-3 rounded-xl bg-slate-900 border border-sky-500/40 text-xs font-mono text-sky-300 flex items-center gap-2 animate-in fade-in duration-150">
                <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{gpsStatus}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Area (Hectares) *</label>
                <input
                  type="number"
                  min="1"
                  value={areaHectares}
                  onChange={(e) => setAreaHectares(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs font-mono outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Center Latitude (°N) *</label>
                <input
                  type="number"
                  step="0.0001"
                  value={centerLat}
                  onChange={(e) => setCenterLat(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs font-mono outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Center Longitude (°E) *</label>
                <input
                  type="number"
                  step="0.0001"
                  value={centerLng}
                  onChange={(e) => setCenterLng(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs font-mono outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Target Dominant Species</label>
              <input
                type="text"
                value={speciesInput}
                onChange={(e) => setSpeciesInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" /> 3. Ecological Baseline & Submission
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Project Scope & Ecological Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the coastal wetland restoration strategy..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Pre-Restoration Baseline Soil & Carbon Summary</label>
              <textarea
                rows={2}
                value={baselineSummary}
                onChange={(e) => setBaselineSummary(e.target.value)}
                placeholder="Historical vegetation degradation, baseline carbon stock (tC/ha)..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-teal-500 text-white text-xs outline-none transition-colors resize-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Registering this project creates an immutable smart contract record on Polygon testnet. Once registered, you will be able to upload drone LiDAR point clouds and soil core tests to run the MRV engine.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
            >
              ← Previous Step
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              type="button"
              disabled={!name && step === 1}
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !name}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Recording On-Chain...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Register & Anchor On-Chain</span>
                </>
              )}
            </button>
          )}
        </div>

      </form>

    </div>
  );
}
