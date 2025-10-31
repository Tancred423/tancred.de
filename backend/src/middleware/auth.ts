import { Context } from "@oak/oak";
import { verify } from "djwt";
import { getCryptoKey } from "../utils/jwt.ts";

export async function authMiddleware(
  ctx: Context,
  next: () => Promise<unknown>,
) {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.response.status = 401;
    ctx.response.body = { error: "Unauthorized" };
    return;
  }

  const token = authHeader.substring(7);

  try {
    const key = await getCryptoKey();
    const payload = await verify(token, key);
    ctx.state.user = payload;
    await next();
  } catch {
    ctx.response.status = 401;
    ctx.response.body = { error: "Invalid token" };
  }
}
