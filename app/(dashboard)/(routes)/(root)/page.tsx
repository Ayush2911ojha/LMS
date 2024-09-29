import { redirect } from "next/navigation";
import { CheckCircle, Clock, InfoIcon, BarChart, BadgeCheck } from "lucide-react";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { InfoCard } from "./_components/info-card";
import { BannerCard } from "./_components/banner-card";

import { auth } from "@clerk/nextjs/server";
import { ProgressBar } from "./_components/progress-bar";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    completedCourses,
    coursesInProgress
  } = await getDashboardCourses(userId);

  const totalCourses = completedCourses.length + coursesInProgress.length;

  return (
    <div className="p-6 space-y-6">
      {/* Banner Section */}
      <div className="grid grid-cols-1 gap-6">
      <BannerCard
  icon={InfoIcon}
  label="Welcome to the dashboard"
  description={`View your progress and continue your learning journey. All courses are free, and Stripe is in test mode. Please enter dummy data in the Stripe form to enroll.`}
  bgClass="bg-gradient-to-r from-sky-300 to-sky-400 text-white p-6 rounded-lg shadow-lg"
/>




      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
          bgClass="bg-yellow-100"
          iconClass="text-yellow-500"
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
          bgClass="bg-green-100"
          iconClass="text-green-500"
        />
        <InfoCard
          icon={BarChart}
          label="Total Courses"
          numberOfItems={totalCourses}
          bgClass="bg-gray-100"
          iconClass="text-gray-500"
        />
      </div>

      {/* Course Progress Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
       
        <InfoCard
                  icon={BadgeCheck}
                  numberOfItems={totalCourses}
          label="Recent Achievements"
          bgClass="bg-indigo-100"
          iconClass="text-indigo-500"
        />
      </div>

      {/* Courses List */}
      <CoursesList
        items={[...coursesInProgress, ...completedCourses]}
      />
    </div>
  )
}
