import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import {
  ListNewsResponse,
  GetNewsArticleParams,
  GetNewsArticleResponse,
  CreateNewsArticleBody,
  UpdateNewsArticleParams,
  UpdateNewsArticleBody,
  UpdateNewsArticleResponse,
  DeleteNewsArticleParams,
} from "@workspace/api-zod";
import { db, newsTable } from "@workspace/db";
import { requirePermission } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/news", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(newsTable)
    .orderBy(desc(newsTable.publishedAt));
  res.json(ListNewsResponse.parse(rows));
});

router.post("/news", requirePermission("canManageNews"), async (req, res): Promise<void> => {
  const parsed = CreateNewsArticleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { publishedAt, ...rest } = parsed.data;
  const [created] = await db
    .insert(newsTable)
    .values({
      ...rest,
      ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
    })
    .returning();
  res.status(201).json(GetNewsArticleResponse.parse(created));
});

router.get("/news/:id", async (req, res): Promise<void> => {
  const params = GetNewsArticleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [article] = await db
    .select()
    .from(newsTable)
    .where(eq(newsTable.id, params.data.id));
  if (!article) {
    res.status(404).json({ error: "Notícia não encontrada" });
    return;
  }
  res.json(GetNewsArticleResponse.parse(article));
});

router.patch("/news/:id", requirePermission("canManageNews"), async (req, res): Promise<void> => {
  const params = UpdateNewsArticleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateNewsArticleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { publishedAt, ...rest } = parsed.data;
  const [updated] = await db
    .update(newsTable)
    .set({
      ...rest,
      ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
    })
    .where(eq(newsTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Notícia não encontrada" });
    return;
  }
  res.json(UpdateNewsArticleResponse.parse(updated));
});

router.delete("/news/:id", requirePermission("canManageNews"), async (req, res): Promise<void> => {
  const params = DeleteNewsArticleParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db
    .delete(newsTable)
    .where(eq(newsTable.id, params.data.id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Notícia não encontrada" });
    return;
  }
  res.sendStatus(204);
});

export default router;
