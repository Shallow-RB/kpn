import { NextResponse } from "next/server";

/**
 * Root API route handler
 * Provides a simple health check endpoint at the root of the API
 * @returns JSON response indicating the API is running
 */
export async function GET() {
  return NextResponse.json({ message: "OK" });
}
