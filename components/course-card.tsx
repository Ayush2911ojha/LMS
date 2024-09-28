import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";
import { formatPrice } from "@/lib/format";
import { CourseProgress } from "./course-progress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  category: string;
  description: string;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
  description,
}: CourseCardProps) => {
  return (
    <div className="p-4 transition-transform transform hover:scale-105">
      <Link href={`/courses/${id}`}>
        <div className="group transition-shadow duration-300 ease-in-out overflow-hidden rounded-lg shadow-lg bg-white h-full hover:shadow-2xl">
          <div className="relative w-full aspect-video rounded-t-lg overflow-hidden">
            <Image
              fill
              className="object-cover transition duration-300 transform group-hover:scale-110"
              alt={title}
              src={imageUrl}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
          </div>
          <div className="flex flex-col p-4">
            <h3 className="text-2xl font-extrabold text-gray-900 group-hover:text-sky-600 transition duration-150">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{category}</p>
            <div className="flex items-center gap-x-2 mb-2">
              <div className="flex items-center gap-x-1">
                <IconBadge size="sm" icon={BookOpen} />
                <span className="bg-sky-500 text-white px-2 py-1 text-xs font-medium rounded-full shadow-md">
                  {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
                </span>
              </div>
            </div>
            {progress !== null ? (
              <CourseProgress
                variant={progress === 100 ? "success" : "default"}
                size="sm"
                value={progress}
              />
            ) : (
              <div className="mt-2">
                <span className="text-lg font-semibold text-gray-900">
                  {formatPrice(price)}
                </span>
              </div>
            )}
            <div className="flex flex-col mt-2">
              <h2 className="font-semibold text-gray-900">Description</h2>
              <p className="text-gray-600 text-sm line-clamp-2 overflow-hidden">
                {description.split(' ').slice(0, 15).join(' ') + (description.split(' ').length > 15 ? '...' : '')}
              </p>
            </div>
            <button className="mt-4 bg-gradient-to-r from-sky-400 to-sky-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-gradient-to-l transition duration-200 transform hover:-translate-y-0.5">
              Enroll Now
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
  
  
};
