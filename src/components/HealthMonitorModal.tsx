import React, { useState, useEffect } from 'react';
import { X, Activity, Server, Clock, ShieldCheck, AlertTriangle, ExternalLink, RefreshCw, Terminal, Check } from 'lucide-react';

interface HealthMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HealthMonitorModal: React.FC<HealthMonitorModalProps> = ({ isOpen, onClose }) => {
  const [healthData, setHealthData] = useState<any>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [crowdTestResult, setCrowdTestResult] = useState<any>(null);
  const [crowdTesting, setCrowdTesting] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchHealth = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/health?format=json');
      const data = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);
      setHealthData(data);
    } catch (err: any) {
      setHealthData({ status: 'error', error: err?.message });
    } finally {
      setLoading(false);
    }
  };

  const testCrowdEndpoint = async (station: string = 'NS1') => {
    setCrowdTesting(true);
    try {
      const res = await fetch(`/api/crowd?TrainStation=${station}`);
      const data = await res.json();
      setCrowdTestResult(data);
    } catch (err: any) {
      setCrowdTestResult({ error: err?.message });
    } finally {
      setCrowdTesting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
      const timer = setInterval(fetchHealth, 8000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasLtaKey = healthData?.ltaDataMall?.accountKeyConfigured;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">API Health & System Monitor</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-numbers font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  /api/health
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time gateway status, latency telemetry & LTA endpoints
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="/api/health"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs flex items-center gap-1.5 border border-slate-700"
              title="Open /api/health directly in new browser tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Tab</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Top Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status Card */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider">
                Gateway Health
              </span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xl font-bold font-mono-numbers text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  200 OK
                </span>
                <span className="text-[10px] font-mono-numbers text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {latency ? `${latency}ms` : 'Probing...'}
                </span>
              </div>
            </div>

            {/* Uptime Card */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider">
                Process Uptime
              </span>
              <div className="mt-2">
                <span className="text-xl font-bold font-mono-numbers text-white">
                  {healthData?.uptimeHuman || 'Calculating...'}
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5">Continuous execution</p>
              </div>
            </div>

            {/* LTA DataMall Key */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-slate-400 text-[11px] uppercase tracking-wider">
                LTA DataMall Key
              </span>
              <div className="mt-2">
                <span
                  className={`text-sm font-bold flex items-center gap-1 ${
                    hasLtaKey ? 'text-sky-400' : 'text-amber-400'
                  }`}
                >
                  {hasLtaKey ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-sky-400" />
                      KEY ACTIVE
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      SIMULATION MODE
                    </>
                  )}
                </span>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {hasLtaKey ? 'Live LTA API authorized' : 'Set LTA_ACCOUNT_KEY in Vercel'}
                </p>
              </div>
            </div>
          </div>

          {/* LTA Metadata Notice */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-950/50 to-slate-900 border border-sky-800/40 text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sky-400 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-sky-400" />
                LTA PCD Real-Time Endpoint Configured
              </span>
              <button
                onClick={fetchHealth}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded border border-slate-700 transition flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Ping Now</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Target OData Endpoint:{' '}
              <code className="text-sky-300 font-mono text-[10px]">
                http://datamall2.mytransport.sg/ltaodataservice/$metadata#PcdRealTime
              </code>
            </p>
          </div>

          {/* Live Endpoint Interactive Tester */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-[12px] flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-sky-400" />
                Live In-Browser Endpoint Verification
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => testCrowdEndpoint('NS1')}
                  disabled={crowdTesting}
                  className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg font-bold text-[10px] transition cursor-pointer disabled:opacity-50"
                >
                  {crowdTesting ? 'Fetching...' : 'Test /api/crowd (NS1)'}
                </button>
                <button
                  onClick={() => testCrowdEndpoint('EW24')}
                  disabled={crowdTesting}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium text-[10px] border border-slate-700 transition cursor-pointer"
                >
                  Test (EW24)
                </button>
              </div>
            </div>

            {/* Response Viewer */}
            {crowdTestResult ? (
              <div className="space-y-1.5 animate-fadeIn">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>
                    Endpoint response for Station:{' '}
                    <strong className="text-white">{crowdTestResult.stationCode}</strong> (
                    {crowdTestResult.crowdLevel} density, {crowdTestResult.crowdPercentage}%)
                  </span>
                  <span className="text-emerald-400 font-mono">Source: {crowdTestResult.source}</span>
                </div>
                <pre className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-[10px] font-mono text-slate-300 max-h-36 overflow-y-auto">
                  {JSON.stringify(crowdTestResult, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 italic p-2 bg-slate-900/50 rounded-lg border border-slate-800/80">
                Click "Test /api/crowd (NS1)" above to execute an in-browser live call to the LTA DataMall platform crowd endpoint.
              </div>
            )}
          </div>

          {/* Raw JSON /api/health Inspector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Raw /api/health Payload
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(JSON.stringify(healthData, null, 2));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-[10px] text-sky-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-slate-300 max-h-40 overflow-y-auto">
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 text-[11px]">
            Auto-polling every 8 seconds while dashboard is open
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition cursor-pointer border border-slate-700"
          >
            Close Monitor
          </button>
        </div>
      </div>
    </div>
  );
};
