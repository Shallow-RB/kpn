import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

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

// --- Fetch helpers ---
function parseCustomer(raw: any): Customer {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

async function fetchCustomers() {
  const res = await fetch(`${API_URL}/customers`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  const data = await res.json();
  return data.map(parseCustomer);
}

async function fetchCustomer(id: string) {
  const res = await fetch(`${API_URL}/customers/${id}`);
  if (!res.ok) throw new Error("Failed to fetch customer");
  const data = await res.json();
  return parseCustomer(data);
}

async function createCustomer(
  data: Omit<Customer, "id" | "createdAt" | "updatedAt">
) {
  const res = await fetch(`${API_URL}/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create customer");
  const raw = await res.json();
  return parseCustomer(raw);
}

async function updateCustomer(id: string, data: Partial<Customer>) {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update customer");
  const raw = await res.json();
  return parseCustomer(raw);
}

async function deleteCustomer(id: string) {
  const res = await fetch(`${API_URL}/customers/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete customer");
  return id;
}

// --- React Query hooks ---
export function useCustomers() {
  return useQuery({ queryKey: ["customers"], queryFn: fetchCustomers });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => fetchCustomer(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customers"] }),
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      updateCustomer(id, data),
    onSuccess: (c) => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.invalidateQueries({ queryKey: ["customers", c.id] });
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      qc.removeQueries({ queryKey: ["customers", id] });
    },
  });
}
