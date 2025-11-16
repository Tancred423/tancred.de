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

async function createPoolWithRetry(
  maxRetries = 5,
  delay = 2000,
): Promise<mysql.Pool> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const pool = mysql.createPool({
        uri: dbUrl,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        maxIdle: 10,
        idleTimeout: 60000,
        connectTimeout: 10000,
      });

      await pool.query("SELECT 1");
      console.log("Database connection pool established");
      return pool;
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

const pool = await createPoolWithRetry();

pool.on("connection", () => {
  console.log("New connection established in pool");
});

pool.on("error", (err: Error) => {
  console.error("Unexpected error on idle database connection:", err);
});

export const db = drizzle(pool, { schema, mode: "default" });
export const closePool = async () => {
  await pool.end();
  console.log("Database connection pool closed");
};
