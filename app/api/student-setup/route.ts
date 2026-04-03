import { MessHall, MessType, Gender, ActivityLevel } from '@prisma/client';
import { NextResponse } from 'next/server';

import { hashPassword } from '@/lib/auth';
import { calculateGoal, calculateDailyCalorieTarget } from '@/lib/fitness';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json();
  const registrationNumber = String(body.registrationNumber ?? '').trim().toUpperCase();
  const password = String(body.password ?? '').trim();
  const messHall = String(body.messHall ?? '').trim().toUpperCase() as MessHall;
  const messType = String(body.messType ?? '').trim().toUpperCase() as MessType;
  
  // Biometric data
  const age = body.age ? parseInt(body.age, 10) : 18;
  const weight = body.weight ? parseFloat(body.weight) : 60;
  const height = body.height ? parseFloat(body.height) : 160;
  const rawGender = String(body.gender ?? '').trim().toUpperCase();
  const gender = Object.values(Gender).includes(rawGender as Gender) ? (rawGender as Gender) : Gender.OTHER;      
  const rawActivityLevel = String(body.activityLevel ?? '').trim().toUpperCase();
  const activityLevel = Object.values(ActivityLevel).includes(rawActivityLevel as ActivityLevel) ? (rawActivityLevel as ActivityLevel) : ActivityLevel.MODERATE;

  if (!registrationNumber || !password || !Object.values(MessHall).includes(messHall) || !Object.values(MessType).includes(messType)) {
    return NextResponse.json({ error: 'Registration number, password, mess hall, and mess type are required.' }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
  }

  const existing = await prisma.studentAccount.findUnique({
    where: { registrationNumber },
    select: { id: true }
  });

  if (existing) {
    return NextResponse.json({ error: 'This registration number is already registered.' }, { status: 409 });
  }

  // Calculate fitness goal automatically
  const profile = { age, weight, height, gender, activityLevel };
  const { goal } = calculateGoal(profile);
  const dailyCalorieTarget = calculateDailyCalorieTarget(profile, goal);

  const account = await prisma.studentAccount.create({
    data: {
      registrationNumber,
      passwordHash: hashPassword(password),
      messHall,
      messType,
      age,
      weight,
      height,
      gender,
      activityLevel,
      currentGoal: goal,
      dailyCalorieTarget
    },
    select: {
      id: true,
      registrationNumber: true,
      messHall: true,
      messType: true,
      age: true,
      weight: true,
      height: true,
      gender: true,
      currentGoal: true,
      dailyCalorieTarget: true,
      createdAt: true
    }
  });

  return NextResponse.json({ account }, { status: 201 });
}
