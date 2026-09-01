import React from 'react';
import { Users, Clock, AlertTriangle, CalendarCheck } from 'lucide-react';

export const StatsCards = ({ metrics, activeFilter, onSelectFilter }) => {
  const cards = [
    {
      id: 'all',
      title: 'Total Customers',
      count: metrics?.total ?? 0,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/30',
      description: 'Active client directory',
    },
    {
      id: 'due_today',
      title: 'Due Today',
      count: metrics?.dueToday ?? 0,
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/30',
      description: 'Require attention today',
      pulse: (metrics?.dueToday ?? 0) > 0,
    },
    {
      id: 'overdue',
      title: 'Overdue',
      count: metrics?.overdue ?? 0,
      icon: AlertTriangle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/30',
      description: 'Past scheduled follow-up',
      pulse: (metrics?.overdue ?? 0) > 0,
    },
    {
      id: 'upcoming',
      title: 'Upcoming',
      count: metrics?.upcoming ?? 0,
      icon: CalendarCheck,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/30',
      description: 'Scheduled for later',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onSelectFilter(card.id)}
            className={`text-left p-4 sm:p-5 rounded-2xl bg-slate-900/90 border transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden group ${
              isActive ? card.activeBorder : `${card.borderColor} hover:border-slate-600`
            }`}
          >
            {/* Top Row: Icon and Title */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-slate-400 group-hover:text-slate-300">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bgColor} ${card.color}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            {/* Count */}
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {card.count}
              </span>
              {card.pulse && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400/20 text-amber-300 animate-pulse">
                  Action Needed
                </span>
              )}
            </div>

            {/* Subtext */}
            <p className="mt-1 text-[11px] sm:text-xs text-slate-500 truncate">
              {card.description}
            </p>

            {/* Indicator bar */}
            {isActive && (
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent ${card.color}`} />
            )}
          </button>
        );
      })}
    </div>
  );
};
