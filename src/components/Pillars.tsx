import React from 'react';
import { Users, TrendingUp, Bell, CheckCircle2, ArrowRight } from 'lucide-react';

interface PillarsProps {
  onOpenDigest: () => void;
  onExploreLines: () => void;
  onExploreCommunity: () => void;
}

export const Pillars: React.FC<PillarsProps> = ({
  onOpenDigest,
  onExploreLines,
  onExploreCommunity,
}) => {
  return (
    <section
      className="py-16 sm:py-20 bg-[#080D1A] border-t border-slate-800/80"
      data-purpose="features-overview"
      id="how-it-works"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-sky-400 text-xs font-bold tracking-wider uppercase bg-sky-950/60 px-3 py-1 rounded-full border border-sky-800/40">
            Built For The Daily Commute
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How CommuteWise keeps you moving ahead
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Translating complex transit telemetry and commuter intelligence into stress-free travel
            decisions twice a day.
          </p>
        </div>

        {/* Feature Grid: 4 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Live MRT Crowd Heatmaps */}
          <div
            onClick={onExploreLines}
            className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-amber-500/40 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            data-purpose="feature-card"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Live MRT Crowd Heatmaps
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Real-time passenger density tracking for North-South, East-West, Downtown, Circle,
                and TEL platforms.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-amber-400 font-medium">
              <span>Color coded: Green, Amber, Red</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* Pillar 2: AI Best Leave Time */}
          <div
            onClick={onExploreLines}
            className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-sky-500/40 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            data-purpose="feature-card"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                AI "Best Leave Time"
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Smart predictive models adjust for rain delays, signal hold-ups, and sudden peak surges
                so you time your departure perfectly.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-sky-400 font-medium">
              <span>Morning & Evening touchpoints</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* Pillar 3: Two Touchpoints a Day */}
          <div
            onClick={onOpenDigest}
            className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-purple-500/40 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            data-purpose="feature-card"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Two Touchpoints a Day
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                A prompt before morning commute and another before heading home, plus a consolidated
                weekly summary of saved minutes.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-purple-400 font-medium">
              <span>Automated alerts & weekly recap</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          {/* Pillar 4: Rider-to-Rider Feedback */}
          <div
            onClick={onExploreCommunity}
            className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            data-purpose="feature-card"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                Commuter Verification
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Riders confirm or correct crowd reports directly on Telegram & the app, keeping data
                hyper-accurate while minimizing overhead.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>Decentralized crowd moderation</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
