'use client';

import { Card } from '@/components/ui/Card';
import { MedicationCheckbox } from './MedicationCheckbox';
import { getTimeSlotLabel, getTimeSlotIcon } from '@/lib/time-slots';
import { formatTime } from '@/lib/date-utils';
import type { Medication } from '@/types/medication';
import type { DoseLog } from '@/types/tracking';
import type { AppSettings } from '@/types/notification';

interface TimeSlotCardProps {
  slotId: string;
  medications: Medication[];
  logs: DoseLog[];
  date: string;
  settings: AppSettings;
}

export function TimeSlotCard({ slotId, medications, logs, date, settings }: TimeSlotCardProps) {
  if (medications.length === 0) return null;

  const time = settings.timeSlotTimes[slotId];
  const allTaken = medications.every((med) =>
    logs.some((log) => log.medicationId === med.id && log.timeSlotId === slotId && log.takenAt)
  );

  return (
    <Card className={`mb-3 ${allTaken ? 'border-green-300 bg-green-50/50' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{getTimeSlotIcon(slotId)}</span>
        <h2 className="text-xl font-bold text-gray-900">{getTimeSlotLabel(slotId)}</h2>
        {time && (
          <span className="text-base text-gray-500 ml-auto">{formatTime(time)}</span>
        )}
        {allTaken && (
          <span className="text-green-600 text-base font-semibold ml-2">Done</span>
        )}
      </div>
      <div className="space-y-1">
        {medications.map((med) => (
          <MedicationCheckbox
            key={med.id}
            medication={med}
            log={logs.find((l) => l.medicationId === med.id && l.timeSlotId === slotId)}
            timeSlotId={slotId}
            date={date}
          />
        ))}
      </div>
    </Card>
  );
}
