import React, { useState } from 'react';
import { X, Key, Check, Copy, Terminal } from 'lucide-react';

interface EnterpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orgName: string) => void;
}

export const EnterpriseModal: React.FC<EnterpriseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [useCase, setUseCase] = useState('concourse-heatmaps');
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiKey] = useState(`cw_live_sg_${Math.random().toString(36).substring(2, 12)}`);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!org.trim() || !email.trim()) return;
    setSubmitted(true);
    onSuccess(org);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText?.(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Transit Operator & Enterprise API</h3>
              <p className="text-xs text-slate-400">
                Direct access to high-frequency MRT concourse telemetry
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

        {/* Content */}
        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Organization / Transit Agency
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SMRT Corp / LTA Mobility / CapitaLand Retail"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="contact@transitoperator.sg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Primary Integration</label>
                <select
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="concourse-heatmaps">Station Concourse Capacity Heatmaps</option>
                  <option value="corridor-reports">Monthly Transit Density Reports</option>
                  <option value="webhooks">Real-Time Webhook Alert Dispatch</option>
                  <option value="campus-mobility">Corporate Campus Shuttle Alignment</option>
                </select>
              </div>

              <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-400 text-[11px] leading-relaxed">
                Includes 50,000 monthly API queries, 15-second cache updates, and dedicated webhook
                failover SLA (99.8% uptime).
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition cursor-pointer text-xs shadow-lg shadow-sky-500/20"
              >
                Generate Enterprise Sandbox Token
              </button>
            </form>
          ) : (
            <div className="space-y-4 animate-fadeIn text-xs">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300">
                <p className="font-bold text-sm">Sandbox Key Provisioned for {org}!</p>
                <p className="text-xs text-slate-300 mt-1">
                  Your sandbox environment is ready with simulated live feeds for all 140+ Singapore
                  stations.
                </p>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1 font-mono-numbers">
                  API Key (Bearer Auth):
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={apiKey}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-sky-400 font-mono text-xs"
                  />
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer"
                    title="Copy API Key"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="block text-slate-400 text-[11px] mb-1 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" /> Sample Request:
                </span>
                <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-300 font-mono overflow-x-auto">
{`curl -X GET "https://api.commutewise.sg/v1/corridor/density?line=NSL" \\
  -H "Authorization: Bearer ${apiKey}"`}
                </pre>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition cursor-pointer text-xs border border-slate-700"
              >
                Close & Return
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
