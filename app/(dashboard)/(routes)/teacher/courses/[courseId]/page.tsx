
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { IconBadge } from '@/components/icon-badge'
import { CircleDollarSign, File, LayoutDashboard, ListCheck, ListChecks } from 'lucide-react'
import { TitleForm } from './_components/title-form'
import { DescriptionForm } from './_components/description-form'
import { ImageForm } from './_components/image-form'
import { CategoryForm } from './_components/category-form'
import { PriceForm } from './_components/price-form'
import { AttachmentForm } from './_components/attachment-for'
import ChaptersForm from './_components/chapter-form'
// import { PriceForm } from './_components/price-form'

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth()

  // Redirect to home if user is not authenticated
  if (!userId) {
    return redirect('/')
  }

  try {
    // Fetch the course by the given courseId
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      },
      include: {
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    const categories = await db.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    // Redirect to home if course is not found
    if (!course) {
      return redirect('/')
    }

    // List of required fields to check if the course setup is complete
    const requiredFields = [
      course.title,
      course.description,
      course.imageUrl,
      course.price,
      course.categoryId,
      course.chapters.some(chapter => chapter.isPublished),
    ]

    // Calculate completion status
    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const completionText = `(${completedFields}/${totalFields})`

    return (
      <>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Course Setup</h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completionText}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your Course</h2>
              </div>

              <TitleForm initialData={course} courseId={course.id} />
              <DescriptionForm initialData={course} courseId={course.id} />
              <ImageForm initialData={course} courseId={course.id} />
              <CategoryForm
                initialData={course}
                courseId={course.id}
                options={categories.map((category) => ({
                  label: category.name,
                  value: category.id,
                }))}
              />
            </div>
            <div className='space-y-6'>
              <div >
                <div className='flex items-center gap-x-2'>
                  <IconBadge icon={ListChecks} />
                  <h2 className='text-xl'>
                    Course Chapters
                  </h2>
                </div>
                <div>
                <ChaptersForm
                initialData={course}
                courseId={course.id}
              />
                </div>
              </div>
              <div>
                <div className='flex items-center gap-x-2'>
                <IconBadge icon={CircleDollarSign} />
                  <h2 className='text-xl'>
                    Sell Your Course
                  </h2>

                </div>
                <PriceForm
                  initialData={course}
                  courseId={course.id}
                />
              </div>
              <div>
                 <div className='flex items-center gap-x-2'>
                <IconBadge icon={File} />
                  <h2 className='text-xl'>
                    Resources & Attachments
                  </h2>

                </div>
                  <AttachmentForm initialData={course} courseId={course.id} />
              </div>


            </div>
          </div>
        </div>
      </>
    )
  } catch (error) {
    // In case of any unexpected errors, redirect to home
    console.error('Error fetching course:', error)
    return redirect('/')
  }
}

export default CourseIdPage
