import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // MongoDB client wrapper
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import mongoose from "mongoose";

const postSchema = z.object({
  task: z.string().min(1, "Task is required").max(255, "Task is too long"),
});

const putSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),
  completed: z.boolean({ required_error: "Completed status is required" }),
});

export async function GET(req: Request) {
  const { userId } = auth();

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const todos = await db.todo.findMany({ where: { userId } });
    return NextResponse.json(todos);
  } catch (error: any) {
    console.error("Error in GET /api/todos:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Failed to fetch todos", details: error.message },
      { status: 500 }
    );
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

  const { task } = parsed.data;

  try {
    // Validate userId
    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Generate a valid MongoDB ObjectId
    const id = new mongoose.Types.ObjectId().toHexString();

    const newTodo = await db.todo.create({
      data: {
        id, // Explicitly provide ObjectId
        task,
        userId,
        completed: false,
        // createdAt: new Date(), // Optional: Prisma can handle @default(now())
      },
    });
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/todos:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Failed to create todo", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { id, completed } = parsed.data;

  try {
    const updatedTodo = await db.todo.update({
      where: { id, userId },
      data: { completed },
    });
    return NextResponse.json(updatedTodo);
  } catch (error: any) {
    console.error("Error in PUT /api/todos:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Failed to update todo", details: error.message },
      { status: 500 }
    );
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
    await db.todo.delete({
      where: { id, userId },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in DELETE /api/todos:", error);
    return NextResponse.json(
      { error: "Failed to delete todo", details: error.message },
      { status: 500 }
    );
  }
}
