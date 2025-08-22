import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Customer database schema definition
 * Defines the structure of the customers table with all required fields
 */
export const customers = pgTable("customers", {
  // Unique identifier for each customer (auto-generated UUID)
  id: uuid("id").primaryKey().defaultRandom(),

  // Customer's first and last name (required)
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),

  // Contact information (email must be unique)
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),

  // Address information (all required)
  street: text("street").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),

  // Optional fields
  company: text("company"), // Company name (optional)
  notes: text("notes"), // Additional notes (optional)

  // Timestamps for tracking creation and updates
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// TypeScript types inferred from the schema
// These provide type safety when working with customer data
export type Customer = typeof customers.$inferSelect; // Type for reading customers
export type NewCustomer = typeof customers.$inferInsert; // Type for creating customers
