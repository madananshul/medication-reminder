'use client';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, sublabel, disabled }: CheckboxProps) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        w-full flex items-center gap-4 p-4 rounded-xl transition-colors duration-150
        min-h-[64px] text-left
        ${checked ? 'bg-green-50' : 'bg-white hover:bg-gray-50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:bg-gray-100'}
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
      `}
    >
      <div
        className={`
          w-8 h-8 rounded-lg border-2 flex items-center justify-center shrink-0
          transition-colors duration-150
          ${checked ? 'bg-green-600 border-green-600' : 'border-gray-400 bg-white'}
        `}
      >
        {checked && (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-lg font-medium block ${checked ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {label}
        </span>
        {sublabel && (
          <span className="text-base text-gray-500 block">{sublabel}</span>
        )}
      </div>
    </button>
  );
}
