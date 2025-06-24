import { db } from "@/lib/db";

export async function getQuizQuestions(courseId: string) {
  return await db.quizQuestion.findMany({
    where: { courseId },
    orderBy: { createdAt: "asc" }
  });
}