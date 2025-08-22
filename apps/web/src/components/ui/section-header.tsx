import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  icon?: LucideIcon;
  className?: string;
}

export function SectionHeader({
  title,
  icon: Icon,
  className,
}: SectionHeaderProps) {
  return (
    <h3
      className={cn("text-lg font-semibold flex items-center gap-2", className)}
    >
      {Icon && <Icon className="w-5 h-5 text-primary" />}
      {title}
    </h3>
  );
}
