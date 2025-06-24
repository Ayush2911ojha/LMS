import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json([], { status: 401 });

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  try {
    const reminders = await db.reminder.findMany({
      where: {
        userId,
        date: today,
      },
    });
    return NextResponse.json(reminders);
  } catch (error: any) {
    console.error("Today Reminder GET Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
