import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, id, className = '', ...props }, ref) => {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1">
        <label htmlFor={selectId} className="block text-base font-medium text-gray-700">
          {label}
        </label>
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-4 py-3 text-lg rounded-xl border border-gray-300
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
            min-h-[48px] bg-white
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
