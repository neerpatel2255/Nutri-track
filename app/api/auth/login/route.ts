import { NextResponse } from 'next/server';

import { verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

interface StudentAccountSelect {
  registrationNumber: string;
  passwordHash: string;
  messHall: string;
  messType: string;
  age: number;
  weight: number;
  height: number;
  gender: string;
  activityLevel: string;
  currentGoal: string;
  dailyCalorieTarget: number;
}

export async function POST(request: Request) {
  const body = await request.json();
  const registrationNumber = String(body.registrationNumber ?? '').trim().toUpperCase();
  const password = String(body.password ?? '').trim();

  if (!registrationNumber || !password) {
    return NextResponse.json({ error: 'Registration number and password are required.' }, { status: 400 });
  }

  const account = await prisma.studentAccount.findUnique({
    where: { registrationNumber },
    select: {
      registrationNumber: true,
      passwordHash: true,
      messHall: true,
      messType: true,
      age: true,
      weight: true,
      height: true,
      gender: true,
      activityLevel: true,
      currentGoal: true,
      dailyCalorieTarget: true
    }
  }) as StudentAccountSelect | null;

  if (!account || !verifyPassword(password, account.passwordHash)) {
    return NextResponse.json({ error: 'Invalid registration number or password.' }, { status: 401 });
  }

  return NextResponse.json(
    {
      user: {
        registrationNumber: account.registrationNumber,
        messHall: account.messHall,
        messType: account.messType,
        age: account.age,
        weight: account.weight,
        height: account.height,
        gender: account.gender,
        activityLevel: account.activityLevel,
        currentGoal: account.currentGoal,
        dailyCalorieTarget: account.dailyCalorieTarget
      }
    },
    { status: 200 }
  );
}
