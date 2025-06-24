import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { questions } = await req.json()

    if (!questions || !Array.isArray(questions)) {
      return new NextResponse("Invalid data", { status: 400 })
    }

    const created = await db.quizQuestion.createMany({
      data: questions.map((q: any) => ({
        courseId: params.courseId,
        question: q.question,
        options: q.options,
        correctOption: q.correctOption, // ✅ Save the actual correct answer
      })),
    })

    return NextResponse.json(created)
  } catch (error) {
    console.error("[QUIZ_POST_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const questions = await db.quizQuestion.findMany({
      where: {
        courseId: params.courseId,
      },
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error("[QUIZ_GET_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
