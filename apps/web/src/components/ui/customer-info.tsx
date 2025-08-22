import type { Customer } from "@/lib/customer";
import { IconText } from "@/components/ui/icon-text";
import { Mail, Phone, MapPin, Building, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerInfoProps {
  customer: Customer;
  showNotes?: boolean;
  className?: string;
}

export function CustomerInfo({
  customer,
  showNotes = true,
  className,
}: CustomerInfoProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <IconText icon={Mail} size="sm">
        {customer.email}
      </IconText>
      <IconText icon={Phone} size="sm">
        {customer.phone}
      </IconText>
      <IconText icon={MapPin} size="sm">
        {customer.city}, {customer.country}
      </IconText>
      {customer.company && (
        <IconText icon={Building} size="sm">
          {customer.company}
        </IconText>
      )}
      {showNotes && customer.notes && (
        <IconText icon={FileText} size="sm">
          <span className="text-green-700 italic underline">
            {customer.notes}
          </span>
        </IconText>
      )}
    </div>
  );
}
