export interface Medication {
  id?: number;
  name: string;
  dosage: string;
  instructions: string;
  photoBlob?: Blob | null;
  timeSlots: string[]; // e.g. ['morning', 'evening']
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
