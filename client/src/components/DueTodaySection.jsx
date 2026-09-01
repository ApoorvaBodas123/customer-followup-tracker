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
      <div className="rounded-2xl bg-white border border-[#e2dbcb] p-8 sm:p-10 text-center relative overflow-hidden shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-[#4cc9b1]/20 text-[#0f766e] mx-auto flex items-center justify-center mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900">All caught up for today!</h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
          No customer follow-ups are pending right now.
        </p>
        <button
          onClick={onAddCustomer}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#f4f1ec] hover:bg-[#e2dbcb] text-slate-800 border border-[#e2dbcb] text-xs sm:text-sm font-semibold transition-all"
        >
          <Plus className="w-4 h-4 text-[#0f766e]" />
          <span>Add a New Customer</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {overdueCustomers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <h2 className="text-base sm:text-lg font-bold text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Overdue Follow-ups ({overdueCustomers.length})
              </h2>
            </div>
            <span className="text-xs text-rose-800 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-300 font-bold">
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

      {dueCustomers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <h2 className="text-base sm:text-lg font-bold text-amber-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                Follow-ups Due Today ({dueCustomers.length})
              </h2>
            </div>
            <span className="text-xs text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 font-bold">
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
      className={`p-5 rounded-2xl bg-white border transition-all duration-200 shadow-sm hover:shadow-md ${
        isOverdue
          ? 'border-rose-300 hover:border-rose-400'
          : 'border-amber-300 hover:border-amber-400'
      }`}
    >
      {/* Header: Name and Status */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {customer.name}
          </h3>
          {customer.company && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-[#0d9488]" />
              {customer.company}
            </p>
          )}
        </div>

        <span
          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
            isOverdue
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : 'bg-amber-100 text-amber-800 border-amber-300'
          }`}
        >
          {isOverdue ? `Overdue (${Math.abs(customer.daysRemaining || 1)}d)` : 'Due Today'}
        </span>
      </div>

      {/* Contact Details */}
      <div className="mt-3.5 space-y-1.5 text-xs text-slate-700">
        {customer.phone && (
          <a
            href={`tel:${customer.phone}`}
            className="flex items-center gap-2 text-slate-700 hover:text-[#0d9488] transition-colors group"
          >
            <span className="p-1 rounded-md bg-[#f4f1ec] text-[#0d9488] group-hover:bg-[#4cc9b1]/20">
              <Phone className="w-3.5 h-3.5" />
            </span>
            <span className="font-mono font-medium">{customer.phone}</span>
          </a>
        )}

        {customer.email && (
          <a
            href={`mailto:${customer.email}`}
            className="flex items-center gap-2 text-slate-700 hover:text-[#0d9488] transition-colors group"
          >
            <span className="p-1 rounded-md bg-[#f4f1ec] text-[#0d9488] group-hover:bg-[#4cc9b1]/20">
              <Mail className="w-3.5 h-3.5" />
            </span>
            <span className="truncate">{customer.email}</span>
          </a>
        )}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-[#f4f1ec] border border-[#e2dbcb] flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">Last Contacted</span>
          <span className="font-semibold text-slate-800">
            {formatDate(customer.lastContactedAt)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-slate-500 block text-[11px]">Interval</span>
          <span className="font-bold text-[#0f766e]">
            Every {customer.followUpInterval} days
          </span>
        </div>
      </div>

      {customer.notes && (
        <p className="mt-2.5 text-xs text-slate-500 italic line-clamp-1">
          &ldquo;{customer.notes}&rdquo;
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-[#e2dbcb]">
        <button
          onClick={() => onMarkContacted(customerId)}
          disabled={isContacting}
          className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-sm ${
            isOverdue
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
              : 'bg-[#4cc9b1] hover:bg-[#38b8a0] text-slate-950 shadow-[#4cc9b1]/25'
          } disabled:opacity-50`}
        >
          <CheckCircle2 className={`w-4 h-4 ${isContacting ? 'animate-spin' : ''}`} />
          <span>{isContacting ? 'Updating follow-up...' : 'Mark as Contacted'}</span>
        </button>
      </div>
    </div>
  );
};
