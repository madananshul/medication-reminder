'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CameraCapture } from '@/components/add/CameraCapture';
import { PhotoPreview } from '@/components/add/PhotoPreview';
import { AnalysisResult } from '@/components/add/AnalysisResult';
import { MedicationForm } from '@/components/medications/MedicationForm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { addMedication } from '@/lib/db-hooks';
import { analyzeMedicationPhoto, type MedicationAnalysis } from '@/lib/claude-vision';

type Step = 'choose' | 'preview' | 'form';

export default function AddPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>('choose');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MedicationAnalysis | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  const handleCapture = useCallback((file: File) => {
    setPhotoFile(file);
    setPhotoUrl(URL.createObjectURL(file));
    setStep('preview');
    setError('');
  }, []);

  const handleAnalyze = async () => {
    if (!photoFile) return;
    setAnalyzing(true);
    setError('');

    try {
      const base64 = await fileToBase64(photoFile);
      const result = await analyzeMedicationPhoto(base64, photoFile.type);
      setAnalysis(result);
      setStep('form');
    } catch {
      setError('Could not analyze the photo. You can still enter details manually.');
      setStep('form');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleManualEntry = () => {
    setAnalysis(null);
    setStep('form');
  };

  const handleRetake = () => {
    setPhotoFile(null);
    setPhotoUrl('');
    setAnalysis(null);
    setStep('choose');
  };

  const handleSubmit = async (data: { name: string; dosage: string; instructions: string; timeSlots: string[] }) => {
    setSaving(true);
    try {
      await addMedication({
        ...data,
        photoBlob: photoFile ?? null,
        active: true,
      });
      showToast('Medication added!');
      router.push('/');
    } catch {
      showToast('Failed to save medication', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {['Capture', 'Review', 'Save'].map((label, i) => {
          const stepIndex = ['choose', 'preview', 'form'].indexOf(step);
          const isActive = i <= stepIndex;
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i + 1}
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
              {i < 2 && <div className={`w-8 h-0.5 ${isActive ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          );
        })}
      </div>

      {/* Step: Choose (camera or manual) */}
      {step === 'choose' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Scan Medication</h2>
            <p className="text-base text-gray-600 mb-4">
              Take a photo of your medication box and we&apos;ll read the label for you
            </p>
            <CameraCapture onCapture={handleCapture} />
          </Card>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleManualEntry}
          >
            Enter Manually
          </Button>
        </div>
      )}

      {/* Step: Preview photo */}
      {step === 'preview' && photoUrl && (
        <div className="space-y-4">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Review Photo</h2>
            <PhotoPreview
              imageUrl={photoUrl}
              onAnalyze={handleAnalyze}
              onRetake={handleRetake}
              analyzing={analyzing}
            />
          </Card>
        </div>
      )}

      {/* Step: Form (with optional analysis) */}
      {step === 'form' && (
        <div className="space-y-4">
          {error && (
            <Card className="border-yellow-300 bg-yellow-50">
              <p className="text-yellow-800 text-base">{error}</p>
            </Card>
          )}

          {analysis && <AnalysisResult result={analysis} />}

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Medication Details</h2>
            <MedicationForm
              initialData={analysis ? {
                name: analysis.name,
                dosage: analysis.dosage,
                instructions: analysis.instructions,
                timeSlots: ['morning'],
              } : undefined}
              onSubmit={handleSubmit}
              onCancel={handleRetake}
              submitLabel="Add Medication"
              loading={saving}
            />
          </Card>
        </div>
      )}
    </div>
  );
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/...;base64, prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
