import { Router, type IRouter } from "express";
import { and, desc, eq, type SQL } from "drizzle-orm";
import {
  ListProjectsQueryParams,
  ListProjectsResponse,
  GetProjectParams,
  GetProjectResponse,
  CreateProjectBody,
  UpdateProjectParams,
  UpdateProjectBody,
  UpdateProjectResponse,
  DeleteProjectParams,
} from "@workspace/api-zod";
import { db, projectsTable } from "@workspace/db";
import { requirePermission } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/projects", async (req, res): Promise<void> => {
  const parsed = ListProjectsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const conds: SQL[] = [];
  if (parsed.data.type) conds.push(eq(projectsTable.type, parsed.data.type));
  if (parsed.data.status)
    conds.push(eq(projectsTable.status, parsed.data.status));

  const base = db.select().from(projectsTable);
  const rows = await (conds.length ? base.where(and(...conds)) : base).orderBy(
    desc(projectsTable.createdAt),
  );
  res.json(ListProjectsResponse.parse(rows));
});

router.post("/projects", requirePermission("canManageProjects"), async (req, res): Promise<void> => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db
    .insert(projectsTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(GetProjectResponse.parse(created));
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const params = GetProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, params.data.id));
  if (!project) {
    res.status(404).json({ error: "Projeto não encontrado" });
    return;
  }
  res.json(GetProjectResponse.parse(project));
});

router.patch("/projects/:id", requirePermission("canManageProjects"), async (req, res): Promise<void> => {
  const params = UpdateProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [updated] = await db
    .update(projectsTable)
    .set(parsed.data)
    .where(eq(projectsTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Projeto não encontrado" });
    return;
  }
  res.json(UpdateProjectResponse.parse(updated));
});

router.delete("/projects/:id", requirePermission("canManageProjects"), async (req, res): Promise<void> => {
  const params = DeleteProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db
    .delete(projectsTable)
    .where(eq(projectsTable.id, params.data.id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Projeto não encontrado" });
    return;
  }
  res.sendStatus(204);
});

export default router;
