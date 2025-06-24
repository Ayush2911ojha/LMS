import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: { totalRevenue: number; students: number } } = {};
  
  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = { totalRevenue: 0, students: 0 };
    }
    grouped[courseTitle].totalRevenue += purchase.course.price ?? 0;
    grouped[courseTitle].students += 1;
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId: userId
        }
      },
      include: {
        course: true,
      }
    });

    const groupedData = groupByCourse(purchases);
    const data = Object.entries(groupedData).map(([courseTitle, { totalRevenue, students }]) => ({
      name: courseTitle,
      total: totalRevenue,
      students,
    }));

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.error("[GET_ANALYTICS ERROR]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
