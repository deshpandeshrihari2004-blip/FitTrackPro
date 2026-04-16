import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { dietType } = body;

    if (!dietType) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: session.userId as string },
      data: { dietType }
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
