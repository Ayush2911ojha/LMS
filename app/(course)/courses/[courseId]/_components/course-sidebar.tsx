import { Chapter, Course, UserProgress } from "@prisma/client";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { CourseProgress } from "@/components/course-progress";
import { auth } from "@clerk/nextjs/server";
import { CourseSidebarItem } from "./course-sidebar-item";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[]
  };
  progressCount: number;
};

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      }
    }
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-lg">
    {/* Course Title and Progress */}
    <div className="p-6 flex flex-col border-b bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800 mb-1">
        {course.title}
      </h1>
      {purchase && (
        <div className="mt-2">
          <CourseProgress
            variant="success"
            value={progressCount}
          />
        </div>
      )}
    </div>
  
    {/* Chapters List */}
    <div className="flex flex-col w-full p-4 space-y-2">
      {course.chapters.map((chapter) => (
        <CourseSidebarItem
          key={chapter.id}
          id={chapter.id}
          label={chapter.title}
          isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
          courseId={course.id}
          isLocked={!chapter.isFree && !purchase}
        />
      ))}
    </div>
  </div>
  
  );
}
