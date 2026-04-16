'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function logDailyActivity(type: 'Gym' | 'Rest') {
  const session = await getSession();
  
  if (!session || !session.userId) {
    throw new Error("Unauthorized");
  }

  const dateKey = new Date().toISOString().split('T')[0];

  try {
    await prisma.dailyLog.upsert({
      where: {
        userId_dateKey: {
          userId: session.userId as string,
          dateKey,
        },
      },
      update: {
        type,
      },
      create: {
        userId: session.userId as string,
        dateKey,
        type,
      },
    });

    revalidatePath('/tracker');
    return { success: true };
  } catch (error) {
    console.error("Failed to log activity:", error);
    throw new Error("Failed to save log");
  }
}

export async function getTrackerStats() {
  const session = await getSession();
  
  if (!session || !session.userId) {
    return { gymDays: 0, restDays: 0, totalWorkouts: 0 };
  }

  const logs = await prisma.dailyLog.findMany({
    where: { userId: session.userId as string },
  });

  const gymDays = logs.filter(l => l.type === 'Gym').length;
  const restDays = logs.filter(l => l.type === 'Rest').length;
  const totalWorkouts = gymDays; // Using gym days as workout count

  return { gymDays, restDays, totalWorkouts };
}
