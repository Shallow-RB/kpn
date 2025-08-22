import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconTextProps {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  iconClassName?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const iconSizeClasses = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export function IconText({
  icon: Icon,
  children,
  className,
  iconClassName,
  size = "md",
}: IconTextProps) {
  return (
    <div
      className={cn("flex items-center gap-2", sizeClasses[size], className)}
    >
      <Icon
        className={cn(
          "text-muted-foreground",
          iconSizeClasses[size],
          iconClassName
        )}
      />
      <span>{children}</span>
    </div>
  );
}
