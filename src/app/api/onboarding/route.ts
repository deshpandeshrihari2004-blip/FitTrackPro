import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { calculateFitnessLevelAndGoals } from '@/lib/ml';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { age, weight, goal, dietType, height, bodyFat, gender } = await req.json();

    if (!age || !weight || !goal || !dietType) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const parsedHeight = height ? Number(height) : undefined;
    const parsedBodyFat = bodyFat ? Number(bodyFat) : undefined;

    // Call our AI/ML model logic to suggest fitness level and calories
    const { fitnessLevel, dailyCalories } = calculateFitnessLevelAndGoals(
      Number(age), 
      Number(weight), 
      goal, 
      parsedHeight, 
      parsedBodyFat
    );

    const profile = await prisma.profile.upsert({
      where: { userId: session.userId as string },
      update: {
        gender,
        age: Number(age),
        weight: Number(weight),
        height: parsedHeight,
        bodyFat: parsedBodyFat,
        goal,
        dietType,
        fitnessLevel,
        dailyCalories,
      },
      create: {
        userId: session.userId as string,
        gender,
        age: Number(age),
        weight: Number(weight),
        height: parsedHeight,
        bodyFat: parsedBodyFat,
        goal,
        dietType,
        fitnessLevel,
        dailyCalories,
      },
    });

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Something went wrong while saving profile' }, { status: 500 });
  }
}
