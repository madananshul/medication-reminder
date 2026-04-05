'use client';

import { Card } from '@/components/ui/Card';
import type { MedicationAnalysis } from '@/lib/claude-vision';

interface AnalysisResultProps {
  result: MedicationAnalysis;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
  const confidenceColor = {
    high: 'text-green-600 bg-green-50',
    medium: 'text-yellow-600 bg-yellow-50',
    low: 'text-red-600 bg-red-50',
  }[result.confidence];

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50/50">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🤖</span>
        <h3 className="text-lg font-bold text-gray-900">AI-Detected Info</h3>
        <span className={`ml-auto px-2 py-0.5 rounded-lg text-sm font-medium ${confidenceColor}`}>
          {result.confidence} confidence
        </span>
      </div>
      <div className="space-y-1 text-base">
        {result.name && <p><span className="font-medium">Name:</span> {result.name}</p>}
        {result.dosage && <p><span className="font-medium">Dosage:</span> {result.dosage}</p>}
        {result.instructions && <p><span className="font-medium">Instructions:</span> {result.instructions}</p>}
      </div>
      <p className="text-sm text-gray-500 mt-3">Review and edit the form below if needed</p>
    </Card>
  );
}
