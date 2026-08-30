'use client';

import React, { useEffect, useRef, useState } from 'react';
import { GeoCoordinate } from '@/types';
import { 
  Satellite, 
  Layers, 
  MapPin, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Crosshair, 
  Navigation, 
  Loader2, 
  Compass, 
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw,
  Coins,
  Flame,
  ArrowRight
} from 'lucide-react';

export interface MapViewerProps {
  coordinates: GeoCoordinate[];
  centerCoordinate: GeoCoordinate;
  projectName: string;
  areaHectares: number;
  ndviScore?: number;
  heightClass?: string;
  creditsAvailable?: number;
  creditsIssued?: number;
  status?: string;
  batchId?: string;
  projectId?: string;
  ecosystemType?: string;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  coordinates,
  centerCoordinate,
  projectName,
  areaHectares,
  ndviScore = 0.76,
  heightClass = 'h-[440px]',
  creditsAvailable,
  creditsIssued,
  status,
  batchId,
  projectId,
  ecosystemType = 'Mangrove'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const userAccuracyCircleRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);

  const [mapType, setMapType] = useState<'google_satellite' | 'google_hybrid' | 'google_terrain' | 'osm'>('google_satellite');
  const [showNdvi, setShowNdvi] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cursorPos, setCursorPos] = useState<GeoCoordinate>(centerCoordinate);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  const activeCredits = creditsAvailable ?? creditsIssued ?? (status === 'credits_issued' ? Math.round(areaHectares * 45.5) : 0);

  // Initialize and update Leaflet Map
  useEffect(() => {
    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [centerCoordinate.lat, centerCoordinate.lng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      const tileLayers: Record<string, any> = {
        google_satellite: L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }),
        google_hybrid: L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }),
        google_terrain: L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }),
        osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }),
      };

      tileLayers[mapType].addTo(map);

      // Create Custom SVG Polygon Boundary for Blue Carbon Plot
      const latLngs = coordinates.map((c) => [c.lat, c.lng] as [number, number]);
      
      const polygon = L.polygon(latLngs, {
        color: '#2dd4bf',
        weight: 3,
        opacity: 0.9,
        fillColor: '#10b981',
        fillOpacity: showNdvi ? 0.35 : 0.2,
        dashArray: '6, 6',
      }).addTo(map);

      polygonRef.current = polygon;

      polygon.bindPopup(`
        <div style="font-family: inherit; padding: 6px; min-width: 220px;">
          <div style="color: #2dd4bf; font-weight: bold; font-size: 14px; margin-bottom: 2px;">${projectName}</div>
          <div style="color: #94a3b8; font-size: 11px; margin-bottom: 6px;">${ecosystemType} Blue Carbon Protected Zone</div>
          <div style="background: rgba(15,23,42,0.9); padding: 8px; border-radius: 8px; font-family: monospace; font-size: 11px; border: 1px solid rgba(45,212,191,0.3);">
            <div style="margin-bottom: 3px;">Area: <strong style="color: #fff;">${areaHectares} Hectares</strong></div>
            <div style="margin-bottom: 3px;">Sentinel-2 NDVI: <strong style="color: #34d399;">+${ndviScore.toFixed(2)}</strong></div>
            <div style="color: #10b981; font-weight: bold; margin-top: 4px; border-top: 1px solid #334155; pt: 4px;">
              🪙 ${activeCredits > 0 ? activeCredits.toLocaleString() + ' BCT Available' : 'MRV Verified Plot'}
            </div>
          </div>
        </div>
      `);

      // =========================================================================
      // PROMINENT ON-MAP CARBON CREDIT AVAILABILITY BEACON (Pinned at Center)
      // =========================================================================
      const hasCredits = activeCredits > 0;
      const creditBadgeHtml = `
        <div style="
          position: relative; 
          display: flex; 
          align-items: center; 
          gap: 6px; 
          background: rgba(3, 7, 18, 0.92); 
          border: 2px solid ${hasCredits ? '#10b981' : '#2dd4bf'}; 
          padding: 6px 12px; 
          border-radius: 9999px; 
          box-shadow: 0 0 20px ${hasCredits ? 'rgba(16, 185, 129, 0.6)' : 'rgba(45, 212, 191, 0.4)'}; 
          cursor: pointer;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          font-family: inherit;
        ">
          <!-- Pulsing Ring -->
          <div style="
            position: absolute; 
            inset: -4px; 
            border-radius: 9999px; 
            background: ${hasCredits ? 'rgba(16, 185, 129, 0.25)' : 'rgba(45, 212, 191, 0.25)'}; 
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            pointer-events: none;
          "></div>

          <div style="
            width: 20px; 
            height: 20px; 
            border-radius: 50%; 
            background: linear-gradient(135deg, #10b981, #06b6d4); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 11px;
            font-weight: 900;
            color: #030712;
            box-shadow: 0 0 10px #10b981;
          ">
            🪙
          </div>

          <div style="display: flex; flex-direction: column; line-height: 1.1;">
            <span style="font-size: 11px; font-weight: 900; color: #ffffff; letter-spacing: -0.01em;">
              ${hasCredits ? activeCredits.toLocaleString() + ' BCT' : 'Carbon Credits'}
            </span>
            <span style="font-size: 9px; font-weight: 700; color: ${hasCredits ? '#34d399' : '#38bdf8'}; font-family: monospace;">
              ${hasCredits ? '● Available to Buy/Retire' : '● Verified Plot'}
            </span>
          </div>
        </div>
      `;

      const creditBeaconIcon = L.divIcon({
        className: 'carbon-credit-beacon',
        html: creditBadgeHtml,
        iconSize: [160, 36],
        iconAnchor: [80, 18],
      });

      const centerBeaconMarker = L.marker([centerCoordinate.lat, centerCoordinate.lng], { 
        icon: creditBeaconIcon, 
        zIndexOffset: 500 
      }).addTo(map);

      centerBeaconMarker.bindPopup(`
        <div style="font-family: inherit; padding: 6px; min-width: 240px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="font-size: 14px;">🪙</span>
            <strong style="color: #34d399; font-size: 13px;">Blue Carbon Credits Verified</strong>
          </div>
          <div style="color: #ffffff; font-size: 13px; font-weight: bold; margin-bottom: 2px;">${projectName}</div>
          <div style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">${ecosystemType} • ${areaHectares} Ha Protected</div>
          
          <div style="background: rgba(15,23,42,0.95); padding: 8px; border-radius: 8px; font-family: monospace; font-size: 11px; border: 1px solid rgba(16,185,129,0.3); margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #94a3b8;">Available Stock:</span>
              <strong style="color: #34d399;">${hasCredits ? activeCredits.toLocaleString() + ' BCT' : 'Ready for Mint'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
              <span style="color: #94a3b8;">Batch ID:</span>
              <strong style="color: #38bdf8;">${batchId || 'BCT-2026-V1-001'}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #94a3b8;">Methodology:</span>
              <strong style="color: #e2e8f0;">IPCC VM0033</strong>
            </div>
          </div>

          <div style="display: flex; gap: 6px;">
            <a href="/portfolio" style="flex: 1; text-align: center; background: #10b981; color: #030712; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none;">
              Buy / Retire
            </a>
            ${projectId ? `
              <a href="/registry/${projectId}" style="flex: 1; text-align: center; background: #1e293b; color: #e2e8f0; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; text-decoration: none; border: 1px solid #334155;">
                View Dossier
              </a>
            ` : ''}
          </div>
        </div>
      `);

      // Add Glowing Vertex Markers
      coordinates.forEach((coord, idx) => {
        const vertexIcon = L.divIcon({
          className: 'custom-vertex-marker',
          html: `
            <div style="
              width: 12px; 
              height: 12px; 
              background: #38bdf8; 
              border: 2px solid #042f2e; 
              border-radius: 50%; 
              box-shadow: 0 0 10px #38bdf8;
            "></div>
          `,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        const marker = L.marker([coord.lat, coord.lng], { icon: vertexIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: monospace; font-size: 11px;">
            <strong style="color: #38bdf8;">GPS Boundary Point #${idx + 1}</strong><br/>
            Lat: ${coord.lat.toFixed(6)}°N<br/>
            Lng: ${coord.lng.toFixed(6)}°E
          </div>
        `);
      });

      // Track cursor position
      map.on('mousemove', (e: any) => {
        setCursorPos({ lat: e.latlng.lat, lng: e.latlng.lng });
      });

      if (userLocation) {
        addUserMarkerToMap(L, map, userLocation.lat, userLocation.lng, userLocation.accuracy);
      } else {
        map.fitBounds(polygon.getBounds(), { padding: [40, 40] });
      }

      setIsLoaded(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, centerCoordinate, projectName, areaHectares, ndviScore, mapType, showNdvi, activeCredits]);

  // Helper to add User Location Marker on Map
  const addUserMarkerToMap = (L: any, map: any, lat: number, lng: number, accuracy: number) => {
    if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
    if (userAccuracyCircleRef.current) map.removeLayer(userAccuracyCircleRef.current);

    const accuracyCircle = L.circle([lat, lng], {
      radius: Math.max(accuracy, 25),
      color: '#38bdf8',
      fillColor: '#38bdf8',
      fillOpacity: 0.15,
      weight: 1.5,
    }).addTo(map);
    userAccuracyCircleRef.current = accuracyCircle;

    const userBeaconIcon = L.divIcon({
      className: 'user-location-beacon',
      html: `
        <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 24px; height: 24px; background: rgba(56, 189, 248, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 14px; height: 14px; background: #38bdf8; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 14px #38bdf8; z-index: 10;"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const userMarker = L.marker([lat, lng], { icon: userBeaconIcon, zIndexOffset: 1000 }).addTo(map);
    userMarkerRef.current = userMarker;

    userMarker.bindPopup(`
      <div style="font-family: inherit; padding: 4px;">
        <div style="color: #38bdf8; font-weight: bold; font-size: 13px; margin-bottom: 2px;">📍 Your Current Location</div>
        <div style="background: rgba(15,23,42,0.85); padding: 6px; border-radius: 6px; font-family: monospace; font-size: 11px; margin-top: 4px;">
          <div>Lat: <strong style="color: #fff;">${lat.toFixed(6)}°N</strong></div>
          <div>Lng: <strong style="color: #fff;">${lng.toFixed(6)}°E</strong></div>
          <div>Accuracy: <strong style="color: #34d399;">±${Math.round(accuracy)}m</strong></div>
        </div>
      </div>
    `).openPopup();

    map.flyTo([lat, lng], 16, { duration: 1.5 });
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      setTimeout(() => setLocationStatus(null), 4000);
      return;
    }

    setIsLocating(true);
    setLocationStatus('Acquiring GPS fix from your device...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const loc = { lat: latitude, lng: longitude, accuracy };
        setUserLocation(loc);
        setIsLocating(false);
        setLocationStatus(`Located! GPS accuracy ±${Math.round(accuracy)}m`);
        setTimeout(() => setLocationStatus(null), 5000);

        if (mapInstanceRef.current) {
          import('leaflet').then((L) => {
            addUserMarkerToMap(L, mapInstanceRef.current, latitude, longitude, accuracy);
          });
        }
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus(`Location error: ${err.message}`);
        setTimeout(() => setLocationStatus(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleResetToProject = () => {
    if (mapInstanceRef.current && polygonRef.current) {
      mapInstanceRef.current.fitBounds(polygonRef.current.getBounds(), { padding: [40, 40] });
    }
  };

  return (
    <div 
      className={`relative w-full ${heightClass} ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen rounded-none' : 'rounded-3xl'
      } overflow-hidden border border-teal-500/30 glass-panel shadow-2xl transition-all duration-300`}
    >
      {/* Interactive Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 bg-slate-950/90 flex items-center justify-center backdrop-blur-md">
          <div className="flex items-center gap-3 text-sm font-mono text-teal-300">
            <Satellite className="w-5 h-5 text-teal-400 animate-spin" />
            <span>Streaming Google Satellite Multispectral Imagery...</span>
          </div>
        </div>
      )}

      {/* Top Left: Carbon Credits Available Badge & Satellite HUD */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-auto max-w-sm">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Carbon Credit Indicator Chip */}
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-emerald-500/50 backdrop-blur-md text-xs font-mono text-white flex items-center gap-2 shadow-2xl shadow-emerald-500/20">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <Coins className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-emerald-300">
              {activeCredits > 0 ? `${activeCredits.toLocaleString()} BCT Available` : 'MRV Verified Plot'}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950/85 border border-teal-500/40 backdrop-blur-md text-xs font-mono text-slate-100 flex items-center gap-1.5 shadow-xl">
            <Satellite className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-bold text-white uppercase text-[10px]">Google Satellite GIS</span>
          </div>
        </div>

        {locationStatus && (
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/95 border border-sky-500/50 backdrop-blur-md text-xs font-mono text-sky-300 shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
            <Navigation className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>{locationStatus}</span>
          </div>
        )}
      </div>

      {/* Top Right: Layer Switcher & Controls */}
      <div className="absolute top-4 right-4 z-[400] flex items-center gap-2 bg-slate-950/90 border border-slate-800 rounded-2xl p-1.5 backdrop-blur-md shadow-2xl pointer-events-auto">
        
        {/* Locate Me GPS Button */}
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
            userLocation 
              ? 'bg-sky-500 text-slate-950 shadow-sky-500/20' 
              : 'bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-slate-950 border border-sky-500/40'
          }`}
          title="Locate my position on the Google Satellite map via GPS"
        >
          {isLocating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Locating...</span>
            </>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5 fill-current" />
              <span>{userLocation ? 'My GPS' : 'Locate Me'}</span>
            </>
          )}
        </button>

        {userLocation && (
          <button
            onClick={handleResetToProject}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
            title="Reset view back to Project Boundary"
          >
            <RotateCcw className="w-4 h-4 text-teal-400" />
          </button>
        )}

        {/* Google Satellite Mode Buttons */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMapType('google_satellite')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              mapType === 'google_satellite' 
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>

          <button
            onClick={() => setMapType('google_hybrid')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              mapType === 'google_hybrid' 
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hybrid
          </button>
        </div>

        {/* NDVI Overlay Toggle Button */}
        <button
          onClick={() => setShowNdvi(!showNdvi)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
            showNdvi 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md shadow-emerald-500/20' 
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
          title="Toggle Sentinel-2 NDVI Multispectral Health Heatmap"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>NDVI</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Bottom Status HUD */}
      <div className="absolute bottom-4 inset-x-4 z-[400] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 backdrop-blur-md text-xs shadow-2xl pointer-events-auto">
        
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-teal-400">
            <Crosshair className="w-4 h-4 text-teal-400 animate-spin" />
            <span>GPS Cursor: <strong className="text-white">{cursorPos.lat.toFixed(5)}°N, {cursorPos.lng.toFixed(5)}°E</strong></span>
          </div>

          <span className="hidden md:inline text-slate-700">|</span>

          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Center: {centerCoordinate.lat.toFixed(4)}°N, {centerCoordinate.lng.toFixed(4)}°E</span>
          </div>

          {userLocation && (
            <>
              <span className="hidden md:inline text-slate-700">|</span>
              <div className="flex items-center gap-1.5 text-sky-400">
                <Navigation className="w-3.5 h-3.5 fill-current" />
                <span>You: {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Stock Availability:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-bold flex items-center gap-1">
              <Coins className="w-3 h-3 text-emerald-400" />
              {activeCredits > 0 ? `${activeCredits.toLocaleString()} BCT` : 'Verified'}
            </span>
          </div>

          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="text-teal-300 hidden sm:inline flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Polygon Anchored
          </span>
        </div>

      </div>

    </div>
  );
};
