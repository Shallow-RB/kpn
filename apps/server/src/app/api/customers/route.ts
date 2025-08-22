import { NextRequest, NextResponse } from "next/server";
import { customerService } from "@/services/customer.service";
import { z } from "zod";

/**
 * API Route: /api/customers
 * Handles GET (list all customers) and POST (create new customer) requests
 */

/**
 * GET /api/customers
 * Retrieves all customers ordered by creation date (newest first)
 * @returns JSON array of all customers or error response
 */
export async function GET() {
  try {
    const customers = await customerService.getAllCustomers();
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customers
 * Creates a new customer with validation
 * @param request - NextRequest containing customer data in JSON body
 * @returns JSON response with created customer or error details
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCustomer = await customerService.createCustomer(body);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
