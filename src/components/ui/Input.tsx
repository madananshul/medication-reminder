import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-base font-medium text-gray-700">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 text-lg rounded-xl border border-gray-300
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
            placeholder:text-gray-400 min-h-[48px]
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
