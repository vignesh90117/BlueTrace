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
  RotateCcw
} from 'lucide-react';

interface MapViewerProps {
  coordinates: GeoCoordinate[];
  centerCoordinate: GeoCoordinate;
  projectName: string;
  areaHectares: number;
  ndviScore?: number;
  heightClass?: string;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  coordinates,
  centerCoordinate,
  projectName,
  areaHectares,
  ndviScore = 0.76,
  heightClass = 'h-[440px]'
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

  // Initialize and update Leaflet Map
  useEffect(() => {
    let isMounted = true;

    // Dynamically import Leaflet in client
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [centerCoordinate.lat, centerCoordinate.lng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Google Satellite / Hybrid / Terrain Tile URLs
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
        <div style="font-family: inherit; padding: 4px;">
          <div style="color: #2dd4bf; font-weight: bold; font-size: 13px; margin-bottom: 2px;">${projectName}</div>
          <div style="color: #94a3b8; font-size: 11px; margin-bottom: 4px;">Blue Carbon Protected Zone</div>
          <div style="background: rgba(15,23,42,0.8); padding: 6px; border-radius: 6px; font-family: monospace; font-size: 11px;">
            <div>Area: <strong style="color: #fff;">${areaHectares} Hectares</strong></div>
            <div>Sentinel-2 NDVI: <strong style="color: #34d399;">+${ndviScore.toFixed(2)}</strong></div>
            <div>Status: <strong style="color: #2dd4bf;">Verified On-Chain</strong></div>
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

      // If user location already detected, re-add user marker
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
  }, [coordinates, centerCoordinate, projectName, areaHectares, ndviScore, mapType, showNdvi]);

  // Helper to add User Location Marker on Map
  const addUserMarkerToMap = (L: any, map: any, lat: number, lng: number, accuracy: number) => {
    // Remove existing user marker & circle if any
    if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
    if (userAccuracyCircleRef.current) map.removeLayer(userAccuracyCircleRef.current);

    // Accuracy Circle
    const accuracyCircle = L.circle([lat, lng], {
      radius: Math.max(accuracy, 25),
      color: '#38bdf8',
      fillColor: '#38bdf8',
      fillOpacity: 0.15,
      weight: 1.5,
    }).addTo(map);
    userAccuracyCircleRef.current = accuracyCircle;

    // Glowing Animated User Location Beacon
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

  // Handle "Locate Me" Button Click
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
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Reset View to Project Plot
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
      {/* Real Interactive Leaflet Map Div */}
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

      {/* Top Left: Satellite Provider & Status Notifications */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-auto max-w-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/85 border border-teal-500/40 backdrop-blur-md text-xs font-mono text-slate-100 flex items-center gap-2 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Satellite className="w-4 h-4 text-teal-400" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">Google Satellite GIS</span>
            <span className="text-[10px] text-teal-300 bg-teal-950/90 px-1.5 py-0.5 rounded border border-teal-700/60 font-semibold">
              0.3m/px Live
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md text-xs font-mono font-bold text-emerald-400 shadow-xl">
            {areaHectares} Ha Protected Plot
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
              <span>{userLocation ? 'My GPS Location' : 'Locate Me'}</span>
            </>
          )}
        </button>

        {/* Reset View to Project Plot Button */}
        {userLocation && (
          <button
            onClick={handleResetToProject}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
            title="Reset view back to Mangrove Project Boundary"
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

          <button
            onClick={() => setMapType('google_terrain')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              mapType === 'google_terrain' 
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bathymetry
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
            <span className="text-slate-400">Sentinel-2 NDVI:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-bold">
              +{ndviScore.toFixed(2)} (High Vigor)
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
