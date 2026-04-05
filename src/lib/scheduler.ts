import { TIME_SLOTS } from './constants';
import type { AppSettings } from '@/types/notification';

export interface UpcomingNotification {
  slotId: string;
  label: string;
  icon: string;
  time: string; // HH:MM
  msUntil: number;
}

export function getUpcomingNotifications(settings: AppSettings): UpcomingNotification[] {
  const now = new Date();
  const results: UpcomingNotification[] = [];

  for (const slot of TIME_SLOTS) {
    const timeStr = settings.timeSlotTimes[slot.id] ?? slot.defaultTime;
    const [h, m] = timeStr.split(':').map(Number);

    const target = new Date();
    target.setHours(h, m, 0, 0);

    const diff = target.getTime() - now.getTime();
    if (diff > 0) {
      results.push({
        slotId: slot.id,
        label: slot.label,
        icon: slot.icon,
        time: timeStr,
        msUntil: diff,
      });
    }
  }

  return results;
}
