import { db } from "@/db";
import { customers } from "@/db/schema/customers";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

// Validation schemas
const createCustomerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  company: z.string().optional(),
  notes: z.string().optional(),
});

const updateCustomerSchema = createCustomerSchema.partial();

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

export class CustomerService {
  async createCustomer(data: unknown) {
    // Validate input
    const validatedData = createCustomerSchema.parse(data);

    // Check if email already exists
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, validatedData.email))
      .limit(1);

    if (existingCustomer.length > 0) {
      throw new Error("Customer with this email already exists");
    }

    const [newCustomer] = await db
      .insert(customers)
      .values({
        ...validatedData,
        updatedAt: new Date(),
      })
      .returning();

    return newCustomer;
  }

  async getCustomerById(id: string) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, id));

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer;
  }

  async updateCustomer(id: string, data: unknown) {
    // Validate input
    const validatedData = updateCustomerSchema.parse(data);

    // Check if customer exists
    await this.getCustomerById(id);

    // If email is being updated, check for conflicts
    if (validatedData.email) {
      const emailConflict = await db
        .select()
        .from(customers)
        .where(eq(customers.email, validatedData.email))
        .limit(1);

      if (emailConflict.length > 0 && emailConflict[0].id !== id) {
        throw new Error("Customer with this email already exists");
      }
    }

    const [updatedCustomer] = await db
      .update(customers)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))
      .returning();

    return updatedCustomer;
  }

  async deleteCustomer(id: string) {
    // Check if customer exists
    await this.getCustomerById(id);

    const [deletedCustomer] = await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning();

    return deletedCustomer;
  }

  async getAllCustomers() {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }
}

export const customerService = new CustomerService();
