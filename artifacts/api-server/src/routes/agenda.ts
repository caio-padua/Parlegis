import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import {
  ListAgendaResponse,
  CreateAgendaEventBody,
  UpdateAgendaEventParams,
  UpdateAgendaEventBody,
  UpdateAgendaEventResponse,
  DeleteAgendaEventParams,
} from "@workspace/api-zod";
import { db, agendaTable } from "@workspace/db";
import { requirePermission } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/agenda", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(agendaTable)
    .orderBy(asc(agendaTable.startsAt));
  res.json(ListAgendaResponse.parse(rows));
});

router.post("/agenda", requirePermission("canManageAgenda"), async (req, res): Promise<void> => {
  const parsed = CreateAgendaEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { startsAt, ...rest } = parsed.data;
  const [created] = await db
    .insert(agendaTable)
    .values({ ...rest, startsAt: new Date(startsAt) })
    .returning();
  res.status(201).json(UpdateAgendaEventResponse.parse(created));
});

router.patch("/agenda/:id", requirePermission("canManageAgenda"), async (req, res): Promise<void> => {
  const params = UpdateAgendaEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateAgendaEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { startsAt, ...rest } = parsed.data;
  const [updated] = await db
    .update(agendaTable)
    .set({
      ...rest,
      ...(startsAt ? { startsAt: new Date(startsAt) } : {}),
    })
    .where(eq(agendaTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Evento não encontrado" });
    return;
  }
  res.json(UpdateAgendaEventResponse.parse(updated));
});

router.delete("/agenda/:id", requirePermission("canManageAgenda"), async (req, res): Promise<void> => {
  const params = DeleteAgendaEventParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db
    .delete(agendaTable)
    .where(eq(agendaTable.id, params.data.id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Evento não encontrado" });
    return;
  }
  res.sendStatus(204);
});

export default router;
