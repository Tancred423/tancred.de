import { Context, Router, RouterContext } from "@oak/oak";
import { db } from "../db/connection.ts";
import { projects } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth.ts";

const router = new Router();

router.get("/projects", async (ctx: Context) => {
  const allProjects = await db.select().from(projects).orderBy(projects.order);
  ctx.response.body = allProjects;
});

function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    if (urlObj.pathname === "/") {
      urlObj.pathname = "";
    }
    return urlObj.toString().replace(/\/$/, "");
  } catch {
    return url.replace(/\/$/, "");
  }
}

router.post("/projects", authMiddleware, async (ctx: Context) => {
  const body = await ctx.request.body.json();
  const { title, description, url, imageUrl, order } = body;

  if (!title || !url) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Title and URL are required" };
    return;
  }

  // Input validation
  if (typeof title !== "string" || title.length === 0 || title.length > 255) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Title must be between 1 and 255 characters" };
    return;
  }

  if (typeof url !== "string" || url.length === 0 || url.length > 500) {
    ctx.response.status = 400;
    ctx.response.body = { error: "URL must be between 1 and 500 characters" };
    return;
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid URL format" };
    return;
  }

  if (
    description &&
    (typeof description !== "string" || description.length > 5000)
  ) {
    ctx.response.status = 400;
    ctx.response.body = {
      error: "Description must be less than 5000 characters",
    };
    return;
  }

  if (imageUrl) {
    if (typeof imageUrl !== "string" || imageUrl.length > 500) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Image URL must be less than 500 characters",
      };
      return;
    }
    try {
      new URL(imageUrl);
    } catch {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid image URL format" };
      return;
    }
  }

  if (
    order !== undefined &&
    (typeof order !== "number" || order < 0 || order > 1000000)
  ) {
    ctx.response.status = 400;
    ctx.response.body = {
      error: "Order must be a number between 0 and 1000000",
    };
    return;
  }

  const normalizedUrl = normalizeUrl(url);
  const normalizedImageUrl = imageUrl ? normalizeUrl(imageUrl) : null;

  const [result] = await db.insert(projects).values({
    title,
    description: description || null,
    url: normalizedUrl,
    imageUrl: normalizedImageUrl,
    order: order || 0,
  });

  ctx.response.status = 201;
  ctx.response.body = { id: result.insertId, message: "Project created" };
});

router.put(
  "/projects/:id",
  authMiddleware,
  async (ctx: RouterContext<"/projects/:id">) => {
    const id = parseInt(ctx.params.id);

    if (isNaN(id) || id <= 0) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid project ID" };
      return;
    }

    const body = await ctx.request.body.json();
    const { title, description, url, imageUrl, order } = body;

    // Input validation (same as POST)
    if (
      title !== undefined &&
      (typeof title !== "string" || title.length === 0 || title.length > 255)
    ) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Title must be between 1 and 255 characters",
      };
      return;
    }

    if (url !== undefined) {
      if (typeof url !== "string" || url.length === 0 || url.length > 500) {
        ctx.response.status = 400;
        ctx.response.body = {
          error: "URL must be between 1 and 500 characters",
        };
        return;
      }
      try {
        new URL(url);
      } catch {
        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid URL format" };
        return;
      }
    }

    if (
      description !== undefined && description !== null &&
      (typeof description !== "string" || description.length > 5000)
    ) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Description must be less than 5000 characters",
      };
      return;
    }

    if (imageUrl !== undefined && imageUrl !== null) {
      if (typeof imageUrl !== "string" || imageUrl.length > 500) {
        ctx.response.status = 400;
        ctx.response.body = {
          error: "Image URL must be less than 500 characters",
        };
        return;
      }
      try {
        new URL(imageUrl);
      } catch {
        ctx.response.status = 400;
        ctx.response.body = { error: "Invalid image URL format" };
        return;
      }
    }

    if (
      order !== undefined &&
      (typeof order !== "number" || order < 0 || order > 1000000)
    ) {
      ctx.response.status = 400;
      ctx.response.body = {
        error: "Order must be a number between 0 and 1000000",
      };
      return;
    }

    const normalizedUrl = url ? normalizeUrl(url) : undefined;
    const normalizedImageUrl = imageUrl
      ? normalizeUrl(imageUrl)
      : imageUrl === null
      ? null
      : undefined;

    await db.update(projects)
      .set({
        title,
        description: description || null,
        url: normalizedUrl,
        imageUrl: normalizedImageUrl,
        order: order || 0,
      })
      .where(eq(projects.id, id));

    ctx.response.body = { message: "Project updated" };
  },
);

router.delete(
  "/projects/:id",
  authMiddleware,
  async (ctx: RouterContext<"/projects/:id">) => {
    const id = parseInt(ctx.params.id);

    await db.delete(projects).where(eq(projects.id, id));

    ctx.response.body = { message: "Project deleted" };
  },
);

export default router;
