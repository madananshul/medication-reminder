export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function today(): string {
  return toDateString(new Date());
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

export function formatDateDisplay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const todayStr = today();
  if (dateStr === todayStr) return 'Today';
  if (dateStr === addDays(todayStr, -1)) return 'Yesterday';
  if (dateStr === addDays(todayStr, 1)) return 'Tomorrow';
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}
