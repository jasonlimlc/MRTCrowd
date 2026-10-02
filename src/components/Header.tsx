import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { MRTLine } from '../types/transit';

interface HeaderProps {
  lines: MRTLine[];
  onSelectLine: (line: MRTLine) => void;
  onOpenDownload: () => void;
  onOpenHealthMonitor: () => void;
  onCheckLiveCrowd?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lines,
  onSelectLine,
  onOpenDownload,
  onOpenHealthMonitor,
  onCheckLiveCrowd,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Live Ticker Bar */}
      <div
        className="bg-slate-900 border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-50 backdrop-blur-md bg-opacity-95"
        data-purpose="network-status-ticker"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-slate-300">
            <button
              onClick={onOpenHealthMonitor}
              className="flex items-center space-x-1.5 hover:text-white transition cursor-pointer group"
              title="Click to monitor /api/health live in browser"
            >
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 live-pulse"></span>
              <span className="font-semibold tracking-wide text-slate-200 uppercase text-[11px] group-hover:text-emerald-400 transition-colors">
                System Status: Normal Operations
              </span>
              <span className="text-[9px] bg-slate-800 text-emerald-400 px-1.5 py-0.2 rounded border border-slate-700 font-mono-numbers">
                API Health ↗
              </span>
            </button>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">
              Peak Hour Forecast Active
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto py-0.5 text-[11px] scrollbar-none">
            <span className="text-slate-400 font-medium whitespace-nowrap">Quick Line Status:</span>
            {lines.slice(0, 5).map((line) => {
              const bgClass =
                line.density === 'High'
                  ? 'bg-red-950/80 border-red-800/50 text-red-300'
                  : line.density === 'Moderate'
                  ? 'bg-amber-950/80 border-amber-800/50 text-amber-300'
                  : 'bg-emerald-950/80 border-emerald-800/50 text-emerald-300';
              const dotClass =
                line.density === 'High'
                  ? 'bg-red-500'
                  : line.density === 'Moderate'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500';

              return (
                <button
                  key={line.id}
                  onClick={() => onSelectLine(line)}
                  className={`inline-flex items-center px-2 py-0.5 rounded border ${bgClass} font-mono-numbers text-[10px] sm:text-[11px] hover:opacity-80 transition cursor-pointer whitespace-nowrap`}
                  title={`Click to view ${line.name} real-time crowd`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotClass} mr-1.5`}></span>
                  {line.code}: {line.density === 'Smooth' ? 'Low' : line.density}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-lg sticky top-[37px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Partner Badge */}
            <div className="flex items-center space-x-3">
              <a href="#" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-xl tracking-tighter shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
                  CW
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-white flex items-center">
                    CommuteWise{' '}
                    <span className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                      SG MRT
                    </span>
                  </span>
                </div>
              </a>
              <span className="hidden lg:inline-flex items-center text-[11px] text-slate-400 bg-slate-800/70 px-2.5 py-1 rounded-md border border-slate-700/60">
                Powered by LTA Open Data & Verified Commuters
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
              <button
                onClick={onCheckLiveCrowd}
                className="hover:text-sky-400 transition-colors cursor-pointer"
              >
                Live Crowd
              </button>
              <a href="#how-it-works" className="hover:text-sky-400 transition-colors">
                Best Leave Time
              </a>
              <a href="#community" className="hover:text-sky-400 transition-colors">
                Rider Verification
              </a>
              <a href="#enterprise" className="hover:text-sky-400 transition-colors">
                LTA & Enterprise
              </a>
              <a href="#pricing" className="hover:text-sky-400 transition-colors">
                Pricing
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onCheckLiveCrowd}
                className="hidden sm:inline-flex items-center text-xs font-semibold px-3.5 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all border border-slate-700 cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                Check Live Crowd
              </button>
              <button
                onClick={onOpenDownload}
                className="inline-flex items-center text-xs px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition shadow-lg shadow-sky-500/25 cursor-pointer whitespace-nowrap"
              >
                Download App
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 border border-slate-700"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onCheckLiveCrowd?.();
              }}
              className="w-full text-left block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Live Station Crowd
            </button>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Best Leave Time
            </a>
            <a
              href="#community"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Rider Verification Feed
            </a>
            <a
              href="#enterprise"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              LTA & Enterprise Portal
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              Pricing & Pro Pass
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenHealthMonitor();
                }}
                className="w-full text-center py-2 text-xs font-semibold rounded-lg bg-slate-800 text-emerald-400 border border-slate-700"
              >
                API Health Status (/api/health)
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

