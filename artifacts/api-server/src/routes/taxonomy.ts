import { Router, type IRouter } from "express";
import { asc } from "drizzle-orm";
import {
  ListCategoriesResponse,
  ListNeighborhoodsResponse,
} from "@workspace/api-zod";
import { db, categoriesTable, neighborhoodsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(categoriesTable)
    .orderBy(asc(categoriesTable.name));
  res.json(ListCategoriesResponse.parse(rows));
});

router.get("/neighborhoods", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(neighborhoodsTable)
    .orderBy(asc(neighborhoodsTable.name));
  res.json(ListNeighborhoodsResponse.parse(rows));
});

export default router;
