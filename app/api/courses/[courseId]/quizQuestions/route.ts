// app/api/courses/[courseId]/quizQuestions/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user owns the course
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { question, options, correctOption } = body;

    if (!question || !options || !correctOption) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    // Save quiz question
    const quizQuestion = await db.quizQuestion.create({
      data: {
        courseId: params.courseId,
        question,
        options,
        correctOption,
      },
    });

    return NextResponse.json(quizQuestion);
  } catch (error) {
    console.log("QUIZ_QUESTION_POST_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
