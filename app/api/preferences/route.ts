import { NextResponse } from 'next/server';

import { MenuMode } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json();
  const studentName = String(body.studentName ?? '').trim();
  const menuMode = String(body.menuMode ?? '').trim().toUpperCase() as MenuMode;
  const favorites = String(body.favorites ?? '').trim();
  const notes = String(body.notes ?? '').trim();

  if (!studentName || !favorites || !Object.values(MenuMode).includes(menuMode)) {
    return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 });
  }

  const preference = await prisma.preference.create({
    data: {
      studentName,
      menuMode,
      favorites,
      notes: notes || null
    }
  });

  return NextResponse.json({ preference }, { status: 201 });
}
