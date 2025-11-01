import { Application, Context, Next, Router } from "@oak/oak";
import authRouter from "./routes/auth.ts";
import projectsRouter from "./routes/projects.ts";
import shortUrlsRouter, { handleRedirect } from "./routes/shortUrls.ts";

const app = new Application();

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

const SHORTENER_DOMAIN = Deno.env.get("SHORTENER_DOMAIN");
const MAIN_SITE_URL = Deno.env.get("MAIN_SITE_URL");

function normalizeHost(host: string): string {
  return host.split(":")[0].toLowerCase();
}

function isShortenerDomain(host: string): boolean {
  if (!SHORTENER_DOMAIN) return false;
  const normalizedHost = normalizeHost(host);
  const normalizedShortener = normalizeHost(SHORTENER_DOMAIN);
  return normalizedHost === normalizedShortener;
}

mainRouter.get("/", (ctx: Context) => {
  const host = ctx.request.headers.get("host") || "";
  console.log(`[ROOT] Host: ${host}, Path: ${ctx.request.url.pathname}`);
  console.log(
    `[ROOT] SHORTENER_DOMAIN: ${SHORTENER_DOMAIN}, MAIN_SITE_URL: ${MAIN_SITE_URL}`,
  );

  if (isShortenerDomain(host)) {
    console.log(
      `[ROOT] Matched shortener domain, redirecting to: ${MAIN_SITE_URL}`,
    );
    if (MAIN_SITE_URL) {
      const mainSiteHost = normalizeHost(
        MAIN_SITE_URL.replace(/^https?:\/\//, "").split("/")[0],
      );
      if (mainSiteHost === normalizeHost(host)) {
        ctx.response.body = {
          message: `${SHORTENER_DOMAIN} URL Shortener`,
          info: "Use /:code to access short URLs",
        };
        return;
      }

      let redirectUrl = MAIN_SITE_URL;
      if (
        !redirectUrl.startsWith("http://") &&
        !redirectUrl.startsWith("https://")
      ) {
        redirectUrl = `https://${redirectUrl}`;
      }
      redirectUrl = redirectUrl.replace(/^http:\/\//, "https://");

      redirectUrl = redirectUrl.replace(/\/+$/, "") || redirectUrl;

      console.log(`[ROOT] Sending 302 redirect to: ${redirectUrl}`);
      ctx.response.redirect(redirectUrl);
      return;
    }
    ctx.response.body = {
      message: `${SHORTENER_DOMAIN} URL Shortener`,
      info: "Use /:code to access short URLs",
    };
    return;
  }

  ctx.response.body = { message: "Tancred API" };
});

app.use(mainRouter.routes());
app.use(authRouter.routes());
app.use(projectsRouter.routes());
app.use(shortUrlsRouter.routes());

app.use(async (ctx: Context, next: Next) => {
  console.log(
    `[MIDDLEWARE] ${ctx.request.method} ${ctx.request.url.pathname}, Host: ${
      ctx.request.headers.get("host") || ""
    }`,
  );

  if (ctx.request.method !== "GET") {
    await next();
    return;
  }

  if (!SHORTENER_DOMAIN) {
    await next();
    return;
  }

  const path = ctx.request.url.pathname;
  const host = ctx.request.headers.get("host") || "";

  if (isShortenerDomain(host)) {
    console.log(
      `[MIDDLEWARE] Matched shortener domain, checking for code in path: ${path}`,
    );
    const codeMatch = path.match(/^\/([a-zA-Z0-9_-]+)$/);
    if (codeMatch) {
      const code = codeMatch[1];
      const apiRoutes = ["auth", "projects", "short-urls"];
      if (!apiRoutes.includes(code) && /^[a-zA-Z0-9_-]{1,50}$/.test(code)) {
        console.log(`[MIDDLEWARE] Handling redirect for code: ${code}`);
        await handleRedirect(ctx, code);
        return;
      } else {
        console.log(
          `[MIDDLEWARE] Code "${code}" is an API route or invalid, skipping`,
        );
      }
    }
  }

  await next();
});

app.use((ctx: Context) => {
  ctx.response.status = 404;
  ctx.response.body = { error: "Not found" };
});

const port = 8000;
console.log(`Server running on http://0.0.0.0:${port}`);
await app.listen({ port, hostname: "0.0.0.0" });
