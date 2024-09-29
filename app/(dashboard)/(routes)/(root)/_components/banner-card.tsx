import { LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

interface BannerCardProps {
  variant?: "default" | "success";
  label: string;
  description: string;
  icon: LucideIcon;
  bgClass?: string; // Add support for custom background classes
}

export const BannerCard = ({
  variant = "default", // Default variant
  icon: Icon,
  description,
  label,
  bgClass = "", // Default to empty string if not provided
}: BannerCardProps) => {
  // Define background and border color classes based on variant
  const backgroundClass =
    variant === "success" ? "bg-green-50 border-green-200" : "bg-white border-gray-200";

  return (
    <div className={`border rounded-md flex items-start gap-x-4 p-4 ${bgClass || backgroundClass}`}>
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="font-semibold text-lg">
          {label}
        </p>
        <p className="text-gray-100 dark:text-gray-300 text-sm mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};
