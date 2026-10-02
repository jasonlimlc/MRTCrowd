import React, { useState } from 'react';
import { Check, X, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onStartProTrial: () => void;
  onGetFreeAccess: () => void;
  isProUser: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onStartProTrial,
  onGetFreeAccess,
  isProUser,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section
      className="py-16 sm:py-20 bg-[#080D1A] border-t border-slate-800"
      data-purpose="pricing-freemium-section"
      id="pricing"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
            Transparent Pricing Mechanism
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3">
            Freemium for All Singapore Commuters
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Enjoy unlimited free crowd intelligence powered by non-intrusive advertisements, or
            upgrade for zero distractions and VIP departure alarms.
          </p>

          {/* Billing cycle toggle */}
          <div className="mt-6 inline-flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1.5 rounded-lg transition font-medium cursor-pointer flex items-center space-x-1 ${
                billingCycle === 'yearly'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Pass</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
                Save 30%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
          {/* Free Tier Card */}
          <div
            className="bg-slate-900/70 border border-slate-800 rounded-2xl p-7 flex flex-col justify-between"
            data-purpose="free-tier-card"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Daily Commuter (Ad-Supported)</h3>
                <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium">
                  Free Forever
                </span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white font-mono-numbers">$0</span>
                <span className="text-slate-400 text-xs"> / month</span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Live MRT Station & Platform crowding heatmaps</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Standard 15-minute crowd forecasts</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Instant rush hour push & departure alerts</span>
                </li>
                <li className="flex items-center space-x-2.5 text-slate-400">
                  <X className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Supports light commuter-relevant banner ads</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onGetFreeAccess}
              className="w-full text-center py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition border border-slate-700 cursor-pointer"
            >
              Get Free Access
            </button>
          </div>

          {/* Premium Pass Card */}
          <div
            className="bg-gradient-to-b from-slate-900 to-sky-950/40 border-2 border-sky-500/60 rounded-2xl p-7 flex flex-col justify-between relative shadow-xl shadow-sky-500/10"
            data-purpose="pro-tier-card"
          >
            <div className="absolute -top-3 right-6 bg-sky-500 text-slate-950 font-bold text-[10px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md">
              Most Popular
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white">Commuter Pro Pass</h3>
                  {isProUser && (
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-500 text-slate-950 font-bold rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/40">
                  Zero Ads
                </span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white font-mono-numbers">
                  {billingCycle === 'monthly' ? '$2.99' : '$24.99'}
                </span>
                <span className="text-slate-400 text-xs">
                  {billingCycle === 'monthly' ? ' / month (or $24.99/yr)' : ' / year (just $2.08/mo)'}
                </span>
              </div>
              <ul className="space-y-3.5 text-xs text-slate-200 mb-8">
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>
                    <strong className="text-white">100% Ad-free experience</strong> across app and
                    widget
                  </span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Automated 2x daily customized departure notifications</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Exact Train Car fullness indicator (find empty seats)</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Check className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Weekly personalized commute time savings analytics</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onStartProTrial}
              className="w-full text-center py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProUser ? 'Manage Pro Pass' : 'Start 14-Day Free Trial'}</span>
            </button>
          </div>
        </div>

        {/* Cost Structure Footnote */}
        <div className="mt-12 text-center text-xs text-slate-500 max-w-xl mx-auto">
          <p>
            Sustainable transit tech built with cloud-hosted prediction infrastructure, verified
            reliable data feeds, and ongoing product engineering for the Singapore commuter
            community.
          </p>
        </div>
      </div>
    </section>
  );
};
