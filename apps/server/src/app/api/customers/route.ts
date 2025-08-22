import { NextRequest, NextResponse } from "next/server";
import { customerService } from "@/services/customer.service";
import { z } from "zod";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCustomer = await customerService.createCustomer(body);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
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
