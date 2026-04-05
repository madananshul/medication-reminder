'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import type { Medication } from '@/types/medication';
import type { DoseLog } from '@/types/tracking';
import type { AppSettings } from '@/types/notification';
import { DEFAULT_SETTINGS } from './constants';
import { today } from './date-utils';

export function useMedications() {
  return useLiveQuery(() => db.medications.where('active').equals(1).toArray(), []) ?? [];
}

export function useAllMedications() {
  return useLiveQuery(() => db.medications.toArray(), []) ?? [];
}

export function useMedication(id: number | undefined) {
  return useLiveQuery(
    () => (id ? db.medications.get(id) : undefined),
    [id]
  );
}

export function useDoseLogsForDate(date?: string) {
  const d = date ?? today();
  return useLiveQuery(
    () => db.doseLogs.where('scheduledDate').equals(d).toArray(),
    [d]
  ) ?? [];
}

export function useSettings(): AppSettings {
  return useLiveQuery(() => db.appSettings.get(1), []) ?? DEFAULT_SETTINGS;
}

// Mutation helpers

export async function addMedication(med: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString();
  return db.medications.add({
    ...med,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateMedication(id: number, changes: Partial<Medication>) {
  return db.medications.update(id, {
    ...changes,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteMedication(id: number) {
  await db.transaction('rw', [db.medications, db.doseLogs], async () => {
    await db.medications.delete(id);
    await db.doseLogs.where('medicationId').equals(id).delete();
  });
}

export async function toggleDose(
  medicationId: number,
  timeSlotId: string,
  scheduledDate: string
) {
  const existing = await db.doseLogs
    .where('[medicationId+scheduledDate]')
    .equals([medicationId, scheduledDate])
    .filter((log) => log.timeSlotId === timeSlotId)
    .first();

  if (existing?.takenAt) {
    // Untake
    await db.doseLogs.update(existing.id!, { takenAt: null, skipped: false });
  } else if (existing) {
    // Mark as taken
    await db.doseLogs.update(existing.id!, {
      takenAt: new Date().toISOString(),
      skipped: false,
    });
  } else {
    // Create new log as taken
    await db.doseLogs.add({
      medicationId,
      timeSlotId,
      scheduledDate,
      takenAt: new Date().toISOString(),
      skipped: false,
    });
  }
}

export async function ensureDoseLogsForDate(
  medications: Medication[],
  date: string
) {
  const existingLogs = await db.doseLogs
    .where('scheduledDate')
    .equals(date)
    .toArray();

  const existingKeys = new Set(
    existingLogs.map((l) => `${l.medicationId}-${l.timeSlotId}`)
  );

  const newLogs: Omit<DoseLog, 'id'>[] = [];
  for (const med of medications) {
    if (!med.active || !med.id) continue;
    for (const slot of med.timeSlots) {
      const key = `${med.id}-${slot}`;
      if (!existingKeys.has(key)) {
        newLogs.push({
          medicationId: med.id,
          timeSlotId: slot,
          scheduledDate: date,
          takenAt: null,
          skipped: false,
        });
      }
    }
  }

  if (newLogs.length > 0) {
    await db.doseLogs.bulkAdd(newLogs);
  }
}
