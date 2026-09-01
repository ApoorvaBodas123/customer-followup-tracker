import { Users, Clock, AlertTriangle, CalendarCheck } from 'lucide-react';

export const StatsCards = ({ metrics, activeFilter, onSelectFilter }) => {
  const cards = [
    {
      id: 'all',
      title: 'Total Customers',
      count: metrics?.total ?? 0,
      icon: Users,
      color: 'text-slate-800',
      bgColor: 'bg-slate-100',
      borderColor: 'border-[#e2dbcb]',
      activeBorder: 'border-[#4cc9b1] ring-2 ring-[#4cc9b1]/40 bg-white',
      description: 'Active client directory',
    },
    {
      id: 'due_today',
      title: 'Due Today',
      count: metrics?.dueToday ?? 0,
      icon: Clock,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      activeBorder: 'border-amber-400 ring-2 ring-amber-400/40 bg-white',
      description: 'Require attention today',
      pulse: (metrics?.dueToday ?? 0) > 0,
    },
    {
      id: 'overdue',
      title: 'Overdue',
      count: metrics?.overdue ?? 0,
      icon: AlertTriangle,
      color: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      activeBorder: 'border-rose-400 ring-2 ring-rose-400/40 bg-white',
      description: 'Past scheduled follow-up',
      pulse: (metrics?.overdue ?? 0) > 0,
    },
    {
      id: 'upcoming',
      title: 'Upcoming',
      count: metrics?.upcoming ?? 0,
      icon: CalendarCheck,
      color: 'text-[#0f766e]',
      bgColor: 'bg-[#4cc9b1]/15',
      borderColor: 'border-[#4cc9b1]/40',
      activeBorder: 'border-[#4cc9b1] ring-2 ring-[#4cc9b1]/40 bg-white',
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
            className={`text-left p-4 sm:p-5 rounded-2xl bg-white border transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden group shadow-sm ${
              isActive ? card.activeBorder : `${card.borderColor} hover:border-[#4cc9b1]`
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-slate-600 group-hover:text-slate-900">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bgColor} ${card.color}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.count}
              </span>
              {card.pulse && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                  Action Needed
                </span>
              )}
            </div>

            <p className="mt-1 text-[11px] sm:text-xs text-slate-500 truncate">
              {card.description}
            </p>

            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#4cc9b1]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
