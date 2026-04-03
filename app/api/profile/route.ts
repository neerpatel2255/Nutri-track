import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { registrationNumber, height, weight, age, activityLevel, gender, currentGoal } = body;

    if (!registrationNumber || registrationNumber === 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });     
    }
    const student = await prisma.studentAccount.findUnique({
      where: { registrationNumber }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Since the database models might require valid inputs, we calculate nutrition goals
    const isMale = gender === 'MALE';
    const bmr = isMale
      ? 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + 5
      : 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) - 161;

    let calGoal = bmr;
    if (activityLevel === 'SEDENTARY') calGoal *= 1.2;
    else if (activityLevel === 'MODERATE') calGoal *= 1.55;
    else if (activityLevel === 'ACTIVE') calGoal *= 1.725;
    else if (activityLevel === 'VERY_ACTIVE') calGoal *= 1.9;

    if (currentGoal === 'WEIGHT_LOSS') calGoal -= 500;
    else if (currentGoal === 'WEIGHT_GAIN') calGoal += 500;

    // Update student
    const updatedStudent = await prisma.studentAccount.update({
      where: { id: student.id },
      data: {
        height: Number(height),
        weight: Number(weight),
        age: Number(age),
        activityLevel,
        gender,
        currentGoal,
        dailyCalorieTarget: Math.round(calGoal),
      }
    });

    return NextResponse.json({
      success: true,
      student: {
        height: updatedStudent.height,
        weight: updatedStudent.weight,
        age: updatedStudent.age,
        activityLevel: updatedStudent.activityLevel,
        gender: updatedStudent.gender,
        currentGoal: updatedStudent.currentGoal,
        dailyCalorieTarget: updatedStudent.dailyCalorieTarget,
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
