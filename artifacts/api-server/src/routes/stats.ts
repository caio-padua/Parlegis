import { Router, type IRouter } from "express";
import { asc, desc, eq, sql } from "drizzle-orm";
import {
  GetDemandsByNeighborhoodResponse,
  GetDemandsByCategoryResponse,
  TrackDemandParams,
  TrackDemandResponse,
} from "@workspace/api-zod";
import {
  db,
  demandsTable,
  categoriesTable,
  neighborhoodsTable,
  demandActivitiesTable,
} from "@workspace/db";

const router: IRouter = Router();

router.get(
  "/stats/demands-by-neighborhood",
  async (_req, res): Promise<void> => {
    const rows = await db
      .select({
        neighborhoodId: neighborhoodsTable.id,
        name: neighborhoodsTable.name,
        region: neighborhoodsTable.region,
        count: sql<number>`count(${demandsTable.id})::int`,
      })
      .from(neighborhoodsTable)
      .leftJoin(
        demandsTable,
        eq(demandsTable.neighborhoodId, neighborhoodsTable.id),
      )
      .groupBy(neighborhoodsTable.id)
      .orderBy(desc(sql`count(${demandsTable.id})`), asc(neighborhoodsTable.name));
    res.json(GetDemandsByNeighborhoodResponse.parse(rows));
  },
);

router.get("/stats/demands-by-category", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      categoryId: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      icon: categoriesTable.icon,
      count: sql<number>`count(${demandsTable.id})::int`,
    })
    .from(categoriesTable)
    .leftJoin(demandsTable, eq(demandsTable.categoryId, categoriesTable.id))
    .groupBy(categoriesTable.id)
    .orderBy(desc(sql`count(${demandsTable.id})`), asc(categoriesTable.name));
  res.json(GetDemandsByCategoryResponse.parse(rows));
});

router.get("/track/:protocol", async (req, res): Promise<void> => {
  const params = TrackDemandParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [demand] = await db
    .select({
      id: demandsTable.id,
      protocol: demandsTable.protocol,
      title: demandsTable.title,
      status: demandsTable.status,
      categoryName: categoriesTable.name,
      neighborhoodName: neighborhoodsTable.name,
      createdAt: demandsTable.createdAt,
    })
    .from(demandsTable)
    .leftJoin(categoriesTable, eq(demandsTable.categoryId, categoriesTable.id))
    .leftJoin(
      neighborhoodsTable,
      eq(demandsTable.neighborhoodId, neighborhoodsTable.id),
    )
    .where(eq(demandsTable.protocol, params.data.protocol));

  if (!demand) {
    res.status(404).json({ error: "Protocolo não encontrado" });
    return;
  }

  const activities = await db
    .select()
    .from(demandActivitiesTable)
    .where(eq(demandActivitiesTable.demandId, demand.id))
    .orderBy(asc(demandActivitiesTable.createdAt));

  res.json(
    TrackDemandResponse.parse({
      protocol: demand.protocol,
      title: demand.title,
      status: demand.status,
      categoryName: demand.categoryName,
      neighborhoodName: demand.neighborhoodName,
      createdAt: demand.createdAt,
      activities,
    }),
  );
});

export default router;
