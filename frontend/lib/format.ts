let dateFormat: Intl.DateTimeFormat | undefined;

export const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

export function formatDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export function formatDate(iso: string): string {
  dateFormat ??= new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  return dateFormat.format(new Date(iso));
}

