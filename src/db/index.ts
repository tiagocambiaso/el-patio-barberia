import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL no está configurada. Ejecutá `neon deploy` o `neon env pull` para generar .env.local.",
    );
  }
  return url;
}

const sql = neon(getDatabaseUrl());

export const db = drizzle({ client: sql, schema });
