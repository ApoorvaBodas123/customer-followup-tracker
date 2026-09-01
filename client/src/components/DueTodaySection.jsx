import React from 'react';
import { Phone, Mail, CheckCircle2, Building2, Calendar, Clock, AlertTriangle, ArrowRight, Plus } from 'lucide-react';
import { formatDate, formatShortDate } from '../utils/dateUtils';

export const DueTodaySection = ({
  dueCustomers = [],
  overdueCustomers = [],
  onMarkContacted,
  onAddCustomer,
  contactingId,
}) => {
  const totalActionItems = dueCustomers.length + overdueCustomers.length;

  if (totalActionItems === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-8 sm:p-10 text-center relative overflow-hidden">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-white">All caught up for today!</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-1 mb-5">
          No customer follow-ups are pending right now. Great job keeping your client relationships active.
        </p>
        <button
          onClick={onAddCustomer}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add a New Customer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overdue Section Banner if any */}
      {overdueCustomers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <h2 className="text-base sm:text-lg font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Overdue Follow-ups ({overdueCustomers.length})
              </h2>
            </div>
            <span className="text-xs text-rose-400/80 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20 font-medium">
              High Priority
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overdueCustomers.map((customer) => (
              <CustomerDueCard
                key={customer._id || customer.id}
                customer={customer}
                isOverdue={true}
                onMarkContacted={onMarkContacted}
                isContacting={contactingId === (customer._id || customer.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Due Today Section */}
      {dueCustomers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <h2 className="text-base sm:text-lg font-bold text-amber-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Follow-ups Due Today ({dueCustomers.length})
              </h2>
            </div>
            <span className="text-xs text-amber-400/80 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 font-medium">
              Due Today
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dueCustomers.map((customer) => (
              <CustomerDueCard
                key={customer._id || customer.id}
                customer={customer}
                isOverdue={false}
                onMarkContacted={onMarkContacted}
                isContacting={contactingId === (customer._id || customer.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CustomerDueCard = ({ customer, isOverdue, onMarkContacted, isContacting }) => {
  const customerId = customer._id || customer.id;

  return (
    <div
      className={`p-5 rounded-2xl bg-slate-900/90 border transition-all duration-200 shadow-lg ${
        isOverdue
          ? 'border-rose-500/30 hover:border-rose-500/60 shadow-rose-950/20'
          : 'border-amber-500/30 hover:border-amber-500/60 shadow-amber-950/20'
      }`}
    >
      {/* Header: Name and Status */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            {customer.name}
          </h3>
          {customer.company && (
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              {customer.company}
            </p>
          )}
        </div>

        <span
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
            isOverdue
              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          }`}
        >
          {isOverdue ? `Overdue (${Math.abs(customer.daysRemaining || 1)}d)` : 'Due Today'}
        </span>
      </div>

      {/* Contact Details */}
      <div className="mt-3.5 space-y-1.5 text-xs text-slate-300">
        {customer.phone && (
          <a
            href={`tel:${customer.phone}`}
            className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors group"
          >
            <span className="p-1 rounded-md bg-slate-800 text-emerald-400 group-hover:bg-emerald-500/20">
              <Phone className="w-3.5 h-3.5" />
            </span>
            <span className="font-mono">{customer.phone}</span>
          </a>
        )}

        {customer.email && (
          <a
            href={`mailto:${customer.email}`}
            className="flex items-center gap-2 text-slate-300 hover:text-teal-400 transition-colors group"
          >
            <span className="p-1 rounded-md bg-slate-800 text-teal-400 group-hover:bg-teal-500/20">
              <Mail className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">{customer.email}</span>
          </a>
        )}
      </div>

      {/* Follow-up Details Info Box */}
      <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 block text-[11px]">Last Contacted</span>
          <span className="font-medium text-slate-200">
            {formatDate(customer.lastContactedAt)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-slate-400 block text-[11px]">Interval</span>
          <span className="font-semibold text-emerald-400">
            Every {customer.followUpInterval} days
          </span>
        </div>
      </div>

      {customer.notes && (
        <p className="mt-2.5 text-xs text-slate-400 italic line-clamp-1">
          &ldquo;{customer.notes}&rdquo;
        </p>
      )}

      {/* Action CTA: Mark as Contacted */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => onMarkContacted(customerId)}
          disabled={isContacting}
          className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center space-x-2 transition-all shadow-md ${
            isOverdue
              ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-rose-600/20'
              : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 shadow-emerald-600/20'
          } disabled:opacity-50`}
        >
          <CheckCircle2 className={`w-4 h-4 ${isContacting ? 'animate-spin' : ''}`} />
          <span>{isContacting ? 'Updating follow-up...' : 'Mark as Contacted'}</span>
        </button>
      </div>
    </div>
  );
};
