'use client';

import { useEffect, type ReactNode } from 'react';
import { useMedications, useSettings } from '@/lib/db-hooks';
import { TIME_SLOTS } from '@/lib/constants';

export function NotificationProvider({ children }: { children: ReactNode }) {
  const medications = useMedications();
  const settings = useSettings();

  useEffect(() => {
    if (!settings.notificationsEnabled || medications.length === 0) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const now = new Date();

    for (const slot of TIME_SLOTS) {
      const timeStr = settings.timeSlotTimes[slot.id] ?? slot.defaultTime;
      const [h, m] = timeStr.split(':').map(Number);

      const target = new Date();
      target.setHours(h, m, 0, 0);

      const diff = target.getTime() - now.getTime();
      if (diff <= 0) continue; // Already passed today

      const medsForSlot = medications.filter((med) => med.timeSlots.includes(slot.id));
      if (medsForSlot.length === 0) continue;

      const timeout = setTimeout(() => {
        const names = medsForSlot.map((m) => m.name).join(', ');
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'SHOW_NOTIFICATION',
            title: `${slot.icon} ${slot.label} Medications`,
            body: `Time to take: ${names}`,
          });
        } else {
          new Notification(`${slot.icon} ${slot.label} Medications`, {
            body: `Time to take: ${names}`,
            icon: '/icons/icon-192.png',
          });
        }
      }, diff);

      timeouts.push(timeout);
    }

    return () => timeouts.forEach(clearTimeout);
  }, [medications, settings]);

  return <>{children}</>;
}
