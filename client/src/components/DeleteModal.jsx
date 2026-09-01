import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteModal = ({ isOpen, onClose, onConfirm, customer, isDeleting }) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#e2dbcb] p-6 shadow-2xl overflow-hidden">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 shrink-0 border border-rose-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Delete Customer
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to remove <span className="font-bold text-slate-900">&ldquo;{customer.name}&rdquo;</span>? All follow-up history and records will be permanently removed.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#e2dbcb] bg-[#f4f1ec] hover:bg-[#e2dbcb] text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-600/20 transition-all disabled:opacity-50"
          >
            <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-spin' : ''}`} />
            <span>{isDeleting ? 'Deleting...' : 'Delete Customer'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
