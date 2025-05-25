import { redirect } from "next/navigation";
import { CheckCircle, Clock, InfoIcon, BarChart, BadgeCheck } from "lucide-react";
import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { InfoCard } from "./_components/info-card";
import { auth } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);

const totalCourses = coursesInProgress.length;


  return (
    <div className="p-6 space-y-10">

      {/* 🟦 Hero Section (lighter) */}
      <div className="bg-gradient-to-r from-blue-200 to-indigo-100 text-blue-900 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome back to MultiLearn</h1>
        <p className="text-lg">
          Continue your learning journey. All courses are free & Stripe is in test mode.
        </p>
      </div>

      {/* 📊 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <InfoCard
          icon={Clock}
          label="Courses In Progress"
          numberOfItems={coursesInProgress.length}
          bgClass="bg-white"
          iconClass="bg-yellow-100 text-yellow-600 p-3 rounded-full"
        />
        <InfoCard
          icon={CheckCircle}
          label="Courses Completed"
          numberOfItems={completedCourses.length}
          bgClass="bg-white"
          iconClass="bg-green-100 text-green-600 p-3 rounded-full"
        />
        <InfoCard
          icon={BarChart}
          label="Total Enrolled"
          numberOfItems={totalCourses}
          bgClass="bg-white"
          iconClass="bg-blue-100 text-blue-600 p-3 rounded-full"
        />
      </div>

      {/* 🏅 Achievements */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Achievements</h2>
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
          <BadgeCheck className="text-indigo-600 w-10 h-10" />
          <div>
            <p className="text-md font-medium">You've enrolled in {totalCourses} courses</p>
            <p className="text-sm text-gray-500">Keep up the great progress!</p>
          </div>
        </div>
      </div>

      {/* 📚 Courses Section */}
      <div className="space-y-10">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">🚀 Courses In Progress</h3>
          <CoursesList items={coursesInProgress} />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">🎉 Courses You’ve Mastered</h3>
          <CoursesList items={completedCourses} />
        </div>
      </div>
    </div>
  );
}
