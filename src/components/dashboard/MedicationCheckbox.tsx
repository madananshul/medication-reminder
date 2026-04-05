'use client';

import { Checkbox } from '@/components/ui/Checkbox';
import { toggleDose } from '@/lib/db-hooks';
import type { Medication } from '@/types/medication';
import type { DoseLog } from '@/types/tracking';

interface MedicationCheckboxProps {
  medication: Medication;
  log: DoseLog | undefined;
  timeSlotId: string;
  date: string;
}

export function MedicationCheckbox({ medication, log, timeSlotId, date }: MedicationCheckboxProps) {
  const taken = !!log?.takenAt;

  const handleToggle = () => {
    toggleDose(medication.id!, timeSlotId, date);
  };

  return (
    <Checkbox
      checked={taken}
      onChange={handleToggle}
      label={medication.name}
      sublabel={medication.dosage}
    />
  );
}
