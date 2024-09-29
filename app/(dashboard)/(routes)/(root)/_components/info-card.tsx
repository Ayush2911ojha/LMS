import { LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
  bgClass?: string; // Optional prop for background styling
  iconClass?: string; // Optional prop for icon styling
}

export const InfoCard = ({
  variant = "default",
  icon: Icon,
  numberOfItems,
  label,
  bgClass = "bg-white", // Default background class
  iconClass = "text-gray-500", // Default icon class
}: InfoCardProps) => {
  return (
    <div className={`border rounded-md flex items-center gap-x-2 p-3 ${bgClass}`}>
      <IconBadge
        variant={variant}
        icon={Icon}
        // iconClass={iconClass} // Pass icon class to IconBadge
      />
      <div>
        <p className="font-medium">
          {label}
        </p>
        <p className="text-gray-500 text-sm">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
};
