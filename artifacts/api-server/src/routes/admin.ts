import { Router, type IRouter } from "express";
import { and, desc, eq, ilike, sql, type SQL } from "drizzle-orm";
import {
  ListDemandsQueryParams,
  ListDemandsResponse,
  CreateDemandActivityParams,
  CreateDemandActivityBody,
  ListDemandActivitiesResponseItem,
  GetDashboardSummaryResponse,
} from "@workspace/api-zod";
import { db, demandsTable, demandActivitiesTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";
import { demandsQuery } from "../lib/queries";

const router: IRouter = Router();

router.get("/admin/demands", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListDemandsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { status, categoryId, neighborhoodId, q } = parsed.data;
  const conds: SQL[] = [];
  if (status) conds.push(eq(demandsTable.status, status));
  if (categoryId != null) conds.push(eq(demandsTable.categoryId, categoryId));
  if (neighborhoodId != null)
    conds.push(eq(demandsTable.neighborhoodId, neighborhoodId));
  if (q) conds.push(ilike(demandsTable.title, `%${q}%`));

  const base = demandsQuery();
  const rows = await (conds.length ? base.where(and(...conds)) : base).orderBy(
    desc(demandsTable.createdAt),
  );
  res.json(ListDemandsResponse.parse(rows));
});

router.post(
  "/admin/demands/:id/activities",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = CreateDemandActivityParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = CreateDemandActivityBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [demand] = await db
      .select({ id: demandsTable.id })
      .from(demandsTable)
      .where(eq(demandsTable.id, params.data.id));
    if (!demand) {
      res.status(404).json({ error: "Demanda não encontrada" });
      return;
    }

    const [activity] = await db
      .insert(demandActivitiesTable)
      .values({
        demandId: params.data.id,
        status: parsed.data.status ?? null,
        note: parsed.data.note,
        authorName: req.currentUser?.name ?? "Equipe do gabinete",
      })
      .returning();

    if (parsed.data.status) {
      await db
        .update(demandsTable)
        .set({ status: parsed.data.status })
        .where(eq(demandsTable.id, params.data.id));
    }

    res.status(201).json(ListDemandActivitiesResponseItem.parse(activity));
  },
);

router.get("/admin/dashboard", requireAdmin, async (_req, res): Promise<void> => {
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(demandsTable);
  const [{ resolved }] = await db
    .select({ resolved: sql<number>`count(*)::int` })
    .from(demandsTable)
    .where(eq(demandsTable.status, "resolvida"));

  const byStatus = await db
    .select({
      status: demandsTable.status,
      count: sql<number>`count(*)::int`,
    })
    .from(demandsTable)
    .groupBy(demandsTable.status);

  const pending = await db.execute<{ count: number }>(
    sql`select count(*)::int as count from appointments where status = 'solicitado'`,
  );
  const pendingAppointments = Number(pending.rows[0]?.count ?? 0);

  const recentDemands = await demandsQuery()
    .orderBy(desc(demandsTable.createdAt))
    .limit(6);

  const openDemands =
    total -
    byStatus
      .filter((s) => s.status === "resolvida" || s.status === "arquivada")
      .reduce((acc, s) => acc + s.count, 0);

  res.json(
    GetDashboardSummaryResponse.parse({
      totalDemands: total,
      resolvedDemands: resolved,
      openDemands,
      pendingAppointments,
      byStatus,
      recentDemands,
    }),
  );
});

export default router;
