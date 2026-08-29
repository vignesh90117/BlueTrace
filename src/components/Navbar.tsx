'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/components/RoleContext';
import { UserRole } from '@/types';
import { 
  Waves, 
  ShieldCheck, 
  TreePine, 
  Wallet, 
  BarChart3, 
  Layers, 
  Sparkles, 
  ChevronDown,
  Satellite,
  Navigation,
  Globe2,
  Activity,
  CheckCircle2,
  PlusCircle,
  FolderLock
} from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();
  const { role, setRole, walletAddress, userName } = useRole();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const rolesList = [
    { id: 'public' as UserRole, label: 'Public Observer', desc: 'Read-only registry & live blockchain ledger', icon: Waves, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
    { id: 'developer' as UserRole, label: 'Project Owner Workspace', desc: 'Manage plots, upload LiDAR/soil telemetry & edit boundaries', icon: TreePine, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { id: 'field_officer' as UserRole, label: 'Field Officer Workspace', desc: 'On-site ground-truth audits & Stage 2 sign-off/rejection', icon: Navigation, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { id: 'verifier' as UserRole, label: 'Independent Verifier Workspace', desc: 'Stage 3 auditor workbench & on-chain token minting', icon: ShieldCheck, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    { id: 'buyer' as UserRole, label: 'Credit Buyer / Offsetter', desc: 'Carbon credit portfolio, transfers & permanent retirement', icon: Wallet, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    { id: 'admin' as UserRole, label: 'Registry Admin Console', desc: 'Auditor accreditation & smart contract governance', icon: Layers, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  ];

  // STRICT ROLE-ISOLATED NAVIGATION LINKS
  const getNavLinksForRole = (currentRole: UserRole) => {
    switch (currentRole) {
      case 'developer':
        return [
          { href: '/', label: 'Overview' },
          { href: '/developer', label: 'My Projects Hub' },
          { href: '/developer/projects/new', label: '+ Register Plot' },
          { href: '/registry', label: 'Public Registry' },
          { href: '/transparency', label: 'Ledger' },
        ];
      case 'field_officer':
        return [
          { href: '/', label: 'Overview' },
          { href: '/field-officer', label: 'Field Inspection Queue' },
          { href: '/registry', label: 'Public Registry' },
          { href: '/transparency', label: 'Ledger' },
        ];
      case 'verifier':
        return [
          { href: '/', label: 'Overview' },
          { href: '/verifier', label: 'Auditor Workbench' },
          { href: '/registry', label: 'Public Registry' },
          { href: '/transparency', label: 'Ledger' },
        ];
      case 'buyer':
        return [
          { href: '/', label: 'Overview' },
          { href: '/portfolio', label: 'Credit Portfolio & Offsets' },
          { href: '/registry', label: 'Public Registry' },
          { href: '/transparency', label: 'Ledger' },
        ];
      case 'admin':
        return [
          { href: '/', label: 'Overview' },
          { href: '/admin', label: 'Admin Governance' },
          { href: '/registry', label: 'Public Registry' },
          { href: '/transparency', label: 'Ledger' },
        ];
      default: // public
        return [
          { href: '/', label: 'Overview' },
          { href: '/registry', label: 'Public Explorer' },
          { href: '/transparency', label: 'Blockchain Ledger' },
        ];
    }
  };

  const currentRoleObj = rolesList.find(r => r.id === role) || rolesList[0];
  const CurrentIcon = currentRoleObj.icon;
  const activeNavLinks = getNavLinksForRole(role);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-teal-500/20 bg-slate-950/85 backdrop-blur-xl shadow-lg shadow-slate-950/50">
      
      {/* Top micro status bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1 bg-gradient-to-r from-slate-950 via-teal-950/40 to-slate-950 border-b border-slate-850 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Polygon Mainnet / Local Sync: Connected
          </span>
          <span>•</span>
          <span className="text-slate-400">Isolated Workspace: <strong className="text-teal-300">{currentRoleObj.label}</strong></span>
          <span>•</span>
          <span className="flex items-center gap-1 text-sky-400">
            <Satellite className="w-3 h-3" /> Google Satellite: Live
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500">Active Gas: <strong className="text-slate-300">18 Gwei</strong></span>
          <span>•</span>
          <span className="text-slate-400">Block: <strong className="text-teal-400">#4893125</strong></span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-105 group-hover:shadow-teal-500/50 transition-all duration-300">
                <Waves className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight group-hover:text-teal-300 transition-colors">
                  AquaCarbon
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 border border-teal-500/30">
                  MRV
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase flex items-center gap-1">
                <span>Blue Carbon Registry</span>
              </p>
            </div>
          </Link>

          {/* Role-Specific Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {activeNavLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const activeClass = isActive
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium';
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={'px-3.5 py-1.5 rounded-lg text-xs transition-all ' + activeClass}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            
            {/* Workspace / Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 250)}
                className={'flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all shadow-sm ' + currentRoleObj.bg}
              >
                <CurrentIcon className={'w-4 h-4 ' + currentRoleObj.color} />
                <div className="text-left hidden sm:block">
                  <span className="text-[10px] text-slate-400 block font-mono leading-none">Active Workspace:</span>
                  <span className={'text-xs font-bold capitalize leading-tight ' + currentRoleObj.color}>
                    {currentRoleObj.label}
                  </span>
                </div>
                <ChevronDown className={'w-3.5 h-3.5 text-slate-400 transition-transform ' + (dropdownOpen ? 'rotate-180' : '')} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-2xl p-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Switch Role Workspace
                    </span>
                    <span className="text-[10px] font-mono text-teal-400">Isolated</span>
                  </div>

                  <div className="space-y-1">
                    {rolesList.map((r) => {
                      const Icon = r.icon;
                      const isSelected = role === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => {
                            setRole(r.id);
                            setDropdownOpen(false);
                          }}
                          className={'w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all ' + (
                            isSelected 
                              ? 'bg-teal-500/20 border border-teal-500/40 text-white' 
                              : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                          )}
                        >
                          <div className={'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ' + r.bg}>
                            <Icon className={'w-4 h-4 ' + r.color} />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold">{r.label}</span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />}
                            </div>
                            <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{r.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Wallet Address Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4)}</span>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
