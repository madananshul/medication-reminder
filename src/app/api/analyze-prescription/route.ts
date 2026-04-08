import { NextRequest, NextResponse } from 'next/server';

const AZURE_ENDPOINT = 'https://ai-foundry-flowcoachai-east-us2.services.ai.azure.com/api/projects/flowcoachai/openai/v1/responses';
const MODEL = 'gpt-5.4-mini';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.AZURE_AI_FOUNDRY_GPT_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Photo scan is not available.' },
        { status: 500 }
      );
    }

    const { image, mediaType } = await request.json();

    if (!image || !mediaType) {
      return NextResponse.json(
        { error: 'Missing image or mediaType' },
        { status: 400 }
      );
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(mediaType)) {
      return NextResponse.json(
        { error: 'Invalid image type. Use JPEG, PNG, GIF, or WebP.' },
        { status: 400 }
      );
    }

    const response = await fetch(AZURE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        model: MODEL,
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_image',
                image_url: `data:${mediaType};base64,${image}`,
              },
              {
                type: 'input_text',
                text: `Analyze this doctor's prescription photo. Extract ALL medications listed.

Indian prescriptions typically have a table with columns: Medicine, Dose, Frequency, Duration.

The Dose column uses the pattern X-Y-Z where:
- X = Morning dose (0 or 1)
- Y = Afternoon dose (0 or 1)
- Z = Evening/Dinner dose (0 or 1)

Map dose patterns to time slots:
- "1-1-1" → ["morning", "noon", "evening"]
- "1-0-1" → ["morning", "evening"]
- "1-0-0" → ["morning"]
- "0-0-1" → ["evening"]
- "0-1-0" → ["noon"]
- "1-1-0" → ["morning", "noon"]
- "0-1-1" → ["noon", "evening"]
- If dose says "at bedtime" or "HS" → ["bedtime"]
- If dose says "SOS" or "as needed" → ["morning"] (default)

For each medication extract:
- name: Full medication name including strength (e.g., "Amoxicillin 500mg")
- dosage: The original dose text as written (e.g., "1-0-1", "500mg twice daily")
- instructions: Any additional instructions like "after food", "before meals", duration, frequency
- timeSlots: Array of time slots based on dose pattern mapping above
- confidence: "high" if clearly readable, "medium" if partially readable, "low" if guessing

Also provide overallConfidence based on image clarity.

Respond ONLY with a valid JSON object in this exact format:
{"medications": [{"name": "...", "dosage": "...", "instructions": "...", "timeSlots": ["morning", "evening"], "confidence": "high"}], "overallConfidence": "high|medium|low"}

Extract every medication visible. Do not skip any. Do not include any text outside the JSON.`,
              },
            ],
          },
        ],
        max_output_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Azure API error ${response.status}: ${errText.slice(0, 200)}`);
    }

    const result = await response.json();

    // Extract text from Responses API output
    let text = '';
    for (const item of result.output || []) {
      if (item.type === 'message') {
        text = item.content?.map((c: { text?: string }) => c.text || '').join('') || '';
        break;
      }
    }

    if (!text) {
      throw new Error('No text response from model');
    }

    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const validTimeSlots = ['morning', 'noon', 'evening', 'bedtime'];
    const medications = (parsed.medications || []).map((med: Record<string, unknown>) => ({
      name: med.name || '',
      dosage: med.dosage || '',
      instructions: med.instructions || '',
      timeSlots: Array.isArray(med.timeSlots)
        ? (med.timeSlots as string[]).filter((s: string) => validTimeSlots.includes(s))
        : ['morning'],
      confidence: ['high', 'medium', 'low'].includes(med.confidence as string)
        ? med.confidence
        : 'low',
    }));

    return NextResponse.json({
      medications,
      overallConfidence: parsed.overallConfidence || 'low',
    });
  } catch (error) {
    console.error('Prescription analysis error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to analyze prescription photo: ${message}` },
      { status: 500 }
    );
  }
}
