import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Simplistic admin check since this is a prototype
    const { isPreferenceOpen } = await request.json();

    const adminSettings = await prisma.adminSettings.upsert({
      where: { id: "global" },
      update: { isPreferenceOpen },
      create: { id: "global", isPreferenceOpen }
    });

    return NextResponse.json({ success: true, adminSettings });
  } catch (error) {
    console.error('Settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
