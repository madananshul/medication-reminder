import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { image, mediaType } = await request.json();

    if (!image || !mediaType) {
      return NextResponse.json(
        { error: 'Missing image or mediaType' },
        { status: 400 }
      );
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;
    type ValidMediaType = typeof validTypes[number];
    if (!validTypes.includes(mediaType as ValidMediaType)) {
      return NextResponse.json(
        { error: 'Invalid image type. Use JPEG, PNG, GIF, or WebP.' },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as ValidMediaType,
                data: image,
              },
            },
            {
              type: 'text',
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
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    const parsed = JSON.parse(textContent.text);

    return NextResponse.json({
      name: parsed.name || '',
      dosage: parsed.dosage || '',
      instructions: parsed.instructions || '',
      confidence: parsed.confidence || 'low',
    });
  } catch (error) {
    console.error('Medication analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze medication photo' },
      { status: 500 }
    );
  }
}
