import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dateKey, type } = await req.json();

    if (!dateKey || !type) {
      return NextResponse.json({ error: 'Missing dateKey or type' }, { status: 400 });
    }

    const log = await prisma.dailyLog.upsert({
      where: {
        userId_dateKey: {
          userId: session.userId as string,
          dateKey: dateKey,
        }
      },
      update: {
        type: type
      },
      create: {
        userId: session.userId as string,
        dateKey: dateKey,
        type: type
      }
    });

    return NextResponse.json({ log });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = await prisma.dailyLog.findMany({
      where: { userId: session.userId as string },
      select: { dateKey: true, type: true }
    });

    return NextResponse.json({ logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
