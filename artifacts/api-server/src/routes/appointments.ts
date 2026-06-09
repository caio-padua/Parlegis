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
import { requireAuth, requirePermission } from "../middlewares/auth";
import { makeProtocol } from "../lib/queries";
import { reserveSlotSeat, maybeReleaseNext } from "./slots";

const router: IRouter = Router();

router.post("/appointments", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { userId } = getAuth(req);
  const { preferredDate, slotId, ...rest } = parsed.data;

  let reservedDate: string | undefined;
  if (slotId !== undefined) {
    const seat = await reserveSlotSeat(slotId);
    if (!seat) {
      res
        .status(409)
        .json({ error: "Este horário não está mais disponível. Escolha outro." });
      return;
    }
    reservedDate = seat.date;
    await maybeReleaseNext(seat);
  }

  const effectiveDate = reservedDate ?? preferredDate;
  const [created] = await db
    .insert(appointmentsTable)
    .values({
      ...rest,
      protocol: makeProtocol("ATD"),
      status: "solicitado",
      citizenClerkUserId: userId ?? null,
      ...(slotId !== undefined ? { slotId } : {}),
      ...(effectiveDate
        ? { preferredDate: new Date(effectiveDate).toISOString().slice(0, 10) }
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
  requirePermission("canManageAppointments"),
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
  requirePermission("canManageAppointments"),
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
