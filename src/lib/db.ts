import Dexie, { type EntityTable } from 'dexie';
import type { Medication } from '@/types/medication';
import type { DoseLog } from '@/types/tracking';
import type { PushSubscriptionRecord, AppSettings } from '@/types/notification';
import { DEFAULT_SETTINGS } from './constants';

class MedReminderDB extends Dexie {
  medications!: EntityTable<Medication, 'id'>;
  doseLogs!: EntityTable<DoseLog, 'id'>;
  pushSubscriptions!: EntityTable<PushSubscriptionRecord, 'id'>;
  appSettings!: EntityTable<AppSettings, 'id'>;

  constructor() {
    super('MedReminderDB');
    this.version(1).stores({
      medications: '++id, name, active',
      doseLogs: '++id, medicationId, timeSlotId, scheduledDate, [medicationId+scheduledDate], [scheduledDate+timeSlotId]',
      pushSubscriptions: '++id, endpoint',
      appSettings: 'id',
    });
  }
}

export const db = new MedReminderDB();

export async function ensureDefaultSettings() {
  const existing = await db.appSettings.get(1);
  if (!existing) {
    await db.appSettings.put(DEFAULT_SETTINGS);
  }
}
