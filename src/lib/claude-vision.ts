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

  if (!response.ok) {
    throw new Error('Failed to analyze medication photo');
  }

  return response.json();
}
