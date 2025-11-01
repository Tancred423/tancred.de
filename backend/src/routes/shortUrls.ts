import { Context, Router, RouterContext } from "@oak/oak";
import { db } from "../db/connection.ts";
import { shortUrls } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.ts";
import { nanoid } from "nanoid";

const router = new Router();

const BLOCKED_CODES = ["share"];

async function handleRedirect(ctx: Context, code: string) {
  try {
    const [shortUrl] = await db.select().from(shortUrls).where(
      eq(shortUrls.code, code),
    ).limit(1);

    if (!shortUrl) {
      const MAIN_SITE_URL = Deno.env.get("MAIN_SITE_URL");
      if (MAIN_SITE_URL) {
        let redirectUrl = MAIN_SITE_URL;
        if (
          !redirectUrl.startsWith("http://") &&
          !redirectUrl.startsWith("https://")
        ) {
          redirectUrl = `https://${redirectUrl}`;
        }
        redirectUrl = redirectUrl.replace(/^http:\/\//, "https://");
        ctx.response.redirect(redirectUrl);
        return;
      }
      ctx.response.status = 404;
      ctx.response.body = { error: "Short URL not found" };
      return;
    }

    db.update(shortUrls)
      .set({ clicks: shortUrl.clicks + 1 })
      .where(eq(shortUrls.id, shortUrl.id))
      .then(() => {})
      .catch((error: unknown) => {
        console.error(
          "Failed to increment click counter for code:",
          code,
          error,
        );
      });

    ctx.response.redirect(shortUrl.targetUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal server error" };
  }
}

export { handleRedirect };

router.get("/short-urls", authMiddleware, async (ctx: Context) => {
  const allUrls = await db.select().from(shortUrls).orderBy(
    shortUrls.createdAt,
  );
  ctx.response.body = allUrls;
});

router.post("/short-urls", authMiddleware, async (ctx: Context) => {
  const body = await ctx.request.body.json();
  const { targetUrl } = body;
  let { code } = body;

  if (!targetUrl) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Target URL is required" };
    return;
  }

  if (!code) {
    let attempts = 0;
    while (attempts < 10) {
      code = nanoid(6);
      const [existing] = await db.select().from(shortUrls).where(
        eq(shortUrls.code, code),
      ).limit(1);
      if (!existing) break;
      attempts++;
    }
  } else {
    if (BLOCKED_CODES.includes(code.toLowerCase())) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: `Code '${code}' is reserved and cannot be used`,
      };
      return;
    }

    const [existing] = await db.select().from(shortUrls).where(
      eq(shortUrls.code, code),
    ).limit(1);
    if (existing) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Code already exists" };
      return;
    }
  }

  try {
    const [result] = await db.insert(shortUrls).values({
      code,
      targetUrl,
      clicks: 0,
    });

    ctx.response.status = 201;
    ctx.response.body = {
      id: result.insertId,
      code,
      message: "Short URL created",
    };
  } catch {
    ctx.response.status = 400;
    ctx.response.body = { error: "Failed to create short URL" };
  }
});

router.put(
  "/short-urls/:id",
  authMiddleware,
  async (ctx: RouterContext<"/short-urls/:id">) => {
    const id = parseInt(ctx.params.id);
    const body = await ctx.request.body.json();
    const { code, targetUrl } = body;

    if (code && BLOCKED_CODES.includes(code.toLowerCase())) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: `Code '${code}' is reserved and cannot be used`,
      };
      return;
    }

    const [existing] = await db.select().from(shortUrls).where(
      eq(shortUrls.id, id),
    ).limit(1);

    if (!existing) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Short URL not found" };
      return;
    }

    if (code && code !== existing.code) {
      const [duplicate] = await db.select().from(shortUrls).where(
        eq(shortUrls.code, code),
      ).limit(1);
      if (duplicate) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Code already exists" };
        return;
      }
    }

    await db.update(shortUrls)
      .set({
        code: code || existing.code,
        targetUrl: targetUrl || existing.targetUrl,
      })
      .where(eq(shortUrls.id, id));

    ctx.response.body = { message: "Short URL updated" };
  },
);

router.delete(
  "/short-urls/:id",
  authMiddleware,
  async (ctx: RouterContext<"/short-urls/:id">) => {
    const id = parseInt(ctx.params.id);

    await db.delete(shortUrls).where(eq(shortUrls.id, id));

    ctx.response.body = { message: "Short URL deleted" };
  },
);

export default router;
