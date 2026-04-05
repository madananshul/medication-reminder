'use client';

import { useState, useEffect } from 'react';
import { DateSelector } from '@/components/dashboard/DateSelector';
import { DaySummary } from '@/components/dashboard/DaySummary';
import { TimeSlotCard } from '@/components/dashboard/TimeSlotCard';
import { useMedications, useDoseLogsForDate, useSettings, ensureDoseLogsForDate } from '@/lib/db-hooks';
import { today } from '@/lib/date-utils';
import { TIME_SLOTS } from '@/lib/constants';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(today());
  const medications = useMedications();
  const logs = useDoseLogsForDate(selectedDate);
  const settings = useSettings();

  useEffect(() => {
    if (medications.length > 0) {
      ensureDoseLogsForDate(medications, selectedDate);
    }
  }, [medications, selectedDate]);

  const totalDoses = medications.reduce((sum, med) => sum + med.timeSlots.length, 0);

  if (medications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <span className="text-6xl mb-4">💊</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No medications yet</h2>
        <p className="text-lg text-gray-600 mb-6">Add your first medication to get started</p>
        <Link href="/add">
          <Button size="lg">Add Medication</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <DateSelector date={selectedDate} onChange={setSelectedDate} />
      <DaySummary logs={logs} totalDoses={totalDoses} />

      {TIME_SLOTS.map((slot) => {
        const slotMeds = medications.filter((m) => m.timeSlots.includes(slot.id));
        return (
          <TimeSlotCard
            key={slot.id}
            slotId={slot.id}
            medications={slotMeds}
            logs={logs}
            date={selectedDate}
            settings={settings}
          />
        );
      })}
    </div>
  );
}
