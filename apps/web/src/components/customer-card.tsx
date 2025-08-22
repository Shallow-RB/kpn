"use client";

import type { Customer } from "@/lib/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Eye } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { CustomerInfo } from "@/components/ui/customer-info";

interface CustomerCardProps {
  customer: Customer;
  onView: (customer: Customer) => void;
}

export function CustomerCard({ customer, onView }: CustomerCardProps) {
  return (
    <Card
      className="bg-card border-border hover:shadow-md transition-shadow cursor-pointer hover:bg-primary/5"
      onClick={() => onView(customer)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-card-foreground text-lg hover:underline">
              {customer.firstName} {customer.lastName}
            </CardTitle>
            {/* Show company badge when available */}
            {customer.company && (
              <Badge
                variant="secondary"
                className="mt-1 bg-accent text-accent-foreground"
              >
                <Building className="w-3 h-3 mr-1" />
                {customer.company}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {/* View action */}
            <IconButton
              icon={Eye}
              onClick={() => onView(customer)}
              className="border-border hover:bg-accent hover:text-accent-foreground"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Overview of contact and address info */}
        <CustomerInfo customer={customer} />
      </CardContent>
    </Card>
  );
}
