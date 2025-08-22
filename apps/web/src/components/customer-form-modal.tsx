"use client";

import type React from "react";
import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormSection } from "@/components/ui/form-section";
import { NameFields } from "@/components/ui/name-fields";
import { ContactFields } from "@/components/ui/contact-fields";
import { AddressFields } from "@/components/ui/address-fields";
import { User, Mail, MapPin, Building } from "lucide-react";

// Modal with a validated customer form (react-hook-form + zod)
// Used for both create and edit

const nlPostal = /^\d{4}\s?[A-Za-z]{2}$/;
const phoneRegex = /^\+?[0-9\s\-()]{6,}$/;

// Form schema
export const FormSchema = z.object({
  firstName: z.string().min(1, "Voornaam is verplicht"),
  lastName: z.string().min(1, "Achternaam is verplicht"),
  email: z.string().min(1, "Email is verplicht").email("Ongeldig e-mailadres"),
  phone: z
    .string()
    .min(1, "Telefoon is verplicht")
    .regex(phoneRegex, "Ongeldig telefoonnummer"),
  street: z.string().min(1, "Straat is verplicht"),
  city: z.string().min(1, "Plaats is verplicht"),
  postalCode: z
    .string()
    .min(1, "Postcode is verplicht")
    .regex(nlPostal, "Ongeldige postcode (bv. 1234 AB)"),
  country: z.string().min(1, "Land is verplicht"),
  company: z.string(),
  notes: z.string(),
});

export type CustomerFormValues = z.infer<typeof FormSchema>;

interface BaseProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  submitLabel: string;
  iconSlot?: React.ReactNode;
}

interface CustomerFormModalProps extends BaseProps {
  initialValues?: Partial<CustomerFormValues>;
  onSubmit: (values: CustomerFormValues) => void;
}

// Empty values
const emptyValues: CustomerFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  postalCode: "",
  country: "Nederland",
  company: "",
  notes: "",
};

// Customer form modal
export function CustomerFormModal({
  isOpen,
  onClose,
  title,
  submitLabel,
  iconSlot,
  initialValues,
  onSubmit,
}: CustomerFormModalProps) {
  const defaults = useMemo<CustomerFormValues>(
    () => ({
      ...emptyValues,
      ...initialValues,
    }),
    [initialValues]
  );

  // Setup form with zod validation and defaults
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaults,
    mode: "onBlur",
  });

  // Reset form when modal opens with new initial values
  useEffect(() => {
    if (isOpen) {
      form.reset(defaults);
    }
  }, [isOpen, initialValues, form, defaults]);

  const handleSubmit = (values: CustomerFormValues) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {iconSlot}
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Person names */}
            <FormSection title="Persoonlijke gegevens" icon={User}>
              <NameFields />
            </FormSection>

            {/* Email and phone */}
            <FormSection title="Contactgegevens" icon={Mail}>
              <ContactFields />
            </FormSection>

            {/* Address fields */}
            <FormSection title="Adres" icon={MapPin}>
              <AddressFields />
            </FormSection>

            {/* Optional company and free-form notes */}
            <FormSection title="Aanvullende informatie" icon={Building}>
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrijf</FormLabel>
                    <FormControl>
                      <Input {...field} className="mt-1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notities</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} className="mt-1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            {/* Footer actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuleren
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {submitLabel}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export {};
