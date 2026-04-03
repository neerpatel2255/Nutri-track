import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json();
  const studentName = String(body.studentName ?? '').trim();
  const menuItemId = Number(body.menuItemId);
  const stars = Number(body.stars);
  const feedback = String(body.feedback ?? '').trim();

  if (!studentName || !menuItemId || !Number.isInteger(stars) || stars < 1 || stars > 5) {
    return NextResponse.json({ error: 'Rating requires a name, item, and 1-5 stars.' }, { status: 400 });
  }

  const rating = await prisma.rating.create({
    data: {
      studentName,
      menuItemId,
      stars,
      feedback: feedback || null
    }
  });

  return NextResponse.json({ rating }, { status: 201 });
}
