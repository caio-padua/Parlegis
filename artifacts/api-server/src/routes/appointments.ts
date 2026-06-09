import { Router, type IRouter } from "express";
import { and, desc, eq, type SQL } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import {
  CreateAppointmentBody,
  ListMyAppointmentsResponse,
  ListMyAppointmentsResponseItem,
  ListAppointmentsQueryParams,
  ListAppointmentsResponse,
  UpdateAppointmentParams,
  UpdateAppointmentBody,
  UpdateAppointmentResponse,
} from "@workspace/api-zod";
import { db, appointmentsTable } from "@workspace/db";
import { requireAuth, requireAdmin } from "../middlewares/auth";
import { makeProtocol } from "../lib/queries";

const router: IRouter = Router();

router.post("/appointments", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { userId } = getAuth(req);
  const { preferredDate, ...rest } = parsed.data;
  const [created] = await db
    .insert(appointmentsTable)
    .values({
      ...rest,
      protocol: makeProtocol("ATD"),
      status: "solicitado",
      citizenClerkUserId: userId ?? null,
      ...(preferredDate
        ? { preferredDate: new Date(preferredDate).toISOString().slice(0, 10) }
        : {}),
    })
    .returning();
  res.status(201).json(ListMyAppointmentsResponseItem.parse(created));
});

router.get("/me/appointments", requireAuth, async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  const rows = await db
    .select()
    .from(appointmentsTable)
    .where(eq(appointmentsTable.citizenClerkUserId, userId ?? ""))
    .orderBy(desc(appointmentsTable.createdAt));
  res.json(ListMyAppointmentsResponse.parse(rows));
});

router.get(
  "/admin/appointments",
  requireAdmin,
  async (req, res): Promise<void> => {
    const parsed = ListAppointmentsQueryParams.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const conds: SQL[] = [];
    if (parsed.data.status)
      conds.push(eq(appointmentsTable.status, parsed.data.status));

    const base = db.select().from(appointmentsTable);
    const rows = await (
      conds.length ? base.where(and(...conds)) : base
    ).orderBy(desc(appointmentsTable.createdAt));
    res.json(ListAppointmentsResponse.parse(rows));
  },
);

router.patch(
  "/admin/appointments/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = UpdateAppointmentParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = UpdateAppointmentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const { scheduledAt, ...rest } = parsed.data;
    const [updated] = await db
      .update(appointmentsTable)
      .set({
        ...rest,
        ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
      })
      .where(eq(appointmentsTable.id, params.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Atendimento não encontrado" });
      return;
    }
    res.json(UpdateAppointmentResponse.parse(updated));
  },
);

export default router;
