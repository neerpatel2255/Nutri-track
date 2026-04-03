/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuMode, MealSlot, Prisma } from '@prisma/client';

import { MENU_ITEMS, WEEKLY_MENU } from '@/lib/menu-data';
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

const mealSlotMap = {
  breakfast: 'BREAKFAST',
  lunch: 'LUNCH',
  snacks: 'SNACKS',
  dinner: 'DINNER'
} as const;

function formatDayLabel(day: string) {
  return day.charAt(0).toUpperCase() + day.slice(1);
}

function inferSpicy(itemName: string) {
  return /gravy|chettinad|chutney|rasam|biryani|chaat|korma|bhurji|pickle|podi|sambar|dal/i.test(itemName);
}

function buildSeedMenuItems(): Prisma.MenuItemCreateManyInput[] {
  const rows: Prisma.MenuItemCreateManyInput[] = [];

  for (const [dayKey, dayMenu] of Object.entries(WEEKLY_MENU)) {
    const dayLabel = formatDayLabel(dayKey);

    for (const mealKey of Object.keys(mealSlotMap) as Array<keyof typeof mealSlotMap>) {
      const mealPlan = dayMenu[mealKey];
      const mealSlot = mealSlotMap[mealKey] as MealSlot;
      const uniqueItemIds = Array.from(new Set([...mealPlan.regular_menu, ...mealPlan.feast_menu]));

      for (const itemId of uniqueItemIds) {
        const item = MENU_ITEMS[itemId as keyof typeof MENU_ITEMS];
        if (!item) {
          continue;
        }

        rows.push({
          dayLabel,
          mealSlot,
          title: item.name,
          description: `${dayLabel} ${mealLabels[mealSlot]} menu item`,
          calories: Math.round(item.calories),
          protein: Math.round(item.protein),
          carbs: Math.round(item.carbs),
          fats: Math.round(item.fats),
          vegetarian: item.type === 'veg',
          spicy: inferSpicy(item.name)
        });
      }
    }
  }

  return rows;
}

function computeAverageRating(ratings: Array<{ stars: number }>) {
  if (ratings.length === 0) {
    return 0;
  }

  const total = ratings.reduce((sum, rating) => sum + rating.stars, 0);
  return Number((total / ratings.length).toFixed(1));
}

export async function ensureSeedData() {
  const menuItems = buildSeedMenuItems();
  const count = await prisma.menuItem.count();
  if (count >= menuItems.length) {
    return;
  }

  await prisma.rating.deleteMany();
  await prisma.preference.deleteMany();
  await prisma.menuItem.deleteMany();

  await prisma.menuItem.createMany({ data: menuItems });

  const savedMenuItems: Array<{ id: number; title: string }> = await prisma.menuItem.findMany({
    select: {
      id: true,
      title: true
    },
    orderBy: { id: 'asc' }
  });
  const topRatedCandidates = savedMenuItems.slice(0, 4);

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
        feedback: 'Breakfast options are fresh and filling.',
        menuItemId: topRatedCandidates[0]?.id
      },
      {
        studentName: 'Sara',
        stars: 4,
        feedback: 'Lunch had good variety.',
        menuItemId: topRatedCandidates[1]?.id
      },
      {
        studentName: 'Rohan',
        stars: 5,
        feedback: 'Snacks are light but energetic.',
        menuItemId: topRatedCandidates[2]?.id
      },
      {
        studentName: 'Meera',
        stars: 3,
        feedback: 'Dinner was okay, needs a bit more spice.',
        menuItemId: topRatedCandidates[3]?.id
      }
    ].filter((entry): entry is { studentName: string; stars: number; feedback: string; menuItemId: number } =>
      typeof entry.menuItemId === 'number'
    )
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
