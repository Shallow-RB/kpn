import type { Customer } from "@/lib/customer";
import { CustomerCard } from "@/components/customer-card";
import { cn } from "@/lib/utils";

interface CustomerGridProps {
  customers: Customer[];
  onViewCustomer: (customer: Customer) => void;
  className?: string;
}

export function CustomerGrid({
  customers,
  onViewCustomer,
  className,
}: CustomerGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onView={onViewCustomer}
        />
      ))}
    </div>
  );
}
