export interface DoseLog {
  id?: number;
  medicationId: number;
  timeSlotId: string;
  scheduledDate: string; // YYYY-MM-DD
  takenAt: string | null;
  skipped: boolean;
}
