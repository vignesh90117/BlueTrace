'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { store } from '@/lib/store/registryStore';
import { useRole } from '@/components/RoleContext';
import { RoleGuard } from '@/components/RoleGuard';
import { DynamicMapViewer as MapViewer } from '@/components/DynamicMapViewer';
import { ReviewStageTracker } from '@/components/ReviewStageTracker';
import { 
  Navigation, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  Sparkles,
  TreePine,
  Layers,
  Award,
  XCircle,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export default function FieldOfficerPage() {
  const { walletAddress, userName } = useRole();
  const [refreshKey, setRefreshKey] = useState(0);

  const projects = store.getProjects();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects.find(p => p.status === 'field_review' || p.status === 'submitted')?.id || projects[1]?.id || projects[0]?.id
  );

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Field Inspection Form State
  const [officerName, setOfficerName] = useState('Rajesh Sen');
  const [officerDesignation, setOfficerDesignation] = useState('Senior Coastal Ecosystem Field Officer');
  const [canopyVigor, setCanopyVigor] = useState(91.5);
  const [soilCoreRef, setSoilCoreRef] = useState('CORE-SAMP-2026-09');
  const [droneFlightRef, setDroneFlightRef] = useState('DRONE-SURVEY-FLIGHT-44');
  const [gpsVerified, setGpsVerified] = useState(true);
  const [speciesMatch, setSpeciesMatch] = useState(true);
  const [fieldNotes, setFieldNotes] = useState(
    'Ground-truth survey completed with Trimble RTK GPS (±1.5cm accuracy). Verified mangrove species composition and 0-100cm soil core bulk density with field chromatography kits.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successReport, setSuccessReport] = useState<any | null>(null);
  const [rejectionMessage, setRejectionMessage] = useState<string | null>(null);

  // Submit Approval
  const handleApproveField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    setIsSubmitting(true);
    setRejectionMessage(null);

    setTimeout(() => {
      try {
        const report = store.submitFieldInspection(
          selectedProject.id,
          officerName,
          walletAddress,
          officerDesignation,
          Number(canopyVigor),
          soilCoreRef,
          droneFlightRef,
          fieldNotes,
          'approved'
        );
        setIsSubmitting(false);
        setSuccessReport(report);
        setRefreshKey(k => k + 1); // Force immediate UI refresh
      } catch (err: any) {
        alert(err.message);
        setIsSubmitting(false);
      }
    }, 1200);
  };

  // Submit Rejection / Request Corrections
  const handleRejectField = () => {
    const reason = prompt('Enter the specific discrepancy or field correction requirement for the Project Owner:');
    if (!reason) return;

    setIsSubmitting(true);
    setSuccessReport(null);

    setTimeout(() => {
      try {
        const report = store.submitFieldInspection(
          selectedProject.id,
          officerName,
          walletAddress,
          officerDesignation,
          Number(canopyVigor),
          soilCoreRef,
          droneFlightRef,
          `REJECTED BY FIELD OFFICER: ${reason}`,
          'rejected'
        );
        setIsSubmitting(false);
        setRejectionMessage(`Project ${selectedProject.id} rejected. Feedback dispatched to Project Owner.`);
        setRefreshKey(k => k + 1); // Force immediate UI refresh
      } catch (err: any) {
        alert(err.message);
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <RoleGuard 
      allowedRoles={['field_officer']} 
      workspaceName="Field Officer Inspection Workbench" 
      requiredRoleLabel="Field Officer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 sm:p-10 rounded-3xl glass-panel border border-sky-500/30 bg-gradient-to-r from-slate-900 via-sky-950/30 to-slate-900 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Navigation className="w-3.5 h-3.5" /> Stage 2 • Field Ground-Truth Verification
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Field Officer Audit Workbench
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Inspect on-site coastal restoration plots, ground-truth GPS polygon boundaries, validate drone LiDAR flights, and stamp field verification reports.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 shadow-inner">
            <span className="text-slate-500 block text-[10px]">Active Officer:</span>
            <span className="text-sky-400 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> {userName}
            </span>
          </div>
        </div>

        {/* 3-Stage Lifecycle Tracker for Selected Project */}
        <ReviewStageTracker key={`tracker-${refreshKey}-${selectedProject.id}`} project={selectedProject} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Project Inspection Queue (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" /> Assigned Inspection Queue
              </h3>
              <span className="text-xs font-mono text-slate-400">{projects.length} Total</span>
            </div>

            <div className="space-y-3">
              {projects.map((proj) => {
                const isSelected = proj.id === selectedProjectId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setSuccessReport(null);
                      setRejectionMessage(null);
                    }}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-sky-950/40 border-sky-500/60 shadow-lg shadow-sky-500/10'
                        : 'glass-panel hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-950/60 border border-teal-800/40 px-2 py-0.5 rounded">
                        {proj.id}
                      </span>
                      {proj.status === 'credits_issued' ? (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Minted
                        </span>
                      ) : proj.status === 'field_approved' ? (
                        <span className="text-[10px] font-semibold text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Field Approved
                        </span>
                      ) : proj.status === 'rejected' ? (
                        <span className="text-[10px] font-semibold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          <Clock className="w-3 h-3" /> Awaiting Inspection
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">{proj.name}</h4>
                    <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono">
                      <span>{proj.region}</span>
                      <span>{proj.areaHectares} ha</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Ground-Truth Inspection Form & Live Map (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Project Details Banner */}
            <div className="p-6 rounded-3xl glass-panel border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-teal-400 block font-bold">PROJECT ID: {selectedProject.id}</span>
                <h2 className="text-xl font-black text-white tracking-tight">{selectedProject.name}</h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" /> {selectedProject.region}, {selectedProject.country} • Owner: <strong className="text-slate-200">{selectedProject.developerName}</strong>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-right">
                <span className="text-slate-500 block text-[10px]">Restoration Area:</span>
                <span className="text-white font-bold text-base">{selectedProject.areaHectares} Ha</span>
              </div>
            </div>

            {/* Interactive Google Satellite GIS Inspection */}
            <MapViewer
              coordinates={selectedProject.coordinates}
              centerCoordinate={selectedProject.centerCoordinate}
              projectName={selectedProject.name}
              areaHectares={selectedProject.areaHectares}
              ndviScore={selectedProject.telemetryData?.ndviMeanIndex || 0.78}
              heightClass="h-[380px]"
            />

            {/* Ground-Truth Checklist & Report Form */}
            <form onSubmit={handleApproveField} className="p-8 rounded-3xl glass-panel border border-sky-500/30 space-y-6 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-bold text-white">Stage 2 Field Ground-Truth Verification</h3>
                </div>

                <span className="text-xs font-mono text-sky-300 bg-sky-950/80 border border-sky-700/60 px-2.5 py-1 rounded-lg">
                  On-Site Attestation
                </span>
              </div>

              {successReport && (
                <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 animate-in zoom-in-95 duration-150">
                  <div className="font-bold flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" /> Field Ground-Truth Inspection Approved & Forwarded to Stage 3!
                  </div>
                  <div className="font-mono text-[11px] text-slate-300 break-all">
                    Field Report SHA-256 Hash: <strong className="text-teal-300">{successReport.fieldReportHash}</strong>
                  </div>
                </div>
              )}

              {rejectionMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in zoom-in-95 duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{rejectionMessage}</span>
                </div>
              )}

              {/* Checklist Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-sky-500/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={gpsVerified}
                    onChange={(e) => setGpsVerified(e.target.checked)}
                    className="w-4 h-4 accent-sky-400 rounded"
                  />
                  <span className="font-semibold text-slate-200">GPS Polygon Boundary Match (±2cm)</span>
                </label>

                <label className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-sky-500/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={speciesMatch}
                    onChange={(e) => setSpeciesMatch(e.target.checked)}
                    className="w-4 h-4 accent-sky-400 rounded"
                  />
                  <span className="font-semibold text-slate-200">Mangrove Floral Species Verified</span>
                </label>
              </div>

              {/* Field References Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Field Soil Core Sample Ref ID</label>
                  <input
                    type="text"
                    value={soilCoreRef}
                    onChange={(e) => setSoilCoreRef(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-white font-mono text-xs outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Drone LiDAR Flight Log Ref</label>
                  <input
                    type="text"
                    value={droneFlightRef}
                    onChange={(e) => setDroneFlightRef(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-white font-mono text-xs outline-none"
                    required
                  />
                </div>
              </div>

              {/* Canopy Vigor Score Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-300 font-semibold">Field Ground-Truth Canopy Vigor Score</span>
                  <span className="text-emerald-400 font-bold">{canopyVigor}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="0.5"
                  value={canopyVigor}
                  onChange={(e) => setCanopyVigor(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Field Notes */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Official Field Inspection Findings & Observations
                </label>
                <textarea
                  rows={3}
                  value={fieldNotes}
                  onChange={(e) => setFieldNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-sky-500 text-white text-xs outline-none transition-colors resize-none"
                  required
                />
              </div>

              {/* Submit Actions: APPROVE OR REJECT */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                
                {/* REJECT OPTION (Field Officer) */}
                <button
                  type="button"
                  onClick={handleRejectField}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject / Request Field Corrections</span>
                </button>

                {/* APPROVE OPTION */}
                <button
                  type="submit"
                  disabled={isSubmitting || !gpsVerified}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing Field Inspection...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4 stroke-[2.5]" />
                      <span>Stamp Approved & Advance to Stage 3 (Verifier)</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

        </div>

      </div>
    </RoleGuard>
  );
}
