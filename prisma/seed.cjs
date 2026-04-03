const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.rating.deleteMany();
  await prisma.preference.deleteMany();
  await prisma.menuItem.deleteMany();

  const items = await prisma.menuItem.createMany({
    data: [
      {
        dayLabel: 'Today',
        mealSlot: 'BREAKFAST',
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
        mealSlot: 'LUNCH',
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
        mealSlot: 'LUNCH',
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
        mealSlot: 'DINNER',
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
        mealSlot: 'SNACKS',
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
        mealSlot: 'SNACKS',
        title: 'Fruit Custard Cup',
        description: 'Light sweet option for students who want a low-spice evening bite.',
        calories: 180,
        protein: 5,
        carbs: 29,
        fats: 5,
        vegetarian: true,
        spicy: false
      }
    ]
  });

  const menuItems = await prisma.menuItem.findMany({ orderBy: { id: 'asc' } });

  console.log(`Seeded ${items.count} menu items.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
