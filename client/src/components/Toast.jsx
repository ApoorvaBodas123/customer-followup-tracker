import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md ${
          isError
            ? 'bg-rose-950/90 border-rose-800 text-rose-200 shadow-rose-950/50'
            : isInfo
            ? 'bg-blue-950/90 border-blue-800 text-blue-200 shadow-blue-950/50'
            : 'bg-emerald-950/90 border-emerald-800 text-emerald-200 shadow-emerald-950/50'
        }`}
      >
        <div className="shrink-0">
          {isError ? (
            <AlertCircle className="w-5 h-5 text-rose-400" />
          ) : isInfo ? (
            <Info className="w-5 h-5 text-blue-400" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
        </div>

        <div className="text-xs sm:text-sm font-medium pr-2">{toast.message}</div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
