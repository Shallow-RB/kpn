"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCustomers, useCreateCustomer } from "@/lib/customers-query";
import type { Customer } from "@/lib/customer";
import { CustomerSearch } from "@/components/customer-search";
import {
  CustomerFormModal,
  type CustomerFormValues,
} from "@/components/customer-form-modal";
import { Users, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchResultsSummary } from "@/components/ui/search-results-summary";
import { CustomerGrid } from "@/components/ui/customer-grid";

// Home page: customer search, list, and create
export default function HomePage() {
  const router = useRouter();
  const { data: customers = [], isLoading, error } = useCustomers();
  const createCustomerMutation = useCreateCustomer();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;

    const query = searchQuery.toLowerCase();
    return customers.filter(
      (customer) =>
        customer.firstName.toLowerCase().includes(query) ||
        customer.lastName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.includes(query) ||
        customer.company?.toLowerCase().includes(query) ||
        customer.city.toLowerCase().includes(query) ||
        customer.street.toLowerCase().includes(query) ||
        customer.postalCode.toLowerCase().includes(query) ||
        customer.country.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Navigate to detail page when a card is clicked
  const handleViewCustomer = (customer: Customer) => {
    router.push(`/customers/${customer.id}`);
  };

  // Create a new customer from modal submit
  const handleCreateCustomer = async (values: CustomerFormValues) => {
    try {
      await createCustomerMutation.mutateAsync(values);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create customer:", error);
      // You might want to show a toast notification here
    }
  };

  const handleCreateClick = () => setIsCreateModalOpen(true);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Klanten laden...</p>
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
          <Button onClick={() => window.location.reload()}>
            Opnieuw proberen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="mb-8">
            <PageHeader
              title="Klantenbeheer"
              subtitle="Beheer en zoek uw klanten"
              icon={Users}
              actions={
                <Button
                  onClick={handleCreateClick}
                  className="bg-primary text-primary-foreground hover:bg-primary/60 shadow-sm cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nieuwe klant
                </Button>
              }
            />

            {/* Search */}
            <div className="flex justify-center">
              <CustomerSearch onSearch={handleSearch} />
            </div>
          </div>

          {/* Results Summary */}
          <SearchResultsSummary
            filteredCount={filteredCustomers.length}
            totalCount={customers.length}
            searchQuery={searchQuery}
            className="mb-6"
          />

          {/* Customer Grid or empty state when no matches */}
          {filteredCustomers.length > 0 ? (
            <CustomerGrid
              customers={filteredCustomers}
              onViewCustomer={handleViewCustomer}
            />
          ) : (
            <EmptyState
              icon={Users}
              title="Geen klanten gevonden"
              description={
                searchQuery
                  ? `Geen klanten gevonden voor "${searchQuery}". Probeer een andere zoekterm.`
                  : "Er zijn nog geen klanten toegevoegd."
              }
              action={
                !searchQuery
                  ? {
                      label: "Eerste klant toevoegen",
                      onClick: handleCreateClick,
                      icon: UserPlus,
                    }
                  : undefined
              }
            />
          )}
        </div>
      </div>

      <CustomerFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nieuwe klant toevoegen"
        submitLabel="Klant toevoegen"
        iconSlot={<UserPlus className="w-5 h-5 text-primary" />}
        onSubmit={handleCreateCustomer}
      />
    </>
  );
}
