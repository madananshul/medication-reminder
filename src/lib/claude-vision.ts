export interface MedicationAnalysis {
  name: string;
  dosage: string;
  instructions: string;
  confidence: 'high' | 'medium' | 'low';
}

export async function analyzeMedicationPhoto(
  photoBase64: string,
  mediaType: string
): Promise<MedicationAnalysis> {
  const response = await fetch('/api/analyze-medication', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: photoBase64, mediaType }),
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || 'Failed to analyze medication photo');
  }

  if (!data.name && !data.dosage) {
    throw new Error('Could not read the medication label. Try a clearer photo or enter details manually.');
  }

  return data;
}
