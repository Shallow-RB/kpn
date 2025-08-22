import { NextRequest, NextResponse } from "next/server";
import { customerService } from "@/services/customer.service";
import { z } from "zod";

/**
 * API Route: /api/customers/[id]
 * Handles GET (get customer), PUT (update customer), and DELETE (delete customer) requests
 * [id] is a dynamic route parameter representing the customer ID
 */

/**
 * GET /api/customers/[id]
 * Retrieves a specific customer by ID
 * @param request - NextRequest object
 * @param params - Object containing the customer ID from the URL
 * @returns JSON response with customer data or 404 error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await customerService.getCustomerById(params.id);
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }
}

/**
 * PUT /api/customers/[id]
 * Updates an existing customer by ID
 * @param request - NextRequest containing updated customer data in JSON body
 * @param params - Object containing the customer ID from the URL
 * @returns JSON response with updated customer or error details
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedCustomer = await customerService.updateCustomer(
      params.id,
      body
    );
    return NextResponse.json(updatedCustomer);
  } catch (error) {
    // Handle validation errors specifically
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    console.error("Error updating customer:", error);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/customers/[id]
 * Deletes a customer by ID
 * @param request - NextRequest object
 * @param params - Object containing the customer ID from the URL
 * @returns JSON response with success message or error details
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await customerService.deleteCustomer(params.id);
    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
