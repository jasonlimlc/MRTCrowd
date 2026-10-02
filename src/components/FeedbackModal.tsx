import React, { useState } from 'react';
import { X, Send, Check } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (text: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmitFeedback,
}) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    onSubmitFeedback(feedback);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
      setFeedback('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="text-base font-bold text-white">Feedback & Community Voice</h3>
            <p className="text-xs text-slate-400">Help improve Singapore's crowd intelligence</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Thank You for Your Feedback!</h4>
              <p className="text-xs text-slate-400">
                Our Singapore transit data engineering team reviews all commuter feedback daily.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Your Suggestions / Station Observation:
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about escalator bottlenecks, inaccurate car crowding, or feature requests..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                ></textarea>
              </div>

              <div className="p-3 bg-slate-800/40 rounded-xl text-[11px] text-slate-400">
                🔒 Privacy guarantee: No personal identity or travel history is tracked or sold.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Commuter Feedback</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
