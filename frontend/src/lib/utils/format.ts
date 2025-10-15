import { format, differenceInDays, parseISO } from 'date-fns';

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
};

export const formatDate = (dateString: string, formatString: string = 'MMM dd, yyyy'): string => {
  try {
    return format(parseISO(dateString), formatString);
  } catch {
    return dateString;
  }
};

export const getDaysUntil = (dateString: string): number => {
  try {
    return differenceInDays(parseISO(dateString), new Date());
  } catch {
    return 0;
  }
};

export const getProgressPercentage = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min(Math.round((current / target) * 100), 100);
};
