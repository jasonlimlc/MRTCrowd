import React from 'react';
import { Globe } from 'lucide-react';

interface ChannelsSectionProps {
  onOpenStoreModal: (platform: 'apple' | 'google') => void;
  onLaunchWebApp: () => void;
}

export const ChannelsSection: React.FC<ChannelsSectionProps> = ({
  onOpenStoreModal,
  onLaunchWebApp,
}) => {
  return (
    <section
      className="py-16 sm:py-20 bg-slate-900 border-t border-slate-800"
      data-purpose="channels-download-banner"
      id="get-app"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Available Across All Your Daily Channels
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto mt-2">
          App Stores, responsive web app, social feeds, and verified peer-to-peer commuter groups.
        </p>

        {/* Channel Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          {/* Apple App Store */}
          <button
            onClick={() => onOpenStoreModal('apple')}
            className="inline-flex items-center space-x-3 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition cursor-pointer group"
          >
            <svg className="w-6 h-6 fill-current group-hover:scale-105 transition-transform" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.62-.75 1.04-1.8 1.01-2.85-.9.04-2 .6-2.65 1.34-.58.65-1.08 1.72-1.02 2.76.99.08 2.04-.5 2.66-1.25z" />
            </svg>
            <div className="text-left leading-tight">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                Download on
              </span>
              <span className="font-bold text-xs">Apple App Store</span>
            </div>
          </button>

          {/* Google Play Store */}
          <button
            onClick={() => onOpenStoreModal('google')}
            className="inline-flex items-center space-x-3 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition cursor-pointer group"
          >
            <svg
              className="w-6 h-6 fill-current text-sky-400 group-hover:scale-105 transition-transform"
              viewBox="0 0 24 24"
            >
              <path d="M3.609 1.814L13.793 12 3.61 22.186c-.352-.336-.554-.82-.554-1.391V3.205c0-.571.202-1.055.553-1.391zm11.233 11.233l2.25 2.25-11.458 6.502 9.208-8.752zm0-2.094L5.634 2.199l11.458 6.502-2.25 2.252zm1.484 1.047l3.879-2.203c.895-.508.895-1.339 0-1.848l-3.879-2.203-1.838 1.838 1.838 1.838z" />
            </svg>
            <div className="text-left leading-tight">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                Get it on
              </span>
              <span className="font-bold text-xs">Google Play Store</span>
            </div>
          </button>

          {/* Web App Launch */}
          <button
            onClick={onLaunchWebApp}
            className="inline-flex items-center space-x-3 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition cursor-pointer group"
          >
            <Globe className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform" />
            <div className="text-left leading-tight">
              <span className="block text-[10px] text-slate-400 uppercase tracking-wider">
                Instant Access
              </span>
              <span className="font-bold text-xs">Launch Web App</span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
