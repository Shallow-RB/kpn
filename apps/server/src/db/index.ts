import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Create a PostgreSQL connection pool
// Uses environment variable DATABASE_URL or falls back to local Docker setup
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:password@localhost:5432/kpn",
});

export const db = drizzle(pool, { schema });
