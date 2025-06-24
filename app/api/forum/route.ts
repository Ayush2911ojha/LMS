import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import mongoose from "mongoose";

const forumSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["Blog", "Question", "Announcement"]),
});

// ✅ GET all posts (public access)
export async function GET() {
  try {
    const posts = await db.forumPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Forum GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// ✅ POST a new post (auth required)
export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = forumSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const { name, title, content, type } = parsed.data;

  try {
    const id = new mongoose.Types.ObjectId().toHexString();
    const newPost = await db.forumPost.create({
      data: {
        id,
        name,
        title,
        content,
        type,
        createdAt: new Date(),
      },
    });
    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("Forum POST Error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

// ✅ DELETE a post (auth required)
export async function DELETE(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  if (!id) return NextResponse.json({ error: "Post ID required" }, { status: 400 });

  try {
    await db.forumPost.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Forum DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
