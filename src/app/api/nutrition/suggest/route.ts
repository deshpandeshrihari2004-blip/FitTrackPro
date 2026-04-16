import { NextResponse } from 'next/server';
import { getNutritionSuggestion } from '@/lib/ml';

export async function POST(req: Request) {
  try {
    const { query, dietType } = await req.json();

    if (!query || !dietType) {
      return NextResponse.json({ error: 'Query and Diet Type required' }, { status: 400 });
    }

    const suggestion = await getNutritionSuggestion(query, dietType);

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('Nutrition suggest error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
