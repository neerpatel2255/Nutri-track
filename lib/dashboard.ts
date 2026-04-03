/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuMode, MealSlot, Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

export type MenuItemView = Prisma.MenuItemGetPayload<{
  include: { ratings: true };
}> & {
  averageRating: number;
  feedbackCount: number;
};

export type DashboardData = {
  adminSettings?: any;
  menuItems: MenuItemView[];
  preferences: Array<{
    id: number;
    studentName: string;
    menuMode: MenuMode;
    favorites: string;
    notes: string | null;
    createdAt: Date;
  }>;
  stats: {
    totalItems: number;
    averageCalories: number;
    averageRating: number;
    totalPreferences: number;
    feastCount: number;
    regularCount: number;
    wasteRisk: string;
  };
  mealGroups: Array<{
    slot: MealSlot;
    label: string;
    items: MenuItemView[];
  }>;
  topItem: MenuItemView | null;
  lowDemandItems: MenuItemView[];
};

const mealLabels: Record<MealSlot, string> = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACKS: 'Snacks'
};

function computeAverageRating(ratings: Array<{ stars: number }>) {
  if (ratings.length === 0) {
    return 0;
  }

  const total = ratings.reduce((sum, rating) => sum + rating.stars, 0);
  return Number((total / ratings.length).toFixed(1));
}

export async function ensureSeedData() {
  const count = await prisma.menuItem.count();
  if (count > 0) {
    return;
  }

  const menuItems = [
    {
      dayLabel: 'Today',
      mealSlot: 'BREAKFAST' as MealSlot,
      title: 'Masala Oats with Fruit Bowl',
      description: 'Warm oats with vegetables, roasted seeds, and fresh seasonal fruit.',
      calories: 320,
      protein: 13,
      carbs: 42,
      fats: 10,
      vegetarian: true,
      spicy: false
    },
    {
      dayLabel: 'Today',
      mealSlot: 'LUNCH' as MealSlot,
      title: 'Rice, Dal Tadka, Paneer Bhurji',
      description: 'Balanced lunch plate with lentils, spiced cottage cheese, and salad.',
      calories: 620,
      protein: 28,
      carbs: 74,
      fats: 22,
      vegetarian: true,
      spicy: true
    },
    {
      dayLabel: 'Today',
      mealSlot: 'LUNCH' as MealSlot,
      title: 'Chicken Curry Thali',
      description: 'Protein-rich curry with rice, cucumber raita, and roasted papad.',
      calories: 690,
      protein: 34,
      carbs: 68,
      fats: 26,
      vegetarian: false,
      spicy: true
    },
    {
      dayLabel: 'Today',
      mealSlot: 'DINNER' as MealSlot,
      title: 'Chapati, Veg Korma, Curd',
      description: 'Comfort dinner with whole wheat rotis and a mild mixed vegetable curry.',
      calories: 560,
      protein: 18,
      carbs: 66,
      fats: 20,
      vegetarian: true,
      spicy: false
    },
    {
      dayLabel: 'Today',
      mealSlot: 'SNACKS' as MealSlot,
      title: 'Sprout Chaat and Tea',
      description: 'Evening snack with high fiber sprouts, onions, lemon, and masala tea.',
      calories: 210,
      protein: 11,
      carbs: 23,
      fats: 6,
      vegetarian: true,
      spicy: true
    },
    {
      dayLabel: 'Today',
      mealSlot: 'SNACKS' as MealSlot,
      title: 'Fruit Custard Cup',
      description: 'Light sweet option for students who want a low-spice evening bite.',
      calories: 180,
      protein: 5,
      carbs: 29,
      fats: 5,
      vegetarian: true,
      spicy: false
    }
  ];

  await prisma.menuItem.createMany({ data: menuItems });

  const savedMenuItems: Array<{ id: number; title: string }> = await prisma.menuItem.findMany({
    select: {
      id: true,
      title: true
    },
    orderBy: { id: 'asc' }
  });
  const itemByTitle = new Map<string, { id: number; title: string }>(
    savedMenuItems.map((item) => [item.title, item])
  );

  await prisma.preference.createMany({
    data: [
      {
        studentName: 'Aarav',
        menuMode: 'REGULAR',
        favorites: 'Breakfast oats, lunch paneer, dinner veg curry',
        notes: 'Prefer low spice on weekdays.'
      },
      {
        studentName: 'Sara',
        menuMode: 'FEAST',
        favorites: 'Chicken curry thali and special dessert',
        notes: 'Happy to pay extra for weekends.'
      },
      {
        studentName: 'Rohan',
        menuMode: 'REGULAR',
        favorites: 'Dal, curd, and fruit-based snacks',
        notes: 'Needs a lighter dinner before sports practice.'
      }
    ]
  });

  await prisma.rating.createMany({
    data: [
      {
        studentName: 'Aarav',
        stars: 5,
        feedback: 'Best breakfast this week.',
        menuItemId: itemByTitle.get('Masala Oats with Fruit Bowl')!.id
      },
      {
        studentName: 'Sara',
        stars: 4,
        feedback: 'Paneer was well cooked and filling.',
        menuItemId: itemByTitle.get('Rice, Dal Tadka, Paneer Bhurji')!.id
      },
      {
        studentName: 'Rohan',
        stars: 5,
        feedback: 'Sprouts were fresh and not too oily.',
        menuItemId: itemByTitle.get('Sprout Chaat and Tea')!.id
      },
      {
        studentName: 'Meera',
        stars: 3,
        feedback: 'Dinner was good but needed more spice.',
        menuItemId: itemByTitle.get('Chapati, Veg Korma, Curd')!.id
      }
    ]
  });
}

