import React, { useState, useEffect } from 'react';
import { Clock, ThumbsUp, Bell, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import { StationData } from '../types/transit';
import { calculateLiveDeparture, LiveDepartureInfo } from '../utils/transitTime';

interface HeroProps {
  currentStation: StationData;
  allStations: Record<string, StationData>;
  onSelectStation: (stationId: string) => void;
  onOpenStationDetail: (station: StationData) => void;
  onTriggerAlarmSimulation: () => void;
  onCheckLiveCrowd?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  currentStation,
  allStations,
  onSelectStation,
  onOpenStationDetail,
  onTriggerAlarmSimulation,
  onCheckLiveCrowd,
}) => {
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [upvotes, setUpvotes] = useState(currentStation.recentReport.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [liveInfo, setLiveInfo] = useState<LiveDepartureInfo>(() =>
    calculateLiveDeparture(
      currentStation.id,
      currentStation.crowdLevel,
      currentStation.minutesSaved
    )
  );

  // Update real-time Singapore Time and live departure calculations continuously every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveInfo(
        calculateLiveDeparture(
          currentStation.id,
          currentStation.crowdLevel,
          currentStation.minutesSaved,
          now
        )
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentStation.id, currentStation.crowdLevel, currentStation.minutesSaved]);

  // Sync upvotes when station changes
  useEffect(() => {
    setUpvotes(currentStation.recentReport.upvotes);
    setHasUpvoted(false);
    setSelectedCar(null);
  }, [currentStation.id]);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
    }
  };

  const handleCheckCrowdAction = () => {
    setIsScanning(true);
    const widgetEl = document.getElementById('crowd-widget');
    if (widgetEl) {
      widgetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const selectEl = document.getElementById('station-select') as HTMLSelectElement | null;
    selectEl?.focus();

    if (onCheckLiveCrowd) {
      onCheckLiveCrowd();
    }

    setTimeout(() => {
      setIsScanning(false);
    }, 1500);
  };

  return (
    <section
      className="relative pt-10 sm:pt-14 pb-20 overflow-hidden bg-gradient-to-b from-[#080D1A] via-[#0D1527] to-[#080D1A]"
      data-purpose="hero-container"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Reliable Predictions • Official Data & Crowdsourced Verification</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Never squeeze into a packed MRT cabin again.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              CommuteWise forecasts MRT station crowding, cabin occupancy, and pinpoint departure
              times. Designed for working adults and students who want a seamless morning and evening
              commute across Singapore.
            </p>

            {/* Core Action / Touchpoint Notification Snapshot */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                type="button"
                onClick={handleCheckCrowdAction}
                className="inline-flex justify-center items-center px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm shadow-xl shadow-sky-500/20 transition cursor-pointer active:scale-95 group"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2 animate-pulse"></span>
                <span>{isScanning ? 'Querying LTA Real-Time...' : 'Check Live Station Crowd'}</span>
              </button>
              <a
                href="#how-it-works"
                className="inline-flex justify-center items-center px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition cursor-pointer"
              >
                See How Forecasts Work
              </a>
            </div>

            {/* Trust Badges & Partner Alignment */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-slate-400 text-xs">
              <div>
                <p className="text-white font-bold text-lg font-mono-numbers">2x Daily</p>
                <p className="mt-0.5">Commute notifications at 07:45 & 18:00</p>
              </div>
              <div>
                <p className="text-white font-bold text-lg font-mono-numbers">15-Min</p>
                <p className="mt-0.5">Predictive crowd horizon with 94.2% accuracy</p>
              </div>
              <div>
                <p className="text-white font-bold text-lg font-mono-numbers">100% Free</p>
                <p className="mt-0.5">Ad-supported tier + Premium commute passes</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Crowd Preview Widget */}
          <div className="lg:col-span-5" data-purpose="live-mrt-preview-widget" id="crowd-widget">
            <div
              className={`relative bg-slate-900/90 border rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                isScanning
                  ? 'border-sky-400 ring-2 ring-sky-400 shadow-sky-500/30 scale-[1.01]'
                  : 'border-slate-800'
              }`}
            >
              {/* Scan Bar Indicator */}
              {isScanning && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-400 rounded-t-2xl animate-pulse"></div>
              )}
              {/* Widget Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {currentStation.lines.map((c, i) => (
                      <span
                        key={i}
                        className={`w-3 h-3 rounded-full ${i > 0 ? '-ml-1' : ''}`}
                        style={{ backgroundColor: c }}
                      ></span>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-white ml-1">
                    {currentStation.name} ({currentStation.code})
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[11px] font-mono-numbers text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 flex items-center shadow-inner">
                    <Clock className="w-3 h-3 mr-1 text-sky-400" />
                    {liveInfo.sgtTime}
                  </span>
                </div>
              </div>

              {/* Best Leave Time AI Recommendation */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-sky-950/70 via-slate-900 to-slate-900 border border-sky-800/40 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-semibold text-sky-300 uppercase tracking-wide">
                      Recommended Departure
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50 font-mono-numbers">
                    {liveInfo.waitBadgeText}
                  </span>
                </div>
                <p className="text-lg font-bold text-white mt-1.5">
                  Leave at{' '}
                  <span className="text-sky-400 font-mono-numbers">
                    {liveInfo.departureTime}
                  </span>{' '}
                  to save {liveInfo.minutesSaved} mins
                </p>
                <p className="text-xs text-slate-400 mt-1">{liveInfo.advice}</p>
              </div>

              {/* Platform Density Status */}
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium truncate max-w-[240px]">
                    {currentStation.currentPlatform}
                  </span>
                  <span
                    className={`font-semibold flex items-center shrink-0 ${
                      currentStation.crowdPercentage > 75
                        ? 'text-red-400'
                        : currentStation.crowdPercentage > 50
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        currentStation.crowdPercentage > 75
                          ? 'bg-red-500'
                          : currentStation.crowdPercentage > 50
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    ></span>
                    {currentStation.crowdLevel === 'Heavy'
                      ? 'Heavy Crowding'
                      : `${currentStation.crowdLevel} Density`}{' '}
                    ({currentStation.crowdPercentage}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      currentStation.crowdPercentage > 75
                        ? 'bg-red-500'
                        : currentStation.crowdPercentage > 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${currentStation.crowdPercentage}%` }}
                  ></div>
                </div>

                {/* Car Fullness Visualizer */}
                <div className="pt-2">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-medium">
                    <span>Train Car Fullness (6 Cars)</span>
                    <span className="text-emerald-400 font-semibold">
                      {currentStation.bestCarsAdvice}
                    </span>
                  </div>

                  <div className="grid grid-cols-6 gap-1.5 text-center text-[10px] font-mono-numbers font-bold">
                    {currentStation.carFullness.map((car, idx) => {
                      const isSelected = selectedCar === idx;
                      const styleClass =
                        car.level === 'Low'
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/30'
                          : car.level === 'Moderate'
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 hover:bg-amber-500/30'
                          : 'bg-red-500/30 border-red-500/70 text-red-300 hover:bg-red-500/40';

                      return (
                        <button
                          key={car.car}
                          onClick={() => setSelectedCar(isSelected ? null : idx)}
                          className={`py-1.5 rounded border transition cursor-pointer relative ${styleClass} ${
                            isSelected ? 'ring-2 ring-sky-400 scale-105' : ''
                          }`}
                          title={`${car.car}: ${car.level} (${car.percentage}%), ~${car.seatsEstimate} seats`}
                        >
                          {car.car}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Car Details Tooltip */}
                  {selectedCar !== null && (
                    <div className="mt-2 p-2 rounded bg-slate-800 border border-slate-700 text-[11px] text-slate-300 flex items-center justify-between animate-fadeIn">
                      <span>
                        <strong className="text-white">
                          Car {currentStation.carFullness[selectedCar].car}:
                        </strong>{' '}
                        {currentStation.carFullness[selectedCar].percentage}% full (
                        {currentStation.carFullness[selectedCar].level})
                      </span>
                      <span className="text-emerald-400 font-mono-numbers">
                        ~{currentStation.carFullness[selectedCar].seatsEstimate} seats free
                      </span>
                    </div>
                  )}
                </div>

                {/* Rider-to-Rider Verification Snippet */}
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs mt-3">
                  <div className="flex items-center space-x-2 truncate mr-2">
                    <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-semibold whitespace-nowrap">
                      {currentStation.recentReport.author}
                    </span>
                    <span className="text-slate-300 truncate text-[11px]">
                      "{currentStation.recentReport.quote}"
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-slate-400 text-[10px] font-mono-numbers">
                      {currentStation.recentReport.timeAgo}
                    </span>
                    <button
                      onClick={handleUpvote}
                      className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] transition cursor-pointer ${
                        hasUpvoted
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                      title="Confirm this report"
                    >
                      <ThumbsUp className="w-2.5 h-2.5" />
                      <span>{upvotes}</span>
                    </button>
                  </div>
                </div>

                {/* Station Quick Selector Dropdown Simulation */}
                <div className="pt-2">
                  <label
                    htmlFor="station-select"
                    className="block text-[11px] font-medium text-slate-400 mb-1"
                  >
                    Simulate Station View:
                  </label>
                  <select
                    id="station-select"
                    value={currentStation.id}
                    onChange={(e) => onSelectStation(e.target.value)}
                    className="w-full bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg py-2 px-3 focus:ring-sky-500 focus:border-sky-500 cursor-pointer"
                  >
                    <option value="jurong-east">NS1/EW24 Jurong East Interchange</option>
                    <option value="orchard">NS22 Orchard MRT</option>
                    <option value="bugis">EW12/DT14 Bugis</option>
                    <option value="buona-vista">CC22/EW21 Buona Vista</option>
                    <option value="orchard-boulevard">TE14 Orchard Boulevard</option>
                    <option value="serangoon">NE12/CC13 Serangoon</option>
                    <option value="city-hall">NS25/EW13 City Hall</option>
                  </select>
                </div>

                {/* Quick actions for user interaction */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => onOpenStationDetail(currentStation)}
                    className="flex-1 py-1.5 px-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white text-[11px] font-medium transition cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <MapPin className="w-3 h-3 text-sky-400" />
                    <span>Concourse & Escalator Map</span>
                  </button>
                  <button
                    onClick={onTriggerAlarmSimulation}
                    className="py-1.5 px-3 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-lg text-sky-300 text-[11px] font-medium transition cursor-pointer flex items-center justify-center space-x-1"
                    title="Simulate 2x Daily Commute Alert"
                  >
                    <Bell className="w-3 h-3 text-sky-400" />
                    <span>Test Departure Alert</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
