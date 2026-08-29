import React from 'react';
import Link from 'next/link';
import { Waves, Shield, CheckCircle2, FileCode, Github, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-850 bg-slate-950 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-bold">
                <Waves className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-bold text-white text-base">AquaCarbon MRV</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Next-generation decentralized Blue Carbon Registry and automated Measurement, Reporting & Verification (MRV) engine for coastal wetland ecosystems.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-md w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Polygon Mainnet / Local Testnet Live
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Methodologies & MRV</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Verra VM0033 Tidal Wetlands
              </li>
              <li className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> IPCC Tier 2 Coastal Biomass
              </li>
              <li className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Komiyama Allometric Models
              </li>
              <li className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Soil Core Chromatography TOC
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Smart Contracts</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <span className="text-slate-500 block text-[10px]">Registry Contract:</span>
                <span className="text-slate-300 hover:text-teal-400 cursor-pointer flex items-center gap-1">
                  0x9B41...E89a <ExternalLink className="w-3 h-3 text-slate-500" />
                </span>
              </li>
              <li>
                <span className="text-slate-500 block text-[10px]">Carbon Credit Token (BCT):</span>
                <span className="text-slate-300 hover:text-teal-400 cursor-pointer flex items-center gap-1">
                  0x27C1...78B4 <ExternalLink className="w-3 h-3 text-slate-500" />
                </span>
              </li>
              <li>
                <span className="text-slate-500 block text-[10px]">Retirement Proof Ledger:</span>
                <span className="text-slate-300 hover:text-teal-400 cursor-pointer flex items-center gap-1">
                  0x6e28...9812 <ExternalLink className="w-3 h-3 text-slate-500" />
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Registry Roles</h4>
            <div className="space-y-1.5 text-xs">
              <Link href="/registry" className="block hover:text-teal-300 transition-colors">Public Explorer & Transparency</Link>
              <Link href="/developer" className="block hover:text-teal-300 transition-colors">Developer Project Management</Link>
              <Link href="/verifier" className="block hover:text-teal-300 transition-colors">Auditor & Verifier Workbench</Link>
              <Link href="/portfolio" className="block hover:text-teal-300 transition-colors">Credit Portfolio & Retirement Hub</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 AquaCarbon Blue Carbon Registry & MRV Protocol. Built for Smart India Hackathon & Environmental Integrity.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400"><Shield className="w-3.5 h-3.5 text-teal-400" /> Anti-Double-Counting Guard Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
