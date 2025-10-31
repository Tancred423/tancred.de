import { Application, Context, Next, Router } from "@oak/oak";
import authRouter from "./routes/auth.ts";
import projectsRouter from "./routes/projects.ts";
import shortUrlsRouter, { handleRedirect } from "./routes/shortUrls.ts";

const app = new Application();

// CORS configuration - restrict to frontend domain in production
app.use(async (ctx: Context, next: Next) => {
  const allowedOrigin = Deno.env.get("CORS_ORIGIN") || "*";

  ctx.response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  ctx.response.headers.set("Access-Control-Allow-Credentials", "false");

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 200;
    return;
  }

  await next();
});

const mainRouter = new Router();

// Get shortener domain from environment variable
const SHORTENER_DOMAIN = Deno.env.get("SHORTENER_DOMAIN");
// Get main site URL from environment variable
const MAIN_SITE_URL = Deno.env.get("MAIN_SITE_URL");

// Root endpoint - check if it's shortener domain, handle accordingly
mainRouter.get("/", (ctx: Context) => {
  const host = ctx.request.headers.get("host") || "";

  // If it's shortener domain without a code, redirect to main site
  if (SHORTENER_DOMAIN && host.includes(SHORTENER_DOMAIN)) {
    if (MAIN_SITE_URL) {
      // Ensure it's a full URL (add https:// if missing)
      const redirectUrl = MAIN_SITE_URL.startsWith("http")
        ? MAIN_SITE_URL
        : `https://${MAIN_SITE_URL}`;
      ctx.response.redirect(redirectUrl);
      return;
    }
    // Fallback if MAIN_SITE_URL not set
    ctx.response.body = {
      message: `${SHORTENER_DOMAIN} URL Shortener`,
      info: "Use /:code to access short URLs",
    };
    return;
  }

  ctx.response.body = { message: "Tancred API" };
});

// Register API routes first (these take precedence)
app.use(mainRouter.routes());
app.use(authRouter.routes());
app.use(projectsRouter.routes());
app.use(shortUrlsRouter.routes()); // Admin routes under /short-urls

// Catch-all redirect handler for short URLs - must be LAST
// Only handles shortener domain/:code redirects
app.use(async (ctx: Context, next: Next) => {
  // Only handle GET requests for redirects
  if (ctx.request.method !== "GET") {
    await next();
    return;
  }

  // Skip if shortener domain is not configured
  if (!SHORTENER_DOMAIN) {
    await next();
    return;
  }

  const path = ctx.request.url.pathname;
  const host = ctx.request.headers.get("host") || "";

  // Only handle redirects on shortener domain
  if (host.includes(SHORTENER_DOMAIN)) {
    const codeMatch = path.match(/^\/([a-zA-Z0-9_-]+)$/);
    if (codeMatch) {
      const code = codeMatch[1];
      // Skip if it's a known API route
      const apiRoutes = ["auth", "projects", "short-urls"];
      if (!apiRoutes.includes(code) && /^[a-zA-Z0-9_-]{1,50}$/.test(code)) {
        await handleRedirect(ctx, code);
        return;
      }
    }
  }

  // If no redirect matched, continue to next middleware
  await next();
});

const port = 8000;
console.log(`Server running on http://0.0.0.0:${port}`);
await app.listen({ port, hostname: "0.0.0.0" });
