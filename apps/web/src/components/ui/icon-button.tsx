import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  icon: LucideIcon;
  onClick?: (e?: React.MouseEvent) => void;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "lg";
  className?: string;
  disabled?: boolean;
}

export function IconButton({
  icon: Icon,
  onClick,
  variant = "outline",
  size = "sm",
  className,
  disabled,
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={cn("cursor-pointer", className)}
      disabled={disabled}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );
}
