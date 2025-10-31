import { hash } from "bcrypt";
import { db } from "./connection.ts";
import { users } from "./schema.ts";
import { eq } from "drizzle-orm";

async function initAdmin() {
  const adminUsername = Deno.env.get("ADMIN_USERNAME");
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");

  if (!adminUsername || !adminPassword) {
    console.log(
      "ℹ️  ADMIN_USERNAME and ADMIN_PASSWORD not set, skipping admin user creation",
    );
    return;
  }

  // Validate username
  if (adminUsername.length < 3 || adminUsername.length > 50) {
    console.error("❌ ADMIN_USERNAME must be between 3 and 50 characters");
    Deno.exit(1);
  }

  if (!/^[a-zA-Z0-9_]+$/.test(adminUsername)) {
    console.error(
      "❌ ADMIN_USERNAME can only contain letters, numbers, and underscores",
    );
    Deno.exit(1);
  }

  // Validate password
  if (adminPassword.length < 8) {
    console.error("❌ ADMIN_PASSWORD must be at least 8 characters");
    Deno.exit(1);
  }

  try {
    // Check if user already exists
    const [existing] = await db.select().from(users).where(
      eq(users.username, adminUsername),
    ).limit(1);

    if (existing) {
      console.log(
        `ℹ️  Admin user '${adminUsername}' already exists, skipping creation`,
      );
      return;
    }

    // Create admin user
    const hashedPassword = await hash(adminPassword);
    await db.insert(users).values({
      username: adminUsername,
      password: hashedPassword,
    });

    console.log(`✅ Admin user '${adminUsername}' created successfully`);
  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
    Deno.exit(1);
  }
}

initAdmin().then(() => {
  Deno.exit(0);
}).catch((error) => {
  console.error("❌ Admin initialization failed:", error);
  Deno.exit(1);
});
