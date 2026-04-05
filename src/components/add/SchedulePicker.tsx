'use client';

import { TIME_SLOTS } from '@/lib/constants';

interface SchedulePickerProps {
  selected: string[];
  onChange: (slots: string[]) => void;
}

export function SchedulePicker({ selected, onChange }: SchedulePickerProps) {
  const toggle = (slotId: string) => {
    onChange(
      selected.includes(slotId)
        ? selected.filter((s) => s !== slotId)
        : [...selected, slotId]
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-base font-medium text-gray-700">When to take</label>
      <div className="grid grid-cols-2 gap-2">
        {TIME_SLOTS.map((slot) => {
          const isSelected = selected.includes(slot.id);
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => toggle(slot.id)}
              className={`
                flex items-center gap-2 p-3 rounded-xl border-2 text-lg font-medium
                transition-colors min-h-[48px]
                ${isSelected
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
    </div>
  );
}
