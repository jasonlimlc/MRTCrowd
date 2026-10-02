import React, { useState } from 'react';
import { MRTLine } from '../types/transit';

interface LineMonitorProps {
  lines: MRTLine[];
  onSelectLine: (line: MRTLine) => void;
}

export const LineMonitor: React.FC<LineMonitorProps> = ({ lines, onSelectLine }) => {
  const [filter, setFilter] = useState<'ALL' | 'High' | 'Moderate' | 'Smooth'>('ALL');

  const filteredLines = lines.filter((line) => {
    if (filter === 'ALL') return true;
    return line.density === filter;
  });

  return (
    <section
      className="py-16 bg-slate-900/40 border-t border-slate-800"
      data-purpose="line-status-explorer"
      id="line-monitor"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Network Corridors
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Live MRT Line Density Monitor
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Filter segmented buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer font-medium ${
                  filter === 'ALL'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Lines
              </button>
              <button
                onClick={() => setFilter('High')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer font-medium ${
                  filter === 'High'
                    ? 'bg-red-950/80 text-red-300 border border-red-800/40'
                    : 'text-slate-400 hover:text-red-400'
                }`}
              >
                High Congestion
              </button>
              <button
                onClick={() => setFilter('Moderate')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer font-medium ${
                  filter === 'Moderate'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                    : 'text-slate-400 hover:text-amber-400'
                }`}
              >
                Moderate
              </button>
              <button
                onClick={() => setFilter('Smooth')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer font-medium ${
                  filter === 'Smooth'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
              >
                Smooth
              </button>
            </div>

            {/* Legend */}
            <div className="hidden sm:flex items-center space-x-3 text-xs text-slate-400">
              <span className="flex items-center">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span>
                <span>Low</span>
              </span>
              <span className="flex items-center">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span>
                <span>Moderate</span>
              </span>
              <span className="flex items-center">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 mr-1.5"></span>
                <span>High Density</span>
              </span>
            </div>
          </div>
        </div>

        {/* Line Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLines.map((line) => {
            const badgeBg =
              line.density === 'High'
                ? 'bg-red-500/20 text-red-300 border-red-500/40'
                : line.density === 'Moderate'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

            return (
              <div
                key={line.id}
                onClick={() => onSelectLine(line)}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden hover:border-slate-700 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer group shadow-lg"
              >
                {/* Official MRT colored side stripe */}
                <div
                  className="absolute top-0 left-0 bottom-0 w-1.5 transition-all group-hover:w-2"
                  style={{ backgroundColor: line.color }}
                ></div>

                <div className="flex items-center justify-between pl-2">
                  <div>
                    <span
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: line.color }}
                    >
                      {line.name} ({line.code})
                    </span>
                    <h4 className="text-white font-semibold text-base mt-0.5 group-hover:text-sky-300 transition-colors">
                      {line.terminus}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badgeBg}`}>
                    {line.density}
                  </span>
                </div>

                <div className="mt-4 pl-2 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate pr-2">Peak Bottleneck: {line.bottleneck}</span>
                  <span className="font-mono-numbers text-slate-300 shrink-0">
                    Next train: {line.nextTrainMin} min
                  </span>
                </div>

                <div className="mt-3 pl-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-sky-400 transition-colors">
                  <span>{line.stationsCount} Stations active</span>
                  <span>Click to inspect line corridor →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
