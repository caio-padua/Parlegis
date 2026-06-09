import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  GetMandateStatsResponse,
  UpdateMandateStatsBody,
  UpdateMandateStatsResponse,
} from "@workspace/api-zod";
import { db, mandateStatsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

async function getOrCreateStats() {
  const [existing] = await db.select().from(mandateStatsTable).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(mandateStatsTable).values({}).returning();
  return created;
}

router.get("/mandate-stats", async (_req, res): Promise<void> => {
  const stats = await getOrCreateStats();
  res.json(GetMandateStatsResponse.parse(stats));
});

router.patch("/mandate-stats", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateMandateStatsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const current = await getOrCreateStats();
  const [updated] = await db
    .update(mandateStatsTable)
    .set(parsed.data)
    .where(eq(mandateStatsTable.id, current.id))
    .returning();
  res.json(UpdateMandateStatsResponse.parse(updated));
});

export default router;
