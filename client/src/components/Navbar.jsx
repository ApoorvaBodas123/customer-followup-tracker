import { UserPlus, RefreshCw, Calendar } from 'lucide-react';

export const Navbar = ({ onAddCustomer, onRefresh, isLoading }) => {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 bg-[#f4f1ec]/90 backdrop-blur-md border-b border-[#e2dbcb] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Customer Follow-up Tracker
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Stay on top of customer relationships & never miss a follow-up
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#e2dbcb] text-xs font-medium text-slate-700 shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-[#0d9488]" />
              <span>Today: {todayFormatted}</span>
            </div>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh Data"
              className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-[#e2dbcb]/40 border border-[#e2dbcb] text-slate-600 hover:text-slate-900 shadow-sm transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#0d9488]' : ''}`} />
            </button>

            <button
              onClick={onAddCustomer}
              className="inline-flex items-center space-x-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-[#4cc9b1] hover:bg-[#38b8a0] text-slate-950 font-semibold text-sm shadow-md shadow-[#4cc9b1]/25 hover:shadow-[#4cc9b1]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <UserPlus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
