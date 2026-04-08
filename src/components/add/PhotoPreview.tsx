'use client';

import { Button } from '@/components/ui/Button';

interface PhotoPreviewProps {
  imageUrl: string;
  onAnalyze: () => void;
  onRetake: () => void;
  analyzing: boolean;
  scanLabel?: string;
}

export function PhotoPreview({ imageUrl, onAnalyze, onRetake, analyzing, scanLabel }: PhotoPreviewProps) {
  const buttonLabel = scanLabel ?? 'Scan Label';
  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden border-2 border-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Medication photo"
          className="w-full max-h-[300px] object-contain bg-gray-100"
        />
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" size="lg" className="flex-1" onClick={onRetake} disabled={analyzing}>
          Retake
        </Button>
        <Button size="lg" className="flex-1" onClick={onAnalyze} loading={analyzing}>
          {analyzing ? 'Analyzing...' : buttonLabel}
        </Button>
      </div>
    </div>
  );
}
