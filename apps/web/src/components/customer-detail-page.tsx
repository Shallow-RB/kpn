"use client";

import { useState } from "react";
import type { Customer } from "@/lib/customer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  FileText,
} from "lucide-react";
import { IconText } from "@/components/ui/icon-text";
import { formatDate } from "@/lib/utils";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface CustomerDetailPageProps {
  customer: Customer;
  onBack: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

export function CustomerDetailPage({
  customer,
  onBack,
  onEdit,
  onDelete,
}: CustomerDetailPageProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    onDelete(customer.id);
    onBack();
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header: back, title, and primary actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {customer.firstName} {customer.lastName}
              </h1>
              <p className="text-muted-foreground">Klantdetails</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit(customer)}
              className="bg-primary hover:bg-primary/80 cursor-pointer"
            >
              <Edit className="w-4 h-4 mr-2" />
              Bewerken
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="cursor-pointer"
            >
              Verwijderen
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contactgegevens
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <IconText icon={Mail} className="mt-1">
                    {customer.email}
                  </IconText>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Telefoon
                  </label>
                  <IconText icon={Phone} className="mt-1">
                    {customer.phone}
                  </IconText>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Adres
                </label>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="text-foreground">
                    <div>{customer.street}</div>
                    <div>
                      {customer.postalCode} {customer.city}
                    </div>
                    <div>{customer.country}</div>
                  </div>
                </div>
              </div>

              {customer.company && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Bedrijf
                  </label>
                  <IconText icon={Building} className="mt-1">
                    {customer.company}
                  </IconText>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Tijdstempels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Aangemaakt
                  </label>
                  <p className="text-sm text-foreground mt-1">
                    {formatDate(customer.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Laatst bijgewerkt
                  </label>
                  <p className="text-sm text-foreground mt-1">
                    {formatDate(customer.updatedAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {customer.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Notities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground whitespace-pre-wrap">
                    {customer.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Destructive action confirmation */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirmed}
        title="Klant verwijderen"
        description={`Weet je zeker dat je ${customer.firstName} ${customer.lastName} wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`}
        confirmLabel="Verwijderen"
        variant="destructive"
      />
    </div>
  );
}
