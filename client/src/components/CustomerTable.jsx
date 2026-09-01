import React from 'react';
import { Search, Filter, Phone, Mail, Edit, Trash2, CheckCircle, ArrowUpDown, Plus, Building2, Calendar } from 'lucide-react';
import { formatDate, formatShortDate, getStatusBadgeInfo } from '../utils/dateUtils';

export const CustomerTable = ({
  customers = [],
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  onEditCustomer,
  onDeleteCustomer,
  onMarkContacted,
  onAddCustomer,
  contactingId,
}) => {
  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'due_today', label: 'Due Today' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'upcoming', label: 'Upcoming' },
  ];

  return (
    <div className="space-y-4">
      {/* Section Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            All Customers
          </h2>
          <p className="text-xs text-slate-400">
            Manage your complete contact list, schedules, and history
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, phone, email..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-slate-200 placeholder:text-slate-500 transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-800 text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="nextFollowUpDate">Sort: Next Follow-up</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="lastContactedAt">Sort: Last Contacted</option>
              <option value="createdAt">Sort: Date Added</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 sm:space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {filterTabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onStatusFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Customers Table / Card View */}
      {customers.length === 0 ? (
        <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8 sm:p-12 text-center">
          <p className="text-sm text-slate-400">No customers found matching your current search or filter.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={onAddCustomer}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Customer
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="bg-slate-950/70 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th scope="col" className="px-4 py-3.5 font-semibold">
                    Customer
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">
                    Contact Info
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">
                    Interval
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">
                    Last Contacted
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-semibold">
                    Next Follow-up
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {customers.map((customer) => {
                  const customerId = customer._id || customer.id;
                  const badgeInfo = getStatusBadgeInfo(customer.followUpStatus, customer.daysRemaining);
                  const isContacting = contactingId === customerId;

                  return (
                    <tr
                      key={customerId}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Name & Company */}
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {customer.name}
                        </div>
                        {customer.company && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-500" />
                            {customer.company}
                          </div>
                        )}
                        {customer.notes && (
                          <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5 italic">
                            {customer.notes}
                          </div>
                        )}
                      </td>

                      {/* Contact Info */}
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          {customer.phone && (
                            <a
                              href={`tel:${customer.phone}`}
                              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="font-mono">{customer.phone}</span>
                            </a>
                          )}
                          {customer.email && (
                            <a
                              href={`mailto:${customer.email}`}
                              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-teal-400 transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                              <span className="truncate max-w-[150px]">{customer.email}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Interval */}
                      <td className="px-4 py-3.5 font-medium text-slate-300">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-800 text-xs text-slate-300 font-mono">
                          {customer.followUpInterval} {customer.followUpInterval === 1 ? 'day' : 'days'}
                        </span>
                      </td>

                      {/* Last Contacted */}
                      <td className="px-4 py-3.5">
                        <span className="text-slate-300">
                          {formatDate(customer.lastContactedAt)}
                        </span>
                      </td>

                      {/* Next Follow-up & Status Badge */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-medium text-white">
                            {formatDate(customer.nextFollowUpDate)}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeInfo.bg} ${badgeInfo.text} ${badgeInfo.border}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${badgeInfo.dot}`} />
                            {badgeInfo.label}
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Mark as Contacted */}
                          <button
                            onClick={() => onMarkContacted(customerId)}
                            disabled={isContacting}
                            title="Mark as Contacted"
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 transition-all disabled:opacity-50"
                          >
                            <CheckCircle className={`w-4 h-4 ${isContacting ? 'animate-spin' : ''}`} />
                          </button>

                          {/* Edit Customer */}
                          <button
                            onClick={() => onEditCustomer(customer)}
                            title="Edit Customer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Customer */}
                          <button
                            onClick={() => onDeleteCustomer(customer)}
                            title="Delete Customer"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
