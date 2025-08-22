"use client";

import { useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Customer } from "@/lib/customer";
import {
  useCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "@/lib/customers-query";
import { CustomerDetailPage } from "@/components/customer-detail-page";
import {
  CustomerFormModal,
  type CustomerFormValues,
} from "@/components/customer-form-modal";
import { Save, Loader2 } from "lucide-react";

// Dynamic route for viewing/editing a single customer by id
// detail view, edit, and delete

export default function CustomerDetailRoutePage() {
  const router = useRouter();
  const params = useParams();
  // id from route params
  const id = Array.isArray(params?.id)
    ? params?.id[0]
    : (params?.id as string | undefined);

  const { data: customer, isLoading, error } = useCustomer(id || "");
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Navigate back to the list page
  const handleBack = () => {
    router.push("/");
  };

  // Open modal in edit mode for the selected customer
  const handleEdit = (c: Customer) => {
    setEditingCustomer(c);
    setIsEditOpen(true);
  };

  // Persist changes through the store and close modal
  const handleSave = async (values: CustomerFormValues) => {
    if (editingCustomer) {
      try {
        await updateCustomerMutation.mutateAsync({
          id: editingCustomer.id,
          data: {
            ...editingCustomer,
            ...values,
            updatedAt: new Date(),
          },
        });
        setIsEditOpen(false);
      } catch (error) {
        console.error("Failed to update customer:", error);
        // You might want to show a toast notification here
      }
    }
  };

  // Remove customer via the store
  const handleDelete = async (customerId: string) => {
    try {
      await deleteCustomerMutation.mutateAsync(customerId);
      handleBack();
    } catch (error) {
      console.error("Failed to delete customer:", error);
      // You might want to show a toast notification here
    }
  };

  // Pre-fill modal with current customer values when editing
  const initialValues = useMemo(() => {
    if (!editingCustomer) return undefined;
    return {
      firstName: editingCustomer.firstName,
      lastName: editingCustomer.lastName,
      email: editingCustomer.email,
      phone: editingCustomer.phone,
      street: editingCustomer.street,
      city: editingCustomer.city,
      postalCode: editingCustomer.postalCode,
      country: editingCustomer.country,
      company: editingCustomer.company ?? "",
      notes: editingCustomer.notes ?? "",
    };
  }, [editingCustomer]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Klant laden...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">
            Er is een fout opgetreden bij het laden van klanten.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary hover:underline"
          >
            Opnieuw proberen
          </button>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 text-foreground">
          <p>Klant niet gevonden.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomerDetailPage
        customer={customer}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <CustomerFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Klant bewerken"
        submitLabel="Opslaan"
        iconSlot={<Save className="w-4 h-4" />}
        initialValues={initialValues}
        onSubmit={handleSave}
      />
    </>
  );
}
