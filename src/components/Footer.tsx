import React from 'react';
import { MRTLine } from '../types/transit';

interface FooterProps {
  lines: MRTLine[];
  onSelectLine: (line: MRTLine) => void;
  onOpenTelegram: () => void;
  onOpenDigest: () => void;
  onRequestApiAccess: () => void;
  onOpenFeedback: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lines,
  onSelectLine,
  onOpenTelegram,
  onOpenDigest,
  onRequestApiAccess,
  onOpenFeedback,
}) => {
  return (
    <footer
      className="bg-[#050912] border-t border-slate-800/80 py-12 text-slate-400 text-xs"
      data-purpose="site-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-sky-500 text-slate-950 flex items-center justify-center font-bold text-sm">
                CW
              </div>
              <span className="text-white font-bold text-base">CommuteWise MRT</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Singapore's commuter-driven MRT intelligence platform. Providing peak-hour crowd
              forecasting and departure optimizations.
            </p>
            <p className="text-[10px] text-slate-500">
              Key Partners: Land Transport Authority (LTA) & Daily Commuters.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">
              Lines Monitored
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              {lines.map((line) => (
                <li key={line.id}>
                  <button
                    onClick={() => onSelectLine(line)}
                    className="hover:text-slate-200 transition text-left cursor-pointer flex items-center space-x-1.5"
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: line.color }}
                    ></span>
                    <span>
                      {line.name} ({line.code})
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Touchpoints */}
          <div>
            <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">
              Touchpoints & Community
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={onOpenTelegram}
                  className="hover:text-slate-200 transition text-left cursor-pointer"
                >
                  SGRider Pulse Telegram
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-slate-200 transition">
                  Twice-Daily Commute Alerts
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenDigest}
                  className="hover:text-slate-200 transition text-left cursor-pointer"
                >
                  Weekly Commute Digest
                </button>
              </li>
              <li>
                <button
                  onClick={onRequestApiAccess}
                  className="hover:text-slate-200 transition text-left cursor-pointer"
                >
                  Operator Analytics Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Disclaimers */}
          <div>
            <h4 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">
              Transparency
            </h4>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              Data synthesized from public transit telemetry under LTA DataMall open terms and crowd
              reports.
            </p>
            <div className="flex space-x-3 text-[11px] pt-1 text-slate-400">
              <button
                onClick={onOpenFeedback}
                className="hover:text-white transition cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>•</span>
              <button
                onClick={onOpenFeedback}
                className="hover:text-white transition cursor-pointer"
              >
                Terms of Use
              </button>
              <span>•</span>
              <button
                onClick={onOpenFeedback}
                className="hover:text-white transition cursor-pointer"
              >
                Feedback
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2025 CommuteWise SG. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Designed for Singapore's Peak Hour Commuters & Transit Operators.
          </p>
        </div>
      </div>
    </footer>
  );
};
