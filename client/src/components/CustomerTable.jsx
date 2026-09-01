import React from 'react';
import { Search, Phone, Mail, Edit, Trash2, CheckCircle, ArrowUpDown, Plus, Building2, Calendar } from 'lucide-react';
import { formatDate, getStatusBadgeInfo } from '../utils/dateUtils';

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
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            All Customers
          </h2>
          <p className="text-xs text-slate-500">
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
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-white border border-[#e2dbcb] focus:border-[#4cc9b1] focus:ring-1 focus:ring-[#4cc9b1] text-slate-800 placeholder:text-slate-400 transition-colors shadow-sm"
            />
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs sm:text-sm rounded-xl bg-white border border-[#e2dbcb] text-slate-800 focus:border-[#4cc9b1] focus:ring-1 focus:ring-[#4cc9b1] cursor-pointer shadow-sm"
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
      <div className="flex items-center space-x-1 sm:space-x-2 border-b border-[#e2dbcb] pb-2 overflow-x-auto">
        {filterTabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onStatusFilterChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-[#0f766e] border border-[#e2dbcb] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-[#e2dbcb]/30'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Customers Table */}
      {customers.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#e2dbcb] p-8 sm:p-12 text-center shadow-sm">
          <p className="text-sm text-slate-500">No customers found matching your current search or filter.</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="px-3.5 py-1.5 rounded-xl bg-[#f4f1ec] text-xs font-medium text-slate-700 hover:bg-[#e2dbcb] transition-colors"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={onAddCustomer}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#4cc9b1] text-xs font-bold text-slate-950 hover:bg-[#38b8a0] transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Customer
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#e2dbcb] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-700">
              <thead className="bg-[#f4f1ec] text-[11px] uppercase tracking-wider text-slate-600 border-b border-[#e2dbcb]">
                <tr>
                  <th scope="col" className="px-4 py-3.5 font-bold">
                    Customer
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-bold">
                    Contact Info
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-bold">
                    Interval
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-bold">
                    Last Contacted
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-bold">
                    Next Follow-up
                  </th>
                  <th scope="col" className="px-4 py-3.5 font-bold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2dbcb]/60">
                {customers.map((customer) => {
                  const customerId = customer._id || customer.id;
                  const badgeInfo = getStatusBadgeInfo(customer.followUpStatus, customer.daysRemaining);
                  const isContacting = contactingId === customerId;

                  return (
                    <tr
                      key={customerId}
                      className="hover:bg-[#f4f1ec]/60 transition-colors group"
                    >
                      {/* Name & Company */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 group-hover:text-[#0f766e] transition-colors">
                          {customer.name}
                        </div>
                        {customer.company && (
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-[#0d9488]" />
                            {customer.company}
                          </div>
                        )}
                        {customer.notes && (
                          <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5 italic">
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
                              className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-[#0d9488] transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#0d9488] shrink-0" />
                              <span className="font-mono font-medium">{customer.phone}</span>
                            </a>
                          )}
                          {customer.email && (
                            <a
                              href={`mailto:${customer.email}`}
                              className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-[#0d9488] transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5 text-[#0d9488] shrink-0" />
                              <span className="truncate max-w-[150px]">{customer.email}</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Interval */}
                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-[#f4f1ec] text-xs text-slate-700 font-mono border border-[#e2dbcb]">
                          {customer.followUpInterval} {customer.followUpInterval === 1 ? 'day' : 'days'}
                        </span>
                      </td>

                      {/* Last Contacted */}
                      <td className="px-4 py-3.5">
                        <span className="text-slate-800">
                          {formatDate(customer.lastContactedAt)}
                        </span>
                      </td>

                      {/* Next Follow-up & Status Badge */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-bold text-slate-900">
                            {formatDate(customer.nextFollowUpDate)}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeInfo.bg} ${badgeInfo.text} ${badgeInfo.border}`}
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
                            className="p-1.5 rounded-lg bg-[#4cc9b1]/20 hover:bg-[#4cc9b1]/40 text-[#0f766e] border border-[#4cc9b1]/50 transition-all disabled:opacity-50"
                          >
                            <CheckCircle className={`w-4 h-4 ${isContacting ? 'animate-spin' : ''}`} />
                          </button>

                          {/* Edit Customer */}
                          <button
                            onClick={() => onEditCustomer(customer)}
                            title="Edit Customer"
                            className="p-1.5 rounded-lg bg-[#f4f1ec] hover:bg-[#e2dbcb] text-slate-700 hover:text-slate-900 border border-[#e2dbcb] transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete Customer */}
                          <button
                            onClick={() => onDeleteCustomer(customer)}
                            title="Delete Customer"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all"
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
