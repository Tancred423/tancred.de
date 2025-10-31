import { Context, Router } from "@oak/oak";
import { compare } from "bcrypt";
import { db } from "../db/connection.ts";
import { users } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { generateToken } from "../utils/jwt.ts";

const router = new Router();

router.post("/auth/login", async (ctx: Context) => {
  const body = await ctx.request.body.json();
  const { username, password } = body;

  if (!username || !password) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Username and password required" };
    return;
  }

  if (typeof username !== "string" || username.length > 50) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid username" };
    return;
  }

  if (typeof password !== "string" || password.length > 500) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid password" };
    return;
  }

  const [user] = await db.select().from(users).where(
    eq(users.username, username),
  ).limit(1);

  if (!user) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Invalid credentials" };
    return;
  }

  const isValid = await compare(password, user.password);

  if (!isValid) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Invalid credentials" };
    return;
  }

  const token = await generateToken(user.id, user.username);

  ctx.response.body = { token, username: user.username };
});

export default router;
