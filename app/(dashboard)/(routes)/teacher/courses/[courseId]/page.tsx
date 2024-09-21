import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { IconBadge } from '@/components/icon-badge'
import { LayoutDashboard } from 'lucide-react'
import { TitleForm } from './_components/title-form'

import { DescriptionForm } from './_components/description-form'


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
        id: params.courseId
      }
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
      course.categoryId
    ]

    // Calculate completion status
    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const completionText = `(${completedFields}/${totalFields})`

    return (
      <>
        <div className='p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-col gap-y-2'>
              <h1 className='text-2xl font-medium'>Course Setup</h1>
              <span className='text-sm text-slate-700'>
                Complete all fields {completionText}
              </span>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-16'>
            <div>
              <div className='flex items-center gap-x-2'>
                <IconBadge icon={LayoutDashboard} />
                <h2 className='text-xl'>Customize your Course</h2>
              </div>

              <TitleForm
                initialData={course}
                courseId={course.id}
              />
              <DescriptionForm initialData={course}
                courseId={course.id}
              />
              
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
