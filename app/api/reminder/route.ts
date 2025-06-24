import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import mongoose from "mongoose";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  note: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"), // YYYY-MM-DD
});

export async function GET(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const reminders = await db.reminder.findMany({ where: { userId } });
    return NextResponse.json(reminders);
  } catch (error: any) {
    console.error("Reminder GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { title, note, date } = parsed.data;

  try {
    const id = new mongoose.Types.ObjectId().toHexString();
    const reminder = await db.reminder.create({
      data: { id, title, note, date, userId },
    });
    return NextResponse.json(reminder, { status: 201 });
  } catch (error: any) {
    console.error("Reminder POST Error:", error);
    return NextResponse.json({ error: "Failed to create reminder" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await db.reminder.delete({ where: { id, userId } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Reminder DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete reminder" }, { status: 500 });
  }
}
