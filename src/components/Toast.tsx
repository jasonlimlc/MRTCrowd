import React from 'react';
import { CheckCircle2, Bell, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'alert' | 'info';
  title: string;
  description: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const icon =
          toast.type === 'alert' ? (
            <Bell className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          );

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl backdrop-blur-md flex items-start space-x-3 text-xs animate-slideUp transition"
          >
            {icon}
            <div className="flex-1 pr-1">
              <h5 className="font-bold text-white text-[12px]">{toast.title}</h5>
              <p className="text-slate-300 text-[11px] mt-0.5 leading-snug">{toast.description}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
