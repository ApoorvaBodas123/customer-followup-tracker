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
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400 animate-pulse',
      };
    case 'overdue':
      return {
        label: `Overdue by ${Math.abs(daysRemaining || 1)}d`,
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        dot: 'bg-rose-500',
      };
    case 'upcoming':
      return {
        label: daysRemaining === 1 ? 'In 1 day' : `In ${daysRemaining} days`,
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
      };
    default:
      return {
        label: 'Pending',
        bg: 'bg-slate-500/15',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-400',
      };
  }
};
