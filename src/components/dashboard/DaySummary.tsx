import type { DoseLog } from '@/types/tracking';

interface DaySummaryProps {
  logs: DoseLog[];
  totalDoses: number;
}

export function DaySummary({ logs, totalDoses }: DaySummaryProps) {
  const taken = logs.filter((l) => l.takenAt).length;
  const percentage = totalDoses > 0 ? Math.round((taken / totalDoses) * 100) : 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold text-gray-700">
          {taken} of {totalDoses} taken
        </span>
        <span className="text-lg font-bold text-blue-600">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${percentage}% of medications taken`}
        />
      </div>
    </div>
  );
}