export async function getDashboardData(): Promise<DashboardData> {
  await ensureSeedData();

  const [menuItems, preferences] = await Promise.all([
    prisma.menuItem.findMany({
      include: {
        ratings: true
      },
      orderBy: [{ mealSlot: 'asc' }, { id: 'asc' }]
    }),
    prisma.preference.findMany({ orderBy: { createdAt: 'desc' } })
  ]);

  const menuWithRatings: MenuItemView[] = menuItems.map((item) => ({
    ...item,
    averageRating: computeAverageRating(item.ratings),
    feedbackCount: item.ratings.length
  }));

  const averageCalories =
    menuWithRatings.length === 0
      ? 0
      : Math.round(menuWithRatings.reduce((sum: number, item: MenuItemView) => sum + item.calories, 0) / menuWithRatings.length);

  const averageRating =
    menuWithRatings.length === 0
      ? 0
      : Number(
          (
            menuWithRatings.reduce((sum: number, item: MenuItemView) => sum + item.averageRating, 0) /
            menuWithRatings.length
          ).toFixed(1)
        );

  const feastCount = preferences.filter((item: DashboardData['preferences'][number]) => item.menuMode === MenuMode.FEAST).length;
  const regularCount = preferences.filter((item: DashboardData['preferences'][number]) => item.menuMode === MenuMode.REGULAR).length;
  const topItem = [...menuWithRatings].sort((left, right) => right.averageRating - left.averageRating)[0] ?? null;
  const lowDemandItems = menuWithRatings.filter((item: MenuItemView) => item.averageRating > 0 && item.averageRating < 4);
  const baseWasteRisk = 74 - menuWithRatings.length * 4 - (topItem?.averageRating ?? 0) * 6;
  const wasteRiskLevel = Math.max(18, Math.round(baseWasteRisk));

  const mealGroups = (Object.entries(mealLabels) as Array<[MealSlot, string]>).map(([slot, label]) => ({
    slot,
    label,
    items: menuWithRatings.filter((item: MenuItemView) => item.mealSlot === slot)
  }));

  let adminSettings = await prisma.adminSettings.findUnique({
    where: { id: "global" }
  });

  if (!adminSettings) {
    adminSettings = await prisma.adminSettings.create({
      data: { id: "global", isPreferenceOpen: false }
    });
  }

  return {
    adminSettings,
    menuItems: menuWithRatings,
    preferences,
    stats: {
      totalItems: menuWithRatings.length,
      averageCalories,
      averageRating,
      totalPreferences: preferences.length,
      feastCount,
      regularCount,
      wasteRisk: `${wasteRiskLevel}%`
    },
    mealGroups,
    topItem,
    lowDemandItems
  };
}
