import { db } from "@/db";
import { customers } from "@/db/schema/customers";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

/**
 * Customer Service - Business Logic Layer
 * Handles all customer-related operations with validation and error handling
 */

// Zod validation schemas for input validation
// These ensure data integrity before database operations
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

// Update schema allows partial updates (all fields optional)
const updateCustomerSchema = createCustomerSchema.partial();

// TypeScript types inferred from validation schemas
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

/**
 * CustomerService class containing all customer-related business logic
 * Provides CRUD operations with proper validation and error handling
 */
export class CustomerService {
  /**
   * Create a new customer
   * @param data - Customer data to create
   * @returns The created customer
   * @throws Error if email already exists or validation fails
   */
  async createCustomer(data: unknown) {
    // Validate input data against schema
    const validatedData = createCustomerSchema.parse(data);

    // Check if email already exists to prevent duplicates
    const existingCustomer = await db
      .select()
      .from(customers)
      .where(eq(customers.email, validatedData.email))
      .limit(1);

    if (existingCustomer.length > 0) {
      throw new Error("Customer with this email already exists");
    }

    // Insert new customer and return the created record
    const [newCustomer] = await db
      .insert(customers)
      .values({
        ...validatedData,
        updatedAt: new Date(), // Set current timestamp
      })
      .returning();

    return newCustomer;
  }

  /**
   * Get a customer by their ID
   * @param id - Customer ID to find
   * @returns The customer if found
   * @throws Error if customer not found
   */
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

  /**
   * Update an existing customer
   * @param id - Customer ID to update
   * @param data - Partial customer data to update
   * @returns The updated customer
   * @throws Error if customer not found, email conflict, or validation fails
   */
  async updateCustomer(id: string, data: unknown) {
    // Validate input data (all fields optional for updates)
    const validatedData = updateCustomerSchema.parse(data);

    // Verify customer exists before attempting update
    await this.getCustomerById(id);

    // If email is being updated, check for conflicts with other customers
    if (validatedData.email) {
      const emailConflict = await db
        .select()
        .from(customers)
        .where(eq(customers.email, validatedData.email))
        .limit(1);

      // Allow update if email belongs to the same customer, otherwise throw error
      if (emailConflict.length > 0 && emailConflict[0].id !== id) {
        throw new Error("Customer with this email already exists");
      }
    }

    // Update customer and return the updated record
    const [updatedCustomer] = await db
      .update(customers)
      .set({
        ...validatedData,
        updatedAt: new Date(), // Update timestamp
      })
      .where(eq(customers.id, id))
      .returning();

    return updatedCustomer;
  }

  /**
   * Delete a customer by ID
   * @param id - Customer ID to delete
   * @returns The deleted customer
   * @throws Error if customer not found
   */
  async deleteCustomer(id: string) {
    // Verify customer exists before attempting deletion
    await this.getCustomerById(id);

    // Delete customer and return the deleted record
    const [deletedCustomer] = await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning();

    return deletedCustomer;
  }

  /**
   * Get all customers ordered by creation date (newest first)
   * @returns Array of all customers
   */
  async getAllCustomers() {
    return await db.select().from(customers).orderBy(desc(customers.createdAt));
  }
}

// Export singleton instance for use throughout the application
export const customerService = new CustomerService();
