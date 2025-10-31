import { create } from "djwt";

const JWT_SECRET = Deno.env.get("JWT_SECRET");
if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET environment variable is required. Please set it in your environment or .env file.",
  );
}

export async function getCryptoKey() {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(JWT_SECRET);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function generateToken(userId: number, username: string) {
  const key = await getCryptoKey();
  return await create(
    { alg: "HS256", typ: "JWT" },
    {
      userId,
      username,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
    },
    key,
  );
}
