import React, { useState } from 'react';
import { X, Sparkles, Check, ShieldCheck } from 'lucide-react';

interface ProPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivatePro: () => void;
  isProUser: boolean;
}

export const ProPassModal: React.FC<ProPassModalProps> = ({
  isOpen,
  onClose,
  onActivatePro,
  isProUser,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [activated, setActivated] = useState(false);

  if (!isOpen) return null;

  const handleActivate = () => {
    onActivatePro();
    setActivated(true);
    setTimeout(() => {
      onClose();
      setActivated(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-sky-950/70 to-slate-900">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Commuter Pro Pass</h3>
              <p className="text-xs text-sky-400">14-Day Free VIP Trial</p>
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
          {/* Plan Switcher */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                selectedPlan === 'monthly'
                  ? 'border-sky-500 bg-sky-500/10 text-white'
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="block font-semibold">Monthly Pass</span>
              <span className="text-base font-bold text-white font-mono-numbers mt-1 block">
                $2.99
              </span>
              <span className="text-[10px] text-slate-400">Billed monthly</span>
            </button>

            <button
              onClick={() => setSelectedPlan('yearly')}
              className={`p-3 rounded-xl border text-left transition cursor-pointer relative ${
                selectedPlan === 'yearly'
                  ? 'border-sky-500 bg-sky-500/10 text-white'
                  : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="absolute -top-2 right-2 text-[9px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                SAVE 30%
              </span>
              <span className="block font-semibold">Annual Pass</span>
              <span className="text-base font-bold text-white font-mono-numbers mt-1 block">
                $24.99
              </span>
              <span className="text-[10px] text-slate-400">($2.08/month)</span>
            </button>
          </div>

          {/* Perks list */}
          <div className="space-y-2.5 bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
            <div className="flex items-center space-x-2 text-slate-200">
              <Check className="w-4 h-4 text-sky-400 shrink-0" />
              <span>100% Ad-Free across all devices</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-200">
              <Check className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Personalized morning (07:45) & evening (18:00) push alarms</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-200">
              <Check className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Train Car fullness seat availability predictions</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-200">
              <Check className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Weekly Sunday commute time savings digest</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Cancel anytime with 1 click
            </span>
            <span>Zero charges today</span>
          </div>

          <button
            onClick={handleActivate}
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition cursor-pointer text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center space-x-1.5"
          >
            {activated ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <span>Pro Pass Activated!</span>
              </>
            ) : isProUser ? (
              <span>Renew / Keep Pro Active</span>
            ) : (
              <span>Start 14-Day Free Trial</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
