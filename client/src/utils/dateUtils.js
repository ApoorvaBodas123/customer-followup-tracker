/**
 * Date utility functions for Customer Follow-up calculations and display
 */

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatShortDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatDateForInput = (dateString) => {
  if (!dateString) {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
};

export const calculateNextDate = (lastContactDate, intervalDays) => {
  if (!lastContactDate || !intervalDays) return null;
  const last = new Date(lastContactDate).getTime();
  const intervalMs = Number(intervalDays) * 24 * 60 * 60 * 1000;
  return new Date(last + intervalMs);
};

export const getStatusBadgeInfo = (status, daysRemaining) => {
  switch (status) {
    case 'due_today':
      return {
        label: 'Due Today',
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-300',
        dot: 'bg-amber-500 animate-pulse',
      };
    case 'overdue':
      return {
        label: `Overdue by ${Math.abs(daysRemaining || 1)}d`,
        bg: 'bg-rose-100',
        text: 'text-rose-800',
        border: 'border-rose-300',
        dot: 'bg-rose-500',
      };
    case 'upcoming':
      return {
        label: daysRemaining === 1 ? 'In 1 day' : `In ${daysRemaining} days`,
        bg: 'bg-[#4cc9b1]/15',
        text: 'text-[#0f766e]',
        border: 'border-[#4cc9b1]/50',
        dot: 'bg-[#4cc9b1]',
      };
    default:
      return {
        label: 'Pending',
        bg: 'bg-[#e2dbcb]/40',
        text: 'text-slate-700',
        border: 'border-[#e2dbcb]',
        dot: 'bg-slate-400',
      };
  }
};
