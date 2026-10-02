import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface EnterpriseSectionProps {
  onRequestApiAccess: () => void;
}

export const EnterpriseSection: React.FC<EnterpriseSectionProps> = ({ onRequestApiAccess }) => {
  return (
    <section
      className="py-16 sm:py-20 bg-slate-950 border-t border-slate-800"
      data-purpose="b2b-lta-partnerships"
      id="enterprise"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#101b33] border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-950/80 px-3 py-1 rounded-md border border-sky-800/50">
                For Transit Operators & B2B Partners
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Enterprise Corridor Intelligence & LTA Analytics
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Designed for public transit coordinators, major corporate campus mobility managers,
                and retail operators along interchange concourses. Access aggregated anonymized flow
                rates and predict corridor surges before they happen.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0"></div>
                  <span>Station Concourse Capacity Heatmaps</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0"></div>
                  <span>Monthly Corridor Density Reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0"></div>
                  <span>Dedicated Account Manager (10+ Corp Accounts)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0"></div>
                  <span>Real-Time Webhook & REST Data Feeds</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onRequestApiAccess}
                  className="inline-flex items-center px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition cursor-pointer group"
                >
                  <span>Request Transit Operator API Access</span>
                  <ArrowRight className="w-4 h-4 ml-1.5 text-sky-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Enterprise Stat Metrics */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition">
                <p className="text-2xl sm:text-3xl font-bold font-mono-numbers text-white">140+</p>
                <p className="text-xs text-slate-400 mt-1">MRT & LRT Stations Modelled</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition">
                <p className="text-2xl sm:text-3xl font-bold font-mono-numbers text-sky-400">99.8%</p>
                <p className="text-xs text-slate-400 mt-1">Cloud Model Uptime</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition">
                <p className="text-2xl sm:text-3xl font-bold font-mono-numbers text-emerald-400">
                  15 min
                </p>
                <p className="text-xs text-slate-400 mt-1">Predictive Surge Window</p>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition">
                <p className="text-2xl sm:text-3xl font-bold font-mono-numbers text-amber-400">
                  LTA Feeds
                </p>
                <p className="text-xs text-slate-400 mt-1">Seamless Official Sync</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
