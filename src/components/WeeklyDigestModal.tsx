import React from 'react';
import { X, Award, Clock, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';

interface WeeklyDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyDigestModal: React.FC<WeeklyDigestModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Weekly Commute Digest</h3>
              <p className="text-xs text-purple-300">Sunday Summary • Week 39</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Big Stat Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-sky-900/30 border border-purple-800/40 text-center">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
              Total Commute Transit Time Saved
            </span>
            <span className="text-4xl font-extrabold text-white font-mono-numbers mt-1 block">
              74 mins
            </span>
            <span className="text-xs text-emerald-400 mt-1 inline-flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18% better than average SG commuter
            </span>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <span className="text-slate-400 text-[10px] block">Crush Hours Bypassed</span>
              <span className="text-lg font-bold text-white font-mono-numbers mt-0.5 block">
                9 of 10
              </span>
              <span className="text-[10px] text-slate-400">Crowded cabins avoided</span>
            </div>
            <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <span className="text-slate-400 text-[10px] block">Seat Probability</span>
              <span className="text-lg font-bold text-sky-400 font-mono-numbers mt-0.5 block">
                78%
              </span>
              <span className="text-[10px] text-slate-400">Boarding Car 1 or 6</span>
            </div>
          </div>

          {/* Daily Highlights */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Week in Review
            </h4>
            <div className="space-y-1.5">
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex justify-between items-center text-[11px]">
                <span className="text-slate-300">Mon 18:24 (Jurong East)</span>
                <span className="text-emerald-400 font-mono-numbers font-semibold">
                  Saved 14 mins
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex justify-between items-center text-[11px]">
                <span className="text-slate-300">Tue 07:52 (Bishan → City Hall)</span>
                <span className="text-emerald-400 font-mono-numbers font-semibold">
                  Saved 11 mins
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex justify-between items-center text-[11px]">
                <span className="text-slate-300">Thu 18:35 (Serangoon CCL)</span>
                <span className="text-emerald-400 font-mono-numbers font-semibold">
                  Saved 16 mins
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 text-[11px] text-slate-300 flex items-center justify-between">
            <span>Next Week Forecast: Heavy rain surge expected Wed evening</span>
            <span className="text-sky-400 font-semibold">Pre-set alert enabled</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition cursor-pointer text-xs border border-slate-700"
          >
            Close Digest
          </button>
        </div>
      </div>
    </div>
  );
};
