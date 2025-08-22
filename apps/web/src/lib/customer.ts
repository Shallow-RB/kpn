export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  company?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
