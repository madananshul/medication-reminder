'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CameraCapture } from '@/components/add/CameraCapture';
import { PhotoPreview } from '@/components/add/PhotoPreview';
import { AnalysisResult } from '@/components/add/AnalysisResult';
import { MedicationForm } from '@/components/medications/MedicationForm';
import { PrescriptionReview } from '@/components/add/PrescriptionReview';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { addMedication } from '@/lib/db-hooks';
import {
  analyzeMedicationPhoto,
  analyzePrescriptionPhoto,
  type MedicationAnalysis,
  type PrescriptionAnalysis,
  type PrescriptionMedication,
} from '@/lib/claude-vision';

type Step = 'choose' | 'preview' | 'form' | 'prescription-review';
type ScanMode = 'medication' | 'prescription' | null;

export default function AddPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = useState<Step>('choose');
  const [scanMode, setScanMode] = useState<ScanMode>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MedicationAnalysis | null>(null);
  const [prescriptionResult, setPrescriptionResult] = useState<PrescriptionAnalysis | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>('');

  const handleCapture = useCallback((file: File, mode: ScanMode) => {
    setPhotoFile(file);
    setPhotoUrl(URL.createObjectURL(file));
    setScanMode(mode);
    setStep('preview');
    setError('');
  }, []);

  const handleAnalyze = async () => {
    if (!photoFile) return;
    setAnalyzing(true);
    setError('');

    try {
      const maxDim = scanMode === 'prescription' ? 1200 : 600;
      const base64 = await fileToBase64(photoFile, maxDim);

      if (scanMode === 'prescription') {
        const result = await analyzePrescriptionPhoto(base64, 'image/jpeg');
        setPrescriptionResult(result);
        setStep('prescription-review');
      } else {
        const result = await analyzeMedicationPhoto(base64, 'image/jpeg');
        setAnalysis(result);
        setStep('form');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not analyze the photo.';
      if (scanMode === 'prescription') {
        setError(`${message} Try a clearer photo or add medications manually.`);
        setStep('choose');
      } else {
        setError(`${message} You can enter the details manually below.`);
        setStep('form');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleManualEntry = () => {
    setAnalysis(null);
    setScanMode(null);
    setStep('form');
  };

  const handleRetake = () => {
    setPhotoFile(null);
    setPhotoUrl('');
    setAnalysis(null);
    setPrescriptionResult(null);
    setScanMode(null);
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

  const handleBatchSave = async (medications: PrescriptionMedication[]) => {
    setSaving(true);
    try {
      for (const med of medications) {
        await addMedication({
          name: med.name,
          dosage: med.dosage,
          instructions: med.instructions,
          timeSlots: med.timeSlots,
          photoBlob: null,
          active: true,
        });
      }
      showToast(`${medications.length} medication${medications.length !== 1 ? 's' : ''} added!`);
      router.push('/');
    } catch {
      showToast('Failed to save medications', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Step labels for the progress indicator
  const stepLabels = scanMode === 'prescription'
    ? ['Capture', 'Review', 'Save']
    : ['Capture', 'Review', 'Save'];
  const stepKeys: Step[] = scanMode === 'prescription'
    ? ['choose', 'preview', 'prescription-review']
    : ['choose', 'preview', 'form'];

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {stepLabels.map((label, i) => {
          const stepIndex = stepKeys.indexOf(step);
          const isActive = i <= stepIndex;
          return (
            <div key={label + i} className="flex items-center gap-2">
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
        <div className="space-y-4">
          {error && (
            <Card className="border-yellow-300 bg-yellow-50">
              <p className="text-yellow-800 text-base">{error}</p>
            </Card>
          )}

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Scan Medication Box</h2>
            <p className="text-base text-gray-600 mb-4">
              Take a photo of one medication box and we&apos;ll read the label
            </p>
            <CameraCapture onCapture={(file) => handleCapture(file, 'medication')} />
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Scan Prescription</h2>
            <p className="text-base text-gray-600 mb-4">
              Take a photo of a doctor&apos;s prescription to add all medications at once
            </p>
            <CameraCapture onCapture={(file) => handleCapture(file, 'prescription')} />
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
              scanLabel={scanMode === 'prescription' ? 'Scan Prescription' : 'Scan Label'}
            />
          </Card>
        </div>
      )}

      {/* Step: Form (single medication with optional analysis) */}
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

      {/* Step: Prescription review (batch) */}
      {step === 'prescription-review' && prescriptionResult && (
        <PrescriptionReview
          analysis={prescriptionResult}
          onSave={handleBatchSave}
          onCancel={handleRetake}
          saving={saving}
        />
      )}
    </div>
  );
}

async function fileToBase64(file: File, maxDimension: number = 600): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
