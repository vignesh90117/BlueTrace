'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { GeoCoordinate } from '@/types';
import { Satellite } from 'lucide-react';

interface MapViewerProps {
  coordinates: GeoCoordinate[];
  centerCoordinate: GeoCoordinate;
  projectName: string;
  areaHectares: number;
  ndviScore?: number;
  heightClass?: string;
}

const LeafletMap = dynamic(
  () => import('@/components/MapViewer').then((mod) => mod.MapViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-96 rounded-3xl bg-slate-950/80 border border-teal-500/30 flex items-center justify-center backdrop-blur-md">
        <div className="flex items-center gap-3 text-sm font-mono text-teal-300 animate-pulse">
          <Satellite className="w-5 h-5 text-teal-400 animate-spin" />
          <span>Loading Google Satellite GIS Plot...</span>
        </div>
      </div>
    ),
  }
);

export const DynamicMapViewer: React.FC<MapViewerProps> = (props) => {
  return <LeafletMap {...props} />;
};
