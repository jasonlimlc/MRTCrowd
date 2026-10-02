import React from 'react';
import { X, Send, Users, ShieldCheck, ExternalLink } from 'lucide-react';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateJoin: () => void;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({
  isOpen,
  onClose,
  onSimulateJoin,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0088cc]/10 border-sky-500/20">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0088cc] text-white flex items-center justify-center">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.18 3.35-1.39 3.73-1.39.08 0 .27.02.39.12.1.08.13.19.14.28-.01.07-.01.16-.02.26z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white">SGRider Pulse Telegram</h3>
              <p className="text-xs text-sky-400">@SGRiderPulseBot • 42,000+ Members</p>
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
        <div className="p-6 space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Connect to Singapore's largest automated MRT crowd alert channel. Get direct push alerts
            the moment train delays or unexpected peak surges strike.
          </p>

          <div className="space-y-2 bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/50 text-[11px] text-slate-300">
            <div className="flex items-center space-x-2">
              <span className="text-emerald-400 font-bold">⚡ 0-second track fault alerts</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sky-400 font-bold">📍 Station-specific bot queries:</span>
              <span className="font-mono text-slate-400">/crowd orchard</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-amber-400 font-bold">🌧️ Heavy downpour delay warnings</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onSimulateJoin}
              className="w-full py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 text-xs shadow-lg shadow-sky-500/20"
            >
              <span>Connect via Telegram App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-slate-400 hover:text-white transition cursor-pointer text-xs"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
