import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/chapter-actions";

const ChapterIdPage = async ({ params }: { params: { courseId: string; chapterId: string } }) => {
    const { userId } = auth();
    if (!userId) {
        return redirect("/");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId,
        },
        include: {
            muxData: true,
        },
    });

    if (!chapter) {
        return redirect("/");
    }
    const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!chapter.isPublished && (
                <Banner
                    variant="warning"
                    label="This Chapter is Unpublished. It will not be visible in the course."
                />
            )}
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${params.courseId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6 text-blue-600"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Course Setup
                        </Link>

                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-3xl font-bold text-gray-800">Chapter Creation</h1>
                                <span className="text-sm text-gray-600">{completionText}</span>
                            </div>
                            <ChapterActions
                                disabled={!isComplete}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                                isPublished={chapter.isPublished}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl font-semibold text-gray-800">Customize Your Chapter</h2>
                            </div>
                            <ChapterTitleForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
                            <ChapterDescriptionForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye} />
                                <h2 className="text-xl font-semibold text-gray-800">Access Settings</h2>
                            </div>
                            <ChapterAccessForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
                        </div>
                    </div>

                    <div>
                        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Video} />
                                <h2 className="text-xl font-semibold text-gray-800">Add a Video</h2>
                            </div>
                            <ChapterVideoForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChapterIdPage;
