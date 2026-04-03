import { GoalType } from '@prisma/client';
import { NextResponse } from 'next/server';

import { calculateDailyCalorieTarget } from '@/lib/fitness';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json();
  const registrationNumber = String(body.registrationNumber ?? '').trim().toUpperCase();
  const newGoal = String(body.goal ?? '').trim().toUpperCase() as GoalType;

  if (!registrationNumber || !Object.values(GoalType).includes(newGoal)) {
    return NextResponse.json(
      { error: 'Registration number and valid goal (NEUTRAL, WEIGHT_GAIN, WEIGHT_LOSS) are required.' },
      { status: 400 }
    );
  }

  const account = await prisma.studentAccount.findUnique({
    where: { registrationNumber },
    select: {
      id: true,
      age: true,
      weight: true,
      height: true,
      gender: true,
      activityLevel: true
    }
  });

  if (!account) {
    return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
  }

  // Recalculate daily calorie target based on new goal
  const dailyCalorieTarget = calculateDailyCalorieTarget(
    {
      age: account.age,
      weight: account.weight,
      height: account.height,
      gender: account.gender,
      activityLevel: account.activityLevel
    },
    newGoal
  );

  const updated = await prisma.studentAccount.update({
    where: { registrationNumber },
    data: {
      currentGoal: newGoal,
      dailyCalorieTarget
    },
    select: {
      registrationNumber: true,
      currentGoal: true,
      dailyCalorieTarget: true,
      age: true,
      weight: true,
      height: true,
      gender: true,
      activityLevel: true
    }
  });

  return NextResponse.json({ account: updated }, { status: 200 });
}
