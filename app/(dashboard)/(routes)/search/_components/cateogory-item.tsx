"use client";

import qs from "query-string";
import { IconType } from "react-icons";
import {
  usePathname,
  useRouter,
  useSearchParams
} from "next/navigation";

import { cn } from "@/lib/utils";

interface CategoryItemProps {
  label: string;
  value?: string;
  icon?: IconType;
};

export const CategoryItem = ({
  label,
  value,
  icon: Icon,
}: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        title: currentTitle,
        categoryId: isSelected ? null : value,
      }
    }, { skipNull: true, skipEmptyString: true });

    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "py-2 px-4 text-base font-semibold rounded-full flex items-center gap-x-2 transition-all duration-300 ease-in-out",
        "border shadow-md border-gray-200 dark:border-gray-700",
        "hover:bg-gradient-to-r hover:from-sky-400 hover:to-sky-300",
        "hover:text-white hover:shadow-lg",
        isSelected 
          ? "bg-sky-300 text-white border-sky-400"
          : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200"
      )}
      type="button"
    >
      {Icon && <Icon size={24} className="text-sky-600 dark:text-sky-400" />}
      <div className="truncate">
        {label}
      </div>
    </button>
  );
};
