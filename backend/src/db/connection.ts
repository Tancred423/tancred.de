import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema.ts";

const databaseUrl = Deno.env.get("DATABASE_URL");
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is required. Please set it in your environment or .env file.",
  );
}

const dbUrl: string = databaseUrl;

async function createConnectionWithRetry(
  maxRetries = 5,
  delay = 2000,
): Promise<mysql.Connection> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const connection = await mysql.createConnection(dbUrl);
      console.log("Database connection established");
      return connection;
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error(
          "Failed to connect to database after",
          maxRetries,
          "attempts",
        );
        throw error;
      }
      console.log(
        `Database connection attempt ${
          i + 1
        }/${maxRetries} failed, retrying in ${delay}ms...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 1.5, 10000);
    }
  }
  throw new Error("Failed to establish database connection");
}

const connection = await createConnectionWithRetry();

export const db = drizzle(connection, { schema, mode: "default" });
