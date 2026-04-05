'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Primary: native camera via input capture */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
        aria-label="Take photo of medication"
      />
      <Button
        size="lg"
        className="w-full"
        onClick={() => inputRef.current?.click()}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
        </svg>
        Take Photo of Medication
      </Button>

      {/* Fallback: file picker */}
      <div className="text-center">
        <label className="cursor-pointer text-blue-600 hover:text-blue-700 text-lg font-medium underline">
          Or choose from gallery
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
