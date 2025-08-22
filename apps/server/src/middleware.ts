import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Global middleware for handling CORS and API route protection
 * This middleware runs on all API routes to ensure proper cross-origin requests
 */
export function middleware(request: NextRequest) {
  // Handle CORS for API routes only
  if (request.nextUrl.pathname.startsWith("/api")) {
    const response = NextResponse.next();

    // Set CORS headers to allow requests from the frontend application
    // This enables the frontend (running on port 3001) to communicate with the API
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3001"
    );

    // Allow common HTTP methods for CRUD operations
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );

    // Allow necessary headers for JSON requests and authentication
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    // Handle preflight requests (OPTIONS) that browsers send before actual requests
    // This is required for CORS to work properly
    if (request.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }

    return response;
  }

  // For non-API routes, continue normally
  return NextResponse.next();
}

// Configure middleware to only run on API routes
export const config = {
  matcher: "/api/:path*",
};
