'use client';

import { useState, type FormEvent } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TIME_SLOTS } from '@/lib/constants';

interface MedicationFormData {
  name: string;
  dosage: string;
  instructions: string;
  timeSlots: string[];
}

interface MedicationFormProps {
  initialData?: MedicationFormData;
  onSubmit: (data: MedicationFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  loading?: boolean;
}

export function MedicationForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  loading,
}: MedicationFormProps) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [dosage, setDosage] = useState(initialData?.dosage ?? '');
  const [instructions, setInstructions] = useState(initialData?.instructions ?? '');
  const [timeSlots, setTimeSlots] = useState<string[]>(initialData?.timeSlots ?? ['morning']);

  const toggleSlot = (slotId: string) => {
    setTimeSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((s) => s !== slotId)
        : [...prev, slotId]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), dosage: dosage.trim(), instructions: instructions.trim(), timeSlots });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Medication Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Aspirin"
        required
        autoFocus
      />
      <Input
        label="Dosage"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
        placeholder="e.g., 100mg, 1 tablet"
      />
      <div className="space-y-1">
        <label className="block text-base font-medium text-gray-700">Instructions</label>
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g., Take with food"
          rows={2}
          className="w-full px-4 py-3 text-lg rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none placeholder:text-gray-400 min-h-[48px] resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-base font-medium text-gray-700">When to take</label>
        <div className="grid grid-cols-2 gap-2">
          {TIME_SLOTS.map((slot) => {
            const selected = timeSlots.includes(slot.id);
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => toggleSlot(slot.id)}
                className={`
                  flex items-center gap-2 p-3 rounded-xl border-2 text-lg font-medium
                  transition-colors min-h-[48px]
                  ${selected
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }
                `}
              >
                <span className="text-xl">{slot.icon}</span>
                {slot.label}
              </button>
            );
          })}
        </div>
        {timeSlots.length === 0 && (
          <p className="text-red-600 text-sm">Please select at least one time</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="lg"
          className="flex-1"
          disabled={!name.trim() || timeSlots.length === 0}
          loading={loading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
