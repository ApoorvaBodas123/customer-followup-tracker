import { useEffect } from 'react';
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
        className={`flex items-center space-x-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-md ${
          isError
            ? 'bg-rose-50 border-rose-200 text-rose-800 shadow-rose-900/10'
            : isInfo
            ? 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-900/10'
            : 'bg-white border-[#e2dbcb] text-slate-800 shadow-slate-900/10'
        }`}
      >
        <div className="shrink-0">
          {isError ? (
            <AlertCircle className="w-5 h-5 text-rose-600" />
          ) : isInfo ? (
            <Info className="w-5 h-5 text-blue-600" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#0d9488]" />
          )}
        </div>

        <div className="text-xs sm:text-sm font-semibold pr-2">{toast.message}</div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
