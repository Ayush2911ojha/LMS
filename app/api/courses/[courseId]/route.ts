import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

import { deleteMuxAsset } from "@/lib/mux";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

const video = mux.video;

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      const course = await db.course.findUnique({
        where: {
          id: params.courseId,
          userId: userId,
        },
        include: {
          chapters: {
            include: {
              muxData: true, // Include MuxData
            }
          }
        }
      });
  
      if (!course) {
        return new NextResponse("Not Found", { status: 404 });
      }
  
      for (const chapter of course.chapters) {
        if (chapter.muxData?.assetId) {
          try {
            await deleteMuxAsset(chapter.muxData.assetId);
            console.log(`Deleted Mux asset: ${chapter.muxData.assetId}`);
          } catch (deleteError) {
            console.error(`Failed to delete Mux asset ${chapter.muxData.assetId}:`, deleteError);
          }
        }
      }
  
      // Delete the course after Mux assets are deleted
      const deletedCourse = await db.course.delete({
        where: {
          id: params.courseId
        }
      });
  
      return NextResponse.json({
        message: "Course and associated assets deleted successfully",
        courseId: deletedCourse.id,
      });
      
    } catch (error) {
      console.log("[CHAPTER_ID_DELETE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
  

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }   

        const course = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}