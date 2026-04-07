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
                text: `Analyze this medication package/label photo. Extract the following information:

1. **name**: The medication/drug name (brand name and/or generic name)
2. **dosage**: The dosage/strength (e.g., "500mg", "10mg/5ml")
3. **instructions**: Brief usage instructions if visible (e.g., "Take 1 tablet twice daily with food")
4. **confidence**: Your confidence level - "high" if text is clearly readable, "medium" if partially readable, "low" if mostly guessing

Respond ONLY with a valid JSON object in this exact format:
{"name": "...", "dosage": "...", "instructions": "...", "confidence": "high|medium|low"}

If you cannot read certain fields, use empty strings for those fields. Do not include any text outside the JSON.`,
              },
            ],
          },
        ],
        max_output_tokens: 1024,
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

    return NextResponse.json({
      name: parsed.name || '',
      dosage: parsed.dosage || '',
      instructions: parsed.instructions || '',
      confidence: parsed.confidence || 'low',
    });
  } catch (error) {
    console.error('Medication analysis error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to analyze medication photo: ${message}` },
      { status: 500 }
    );
  }
}
