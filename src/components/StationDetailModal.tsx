import React from 'react';
import { X, Clock, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { StationData } from '../types/transit';
import { calculateLiveDeparture } from '../utils/transitTime';

interface StationDetailModalProps {
  station: StationData | null;
  onClose: () => void;
  onSelectStation: (stationId: string) => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  onClose,
}) => {
  if (!station) return null;

  const liveInfo = calculateLiveDeparture(
    station.id,
    station.crowdLevel,
    station.minutesSaved
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              {station.lines.map((c, i) => (
                <span
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full ${i > 0 ? '-ml-1' : ''}`}
                  style={{ backgroundColor: c }}
                ></span>
              ))}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {station.name}{' '}
                <span className="text-xs font-mono-numbers px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {station.code}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Concourse Telemetry & Platform Car Breakdown
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Real-time recommendation banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/80 to-slate-900 border border-sky-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                Optimized Departure Advice
              </span>
              <p className="text-white font-bold text-base mt-0.5">
                Leave at {liveInfo.departureTime} (Save {liveInfo.minutesSaved} mins)
              </p>
              <p className="text-xs text-slate-300 mt-1">{liveInfo.advice}</p>
            </div>
            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4 shrink-0">
              <span className="text-xs text-slate-400 block">Current Density</span>
              <span
                className={`text-xl font-black font-mono-numbers ${
                  station.crowdPercentage > 75
                    ? 'text-red-400'
                    : station.crowdPercentage > 50
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
              >
                {station.crowdPercentage}%
              </span>
            </div>
          </div>

          {/* Platform & Concourse Status */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Platform & Flow Dynamics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Primary Platform Direction</span>
                <span className="text-white font-semibold text-xs mt-0.5 block">
                  {station.currentPlatform}
                </span>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Concourse Flow</span>
                  <span className="text-emerald-400 font-medium">Brisk & Moving</span>
                </div>
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <span className="text-slate-400 block text-[11px]">Best Boarding Strategy</span>
                <span className="text-emerald-400 font-bold text-xs mt-0.5 block">
                  {station.bestCarsAdvice}
                </span>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Fare Gate Queue</span>
                  <span className="text-slate-300">&lt; 30 seconds</span>
                </div>
              </div>
            </div>
          </div>

          {/* Train Car Occupancy Detail */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Train Car Seating & Crowding (Next Arriving Train)
              </h4>
              <span className="text-[11px] text-emerald-400 font-medium">Next Train: 2 mins</span>
            </div>
            <div className="grid grid-cols-6 gap-2 text-center text-xs">
              {station.carFullness.map((car) => {
                const isPacked = car.level === 'Packed';
                const isMod = car.level === 'Moderate';
                const color = isPacked
                  ? 'border-red-500/60 bg-red-500/10 text-red-300'
                  : isMod
                  ? 'border-amber-500/60 bg-amber-500/10 text-amber-300'
                  : 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300';

                return (
                  <div key={car.car} className={`p-2 rounded-xl border ${color} space-y-1`}>
                    <p className="font-bold font-mono-numbers">{car.car}</p>
                    <p className="text-[10px] font-mono-numbers font-semibold">{car.percentage}%</p>
                    <p className="text-[9px] text-slate-400">
                      {car.seatsEstimate > 0 ? `~${car.seatsEstimate} seats` : 'Stand only'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Crowd Verification Feed */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
              <span className="font-semibold text-sky-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                Latest Commuter Verification
              </span>
              <span className="font-mono-numbers">{station.recentReport.timeAgo}</span>
            </div>
            <p className="text-slate-200 italic">"{station.recentReport.quote}"</p>
            <div className="mt-2 text-[10px] text-slate-400">
              Verified by {station.recentReport.upvotes} commuters on platform concourse.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Data refreshes every 15s from LTA DataMall & crowd sensors
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
