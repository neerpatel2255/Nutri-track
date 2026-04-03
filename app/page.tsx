import { SmartMessUI } from '@/components/smart-mess-ui';
import { getDashboardData } from '@/lib/dashboard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getDashboardData();

  const payload = {
    adminSettings: data.adminSettings,
    stats: data.stats,
    menuItems: data.menuItems.map((item) => ({
      id: item.id,
      mealSlot: item.mealSlot,
      title: item.title,
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fats: item.fats,
      averageRating: item.averageRating,
      feedbackCount: item.feedbackCount,
      ratings: item.ratings.map((rating) => ({
        stars: rating.stars,
        feedback: rating.feedback,
        studentName: rating.studentName
      }))
    })),
    topItem: data.topItem
      ? {
          title: data.topItem.title,
          averageRating: data.topItem.averageRating,
          feedbackCount: data.topItem.feedbackCount
        }
      : null,
    lowDemandItems: data.lowDemandItems.map((item) => ({
      id: item.id,
      title: item.title,
      averageRating: item.averageRating
    }))
  };

  return <SmartMessUI initialData={payload} />;
}
