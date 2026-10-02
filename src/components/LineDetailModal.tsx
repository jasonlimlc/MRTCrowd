import React, { useState } from 'react';
import { X, Train, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { MRTLine } from '../types/transit';

interface LineDetailModalProps {
  line: MRTLine | null;
  onClose: () => void;
  onSelectStationByName?: (stationName: string) => void;
}

export const LineDetailModal: React.FC<LineDetailModalProps> = ({
  line,
  onClose,
  onSelectStationByName,
}) => {
  const [selectedDirection, setSelectedDirection] = useState<'dir1' | 'dir2'>('dir1');

  if (!line) return null;

  const currentTerminus = selectedDirection === 'dir1' ? line.direction1 : line.direction2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <span
              className="w-4 h-4 rounded-full inline-block shrink-0"
              style={{ backgroundColor: line.color }}
            ></span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {line.name} ({line.code})
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    line.density === 'High'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                      : line.density === 'Moderate'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {line.density}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{line.terminus}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direction Switcher */}
        <div className="px-5 py-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Bound Towards:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDirection('dir1')}
              className={`px-3 py-1 rounded-md transition cursor-pointer font-medium ${
                selectedDirection === 'dir1'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Towards {line.direction1}
            </button>
            <button
              onClick={() => setSelectedDirection('dir2')}
              className={`px-3 py-1 rounded-md transition cursor-pointer font-medium ${
                selectedDirection === 'dir2'
                  ? 'bg-slate-800 text-sky-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Towards {line.direction2}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Status Advisory */}
          <div className="p-3.5 bg-slate-800/50 border border-slate-700/60 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-sky-400" />
                Line Dispatch Status & Headways
              </span>
              <span className="text-emerald-400 font-mono-numbers">
                Next train in {line.nextTrainMin}m
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{line.statusMessage}</p>
            <div className="pt-1.5 flex items-center gap-2 text-[11px] text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Current Bottleneck: {line.bottleneck}</span>
            </div>
          </div>

          {/* Stations along the corridor */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Corridor Stations ({line.stations.length} Monitored)
              </h4>
              <span className="text-[11px] text-slate-500">Live platform load</span>
            </div>

            <div className="space-y-2">
              {line.stations.map((st, idx) => {
                const isHigh = st.crowd === 'High';
                const isMod = st.crowd === 'Moderate';
                const badgeStyle = isHigh
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : isMod
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

                return (
                  <div
                    key={st.code}
                    className="p-2.5 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs transition"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono-numbers text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 w-12 text-center">
                        {st.code}
                      </span>
                      <span className="text-white font-medium">{st.name}</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="text-[11px] text-slate-400 font-mono-numbers hidden sm:inline">
                        Wait: {st.waitMin} min
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeStyle}`}
                      >
                        {st.crowd}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            LTA Open Data API corridor telemetry synchronized
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
