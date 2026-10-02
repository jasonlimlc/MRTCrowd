import React, { useState } from 'react';
import { Check, MessageSquare, ThumbsUp, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { TelegramMessage } from '../types/transit';

interface CommunitySectionProps {
  messages: TelegramMessage[];
  onAddMessage: (msg: TelegramMessage) => void;
  onOpenTelegramModal: () => void;
  onOpenDigest: () => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  messages,
  onAddMessage,
  onOpenTelegramModal,
  onOpenDigest,
}) => {
  const [stationInput, setStationInput] = useState('Orchard NS22');
  const [reportText, setReportText] = useState('');
  const [crowdTag, setCrowdTag] = useState<'Light' | 'Moderate' | 'Heavy'>('Moderate');
  const [confirmedIds, setConfirmedIds] = useState<Record<string, number>>({});
  const [userConfirmed, setUserConfirmed] = useState<Record<string, boolean>>({});

  const handleConfirm = (id: string, initialCount: number) => {
    if (userConfirmed[id]) return;
    setUserConfirmed((prev) => ({ ...prev, [id]: true }));
    setConfirmedIds((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialCount) + 1,
    }));
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-SG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newMsg: TelegramMessage = {
      id: `user-${Date.now()}`,
      sender: `Rider Verification (${stationInput})`,
      senderType: 'user',
      time: timeStr,
      content: `"[${crowdTag.toUpperCase()}] ${reportText.trim()}"`,
      verifiedBy: 1,
    };

    onAddMessage(newMsg);
    setReportText('');
  };

  return (
    <section
      className="py-16 sm:py-20 bg-[#080D1A] border-t border-slate-800"
      data-purpose="community-telegram-section"
      id="community"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Explanation of Community Relationship */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <span>Customer Relationship Model</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Self-service ease paired with active rider support.
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              By combining LTA's official sensors with real-time feedback from our 42,000+ daily
              Telegram & in-app commuters, we keep customer acquisition lean and support costs down
              while giving riders an interactive voice.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Two-Tap In-App Crowdsourcing</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Spotted a delay or an empty cabin at Somerset? Submit a quick thumbs up/down
                    report to alert upcoming trains.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Telegram Alert Community Bot</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Automated flash alerts for track faults, rain surge congestion, and station crowd
                    bottlenecks right inside your chat feed.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-white font-semibold text-sm">
                      Weekly Commute Efficiency Digest
                    </h4>
                    <button
                      onClick={onOpenDigest}
                      className="text-[10px] text-sky-400 hover:underline cursor-pointer"
                    >
                      (Preview Digest)
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Every Sunday evening: See how much transit wait time you shaved off during peak
                    morning & evening hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Telegram Bot & Verification Feed Preview Mockup */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
              {/* Telegram Feed Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.18 3.35-1.39 3.73-1.39.08 0 .27.02.39.12.1.08.13.19.14.28-.01.07-.01.16-.02.26z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">SGRider Pulse Telegram Community</h4>
                    <p className="text-[11px] text-emerald-400">● 14,820 commuters online now</p>
                  </div>
                </div>
                <button
                  onClick={onOpenTelegramModal}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700 transition cursor-pointer"
                >
                  Join Free
                </button>
              </div>

              {/* Feed Messages */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {messages.map((msg) => {
                  const currentCount = confirmedIds[msg.id] ?? msg.confirmedCount ?? 0;
                  const isUserConfirmed = userConfirmed[msg.id];

                  return (
                    <div
                      key={msg.id}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5 space-y-1.5 text-xs transition hover:border-slate-600"
                    >
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span
                          className={`font-bold ${
                            msg.senderType === 'bot' ? 'text-sky-400' : 'text-amber-400'
                          }`}
                        >
                          {msg.senderType === 'bot' ? '🤖' : '👤'} {msg.sender}
                        </span>
                        <span className="font-mono-numbers">{msg.time}</span>
                      </div>

                      {msg.title && (
                        <p className="text-slate-200 font-medium text-[11px]">{msg.title}</p>
                      )}
                      <p className="text-slate-300 text-[11px] leading-relaxed">{msg.content}</p>

                      <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                        {msg.confirmedCount !== undefined && (
                          <button
                            onClick={() => handleConfirm(msg.id, msg.confirmedCount || 0)}
                            className={`px-2 py-0.5 rounded transition cursor-pointer flex items-center space-x-1 ${
                              isUserConfirmed
                                ? 'bg-sky-500 text-slate-950 font-bold'
                                : 'bg-slate-700/80 hover:bg-slate-700 text-slate-300'
                            }`}
                          >
                            <span>👍</span>
                            <span>{currentCount} confirmed</span>
                          </button>
                        )}
                        {msg.savedMins !== undefined && (
                          <span className="px-2 py-0.5 rounded bg-slate-700/80 text-slate-300">
                            ⏱️ Saved avg {msg.savedMins} mins
                          </span>
                        )}
                        {msg.verifiedBy !== undefined && (
                          <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 pt-0.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Verified by {msg.verifiedBy} commuters on site</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* In-App Rapid Crowdsource Submitter */}
              <form
                onSubmit={handleSubmitReport}
                className="pt-2 border-t border-slate-800 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-medium text-slate-300">Quick Rider Crowd Report:</span>
                  <div className="flex gap-1">
                    {(['Light', 'Moderate', 'Heavy'] as const).map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setCrowdTag(tag)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                          crowdTag === tag
                            ? tag === 'Light'
                              ? 'bg-emerald-500 text-slate-950'
                              : tag === 'Moderate'
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-red-500 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <select
                    value={stationInput}
                    onChange={(e) => setStationInput(e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="Orchard NS22">Orchard NS22</option>
                    <option value="Jurong East NS1">Jurong East NS1</option>
                    <option value="Bugis EW12">Bugis EW12</option>
                    <option value="Raffles Place NS26">Raffles Place NS26</option>
                    <option value="Serangoon NE12">Serangoon NE12</option>
                    <option value="Bishan NS17">Bishan NS17</option>
                  </select>

                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. Doors clearing, light crowd at rear car"
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer shrink-0"
                    title="Publish report to community feed"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
