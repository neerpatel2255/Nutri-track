export type GoalType = 'NEUTRAL' | 'WEIGHT_GAIN' | 'WEIGHT_LOSS';

export interface FitnessProfile {
  age: number;
  weight: number;
  height: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  activityLevel: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE' | 'VERY_ACTIVE';
}

export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

export function calculateGoal(profile: FitnessProfile): { goal: GoalType; display: string } {
  const bmi = calculateBMI(profile.weight, profile.height);

  if (bmi < 18.5) {
    return { goal: 'WEIGHT_GAIN', display: 'Build Muscle & Gain Weight' };
  } else if (bmi >= 25) {
    return { goal: 'WEIGHT_LOSS', display: 'Lose Weight Safely' };
  } else {
    return { goal: 'NEUTRAL', display: 'Maintain Fitness' };
  }
}

export function calculateDailyCalorieTarget(profile: FitnessProfile, goal: GoalType): number {
  let bmr = 0;

  if (profile.gender === 'MALE') {
    bmr = 88.362 + 13.397 * profile.weight + 4.799 * profile.height - 5.677 * profile.age;
  } else if (profile.gender === 'FEMALE') {
    bmr = 447.593 + 9.247 * profile.weight + 3.098 * profile.height - 4.33 * profile.age;
  } else {
    const maleBMR = 88.362 + 13.397 * profile.weight + 4.799 * profile.height - 5.677 * profile.age;
    const femaleBMR = 447.593 + 9.247 * profile.weight + 3.098 * profile.height - 4.33 * profile.age;
    bmr = (maleBMR + femaleBMR) / 2;
  }

  const activityMultipliers: Record<string, number> = {
    SEDENTARY: 1.2,
    LIGHT: 1.375,
    MODERATE: 1.55,
    ACTIVE: 1.725,
    VERY_ACTIVE: 1.9
  };

  const tdee = bmr * (activityMultipliers[profile.activityLevel] || 1.55);

  if (goal === 'WEIGHT_LOSS') {
    return Math.round(tdee - 500);
  } else if (goal === 'WEIGHT_GAIN') {
    return Math.round(tdee + 500);
  } else {
    return Math.round(tdee);
  }
}
