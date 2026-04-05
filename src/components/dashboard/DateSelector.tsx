'use client';

import { formatDateDisplay, addDays } from '@/lib/date-utils';

interface DateSelectorProps {
  date: string;
  onChange: (date: string) => void;
}

export function DateSelector({ date, onChange }: DateSelectorProps) {
  return (
    <div className="flex items-center justify-between gap-2 mb-4">
      <button
        onClick={() => onChange(addDays(date, -1))}
        className="p-3 rounded-xl hover:bg-gray-200 active:bg-gray-300 min-w-[48px] min-h-[48px] flex items-center justify-center"
        aria-label="Previous day"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <span className="text-xl font-bold text-gray-900">{formatDateDisplay(date)}</span>
      <button
        onClick={() => onChange(addDays(date, 1))}
        className="p-3 rounded-xl hover:bg-gray-200 active:bg-gray-300 min-w-[48px] min-h-[48px] flex items-center justify-center"
        aria-label="Next day"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
