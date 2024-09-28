import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseProgressButton } from "./_components/course-progress-button";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Preview } from "@/components/preview";
import { Separator } from "@/components/ui/separator";
import { File } from "lucide-react";

const ChapterIdPage = async ({
    params
}: {
    params: { courseId: string; chapterId: string }

}) => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }
     
    const {
        chapter,
        course,
        muxData,
        attachments,
        nextChapter,
        userProgress,
        purchase,
    } = await getChapter({
        userId,
        chapterId: params.chapterId,
        courseId: params.courseId,
    })
    if (!chapter || !course) {
        return redirect("/");
    }

    const isLocked = !chapter.isFree && !purchase;
    const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    
    return (
        <div className="min-h-screen bg-gray-50">
          {/* Completion or Locked Banners */}
          {userProgress?.isCompleted && (
            <Banner
              variant="success"
              label="You already completed this chapter."
            />
          )}
          {isLocked && (
            <Banner
              variant="warning"
              label="You need to purchase this course to watch this chapter."
            />
          )}
    
          <div className="flex flex-col max-w-4xl mx-auto py-6 px-4">
            {/* Video Player Section */}
            <div className="p-2 bg-white rounded-lg shadow-sm mb-4">
              <VideoPlayer
                chapterId={params.chapterId}
                title={chapter.title}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                playbackId={muxData?.playbackId!}
                isLocked={isLocked}
                completeOnEnd={completeOnEnd}
              />
            </div>
    
            {/* Chapter Title and Progress */}
            <div className="p-3 flex flex-col md:flex-row items-center justify-between bg-white rounded-lg shadow-sm mb-4">
              <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-2 md:mb-0">
                {chapter.title}
              </h2>
              {purchase ? (
                <CourseProgressButton
                  chapterId={params.chapterId}
                  courseId={params.courseId}
                  nextChapterId={nextChapter?.id}
                  isCompleted={!!userProgress?.isCompleted}
                />
              ) : (
                <CourseEnrollButton courseId={params.courseId} price={course.price!} />
              )}
            </div>
    
            {/* Chapter Description */}
            <Separator className="my-3" />
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-md mb-4 shadow-sm">
              <Preview value={chapter.description!} />
            </div>
    
            {/* Attachments Section */}
            {!!attachments.length && (
              <>
                <Separator className="my-3" />
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Attachments</h3>
                  <div className="space-y-2">
                    {attachments.map((attachment) => (
                      <a
                        href={attachment.url}
                        target="_blank"
                        key={attachment.id}
                        className="flex items-center p-2 bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-300 rounded-lg transition transform hover:scale-105"
                      >
                        <File className="h-5 w-5 mr-2" />
                        <p className="line-clamp-1 font-medium">{attachment.name}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      );
      
      
}
 
export default ChapterIdPage;