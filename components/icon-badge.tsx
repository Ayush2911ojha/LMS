import { LucideIcon } from 'lucide-react';
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"; // Utility function for handling classnames

// Background styling variants for the badge
const backgroundVariants = cva(
  "rounded-full flex items-center justify-center", 
  {
    variants: {
      variant: {
        default: "bg-sky-100",
        success: "bg-emerald-100",
      },
      size: {
        default: "p-2",
        sm: "p-1",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    }
  }
);

// Icon styling variants for the badge
const iconVariants = cva(
  "", 
  {
    variants: {
      variant: {
        default: "text-sky-700",
        success: "text-emerald-700",
      },
      size: {
        default: "h-8 w-8",
        sm: "h-4 w-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    }
  }
);

// Define types based on the variant props
type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>;
type IconVariantsProps = VariantProps<typeof iconVariants>;

// Extend both variant props in IconBadgeProps
interface IconBadgeProps extends BackgroundVariantsProps, IconVariantsProps {
  icon: LucideIcon; // Icon component from lucide-react
}

// IconBadge component with variant and size handling
export const IconBadge = ({
  icon: Icon, // The icon to render
  variant = "default", // Default value for variant
  size = "default", // Default value for size
}: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariants({ variant, size }))}>
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  );
};
