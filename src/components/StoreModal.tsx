import React from 'react';
import { X, Smartphone, QrCode, Download, CheckCircle2 } from 'lucide-react';

interface StoreModalProps {
  platform: 'apple' | 'google' | null;
  onClose: () => void;
  onInstallWebApp: () => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({
  platform,
  onClose,
  onInstallWebApp,
}) => {
  if (!platform) return null;

  const isApple = platform === 'apple';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isApple ? 'Apple App Store (iOS)' : 'Google Play Store (Android)'}
              </h3>
              <p className="text-xs text-slate-400">Singapore Commute Intelligence</p>
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
        <div className="p-6 space-y-4 text-xs text-center">
          <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
            {/* Visual QR Code Representation */}
            <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-slate-900 rounded-lg">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${
                    i % 3 === 0 || i === 0 || i === 3 || i === 12 || i === 15
                      ? 'bg-sky-400'
                      : i % 2 === 0
                      ? 'bg-emerald-400'
                      : 'bg-slate-700'
                  }`}
                ></div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm">
              Scan with your phone or use Instant Web App
            </h4>
            <p className="text-slate-400 text-xs mt-1">
              Supports Singapore iOS 16+ Live Activities and Android Dynamic Island MRT widgets.
            </p>
          </div>

          <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-left space-y-2 text-[11px] text-slate-300">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Lock Screen 2x Daily Pinpoint Notifications</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Offline station transfer guides for underground MRT</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onInstallWebApp}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition cursor-pointer flex items-center justify-center space-x-2 text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Save as Instant PWA on Home Screen</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-slate-400 hover:text-white transition cursor-pointer text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
