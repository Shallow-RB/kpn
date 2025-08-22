import { SectionHeader } from "@/components/ui/section-header";
import type { LucideIcon } from "lucide-react";

interface FormSectionProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  icon,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={className}>
      <SectionHeader title={title} icon={icon} className="mb-4" />
      <div className="space-y-4">{children}</div>
    </div>
  );
}
