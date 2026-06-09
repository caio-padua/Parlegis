import { Router, type IRouter } from "express";
import { and, asc, desc, eq } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import {
  CreateDemandBody,
  GetDemandParams,
  GetDemandResponse,
  ListMyDemandsResponse,
  ListDemandActivitiesParams,
  ListDemandActivitiesResponse,
} from "@workspace/api-zod";
import { db, demandsTable, demandActivitiesTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth";
import { getOrCreateCurrentUser } from "../lib/currentUser";
import { demandsQuery, makeProtocol } from "../lib/queries";

const router: IRouter = Router();

router.post("/demands", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateDemandBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { userId } = getAuth(req);

  const [created] = await db
    .insert(demandsTable)
    .values({
      ...parsed.data,
      protocol: makeProtocol("DEM"),
      status: "recebida",
      citizenClerkUserId: userId ?? null,
    })
    .returning();

  await db.insert(demandActivitiesTable).values({
    demandId: created.id,
    status: "recebida",
    note: "Demanda recebida pelo gabinete e registrada no sistema.",
    authorName: "Gabinete Digital",
  });

  const [full] = await demandsQuery().where(eq(demandsTable.id, created.id));
  res.status(201).json(GetDemandResponse.parse(full));
});

router.get("/me/demands", requireAuth, async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  const rows = await demandsQuery()
    .where(eq(demandsTable.citizenClerkUserId, userId ?? ""))
    .orderBy(desc(demandsTable.createdAt));
  res.json(ListMyDemandsResponse.parse(rows));
});

router.get("/demands/:id", requireAuth, async (req, res): Promise<void> => {
  const params = GetDemandParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [demand] = await demandsQuery().where(
    eq(demandsTable.id, params.data.id),
  );
  if (!demand) {
    res.status(404).json({ error: "Demanda não encontrada" });
    return;
  }

  const user = await getOrCreateCurrentUser(req);
  const { userId } = getAuth(req);
  // Allow the owner (by clerk id) or any admin.
  const [owned] = await db
    .select({ id: demandsTable.id })
    .from(demandsTable)
    .where(
      and(
        eq(demandsTable.id, params.data.id),
        eq(demandsTable.citizenClerkUserId, userId ?? ""),
      ),
    );
  if (!owned && user?.role !== "admin") {
    res.status(403).json({ error: "Acesso negado" });
    return;
  }

  res.json(GetDemandResponse.parse(demand));
});

router.get(
  "/demands/:id/activities",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = ListDemandActivitiesParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const [demand] = await db
      .select({ owner: demandsTable.citizenClerkUserId })
      .from(demandsTable)
      .where(eq(demandsTable.id, params.data.id));
    if (!demand) {
      res.status(404).json({ error: "Demanda não encontrada" });
      return;
    }

    const user = await getOrCreateCurrentUser(req);
    const { userId } = getAuth(req);
    if (demand.owner !== userId && user?.role !== "admin") {
      res.status(403).json({ error: "Acesso negado" });
      return;
    }

    const rows = await db
      .select()
      .from(demandActivitiesTable)
      .where(eq(demandActivitiesTable.demandId, params.data.id))
      .orderBy(asc(demandActivitiesTable.createdAt));
    res.json(ListDemandActivitiesResponse.parse(rows));
  },
);

export default router;
