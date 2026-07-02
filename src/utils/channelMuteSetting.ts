import { format } from 'date-fns';

// Sentinel value used to represent an indefinite ("forever") mute, since the
// API requires a concrete date. Any date at/after this is treated as forever.
export const FOREVER_MUTE_DATE = '9999-12-31T23:59:59.999Z';

export const isForeverMute = (mutedUntil?: string): boolean => {
  if (!mutedUntil) return false;
  return new Date(mutedUntil).getFullYear() >= 9999;
};

export const formatMutedUntil = (mutedUntil?: string): string => {
  if (!mutedUntil) return '';
  if (isForeverMute(mutedUntil)) return 'forever';
  return format(new Date(mutedUntil), 'dd MMM yyyy, HH:mm');
};
