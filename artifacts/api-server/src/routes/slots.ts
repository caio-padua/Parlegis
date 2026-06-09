import { Router, type IRouter } from "express";
import { and, asc, eq, gte, sql } from "drizzle-orm";
import {
  ListAvailableSlotsResponse,
  ListSlotsResponse,
  CreateSlotBody,
  UpdateSlotParams,
  UpdateSlotBody,
  UpdateSlotResponse,
} from "@workspace/api-zod";
import { db, appointmentSlotsTable, type AppointmentSlot } from "@workspace/db";
import { requireAuth, requireStaff, requirePermission } from "../middlewares/auth";

const router: IRouter = Router();

const PERIOD_ORDER: Record<string, number> = { manha: 0, tarde: 1 };

function withAvailable(slot: AppointmentSlot) {
  return {
    ...slot,
    available: Math.max(0, slot.capacity - slot.bookedCount),
  };
}

/** Citizen-facing: only released slots that still have room, today onward. */
router.get("/appointment-slots", requireAuth, async (_req, res): Promise<void> => {
  const today = new Date().toISOString().slice(0, 10);
  const rows = await db
    .select()
    .from(appointmentSlotsTable)
    .where(
      and(
        eq(appointmentSlotsTable.released, true),
        gte(appointmentSlotsTable.date, today),
      ),
    )
    .orderBy(asc(appointmentSlotsTable.date));
  const available = rows
    .map(withAvailable)
    .filter((s) => s.available > 0)
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) ||
        (PERIOD_ORDER[a.period] ?? 9) - (PERIOD_ORDER[b.period] ?? 9),
    );
  res.json(ListAvailableSlotsResponse.parse(available));
});

/** Staff: full list of cards with counts. */
router.get(
  "/admin/appointment-slots",
  requireStaff,
  async (_req, res): Promise<void> => {
    const rows = await db
      .select()
      .from(appointmentSlotsTable)
      .orderBy(asc(appointmentSlotsTable.date));
    const mapped = rows
      .map(withAvailable)
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          (PERIOD_ORDER[a.period] ?? 9) - (PERIOD_ORDER[b.period] ?? 9),
      );
    res.json(ListSlotsResponse.parse(mapped));
  },
);

/** Manager: open a new card. */
router.post(
  "/admin/appointment-slots",
  requirePermission("canReleaseScheduleCards"),
  async (req, res): Promise<void> => {
    const parsed = CreateSlotBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const { date, period, capacity, released, note } = parsed.data;
    try {
      const [created] = await db
        .insert(appointmentSlotsTable)
        .values({
          date: date.toISOString().slice(0, 10),
          period,
          capacity: capacity ?? 5,
          released: released ?? false,
          note: note ?? null,
        })
        .returning();
      res.status(201).json(UpdateSlotResponse.parse(withAvailable(created)));
    } catch {
      res
        .status(409)
        .json({ error: "Já existe um cartão para esta data e período" });
    }
  },
);

/** Manager: release/hold or adjust a card. */
router.patch(
  "/admin/appointment-slots/:id",
  requirePermission("canReleaseScheduleCards"),
  async (req, res): Promise<void> => {
    const params = UpdateSlotParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = UpdateSlotBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const set: Partial<typeof appointmentSlotsTable.$inferInsert> = {};
    if (parsed.data.capacity !== undefined) set.capacity = parsed.data.capacity;
    if (parsed.data.released !== undefined) set.released = parsed.data.released;
    if (parsed.data.note !== undefined) set.note = parsed.data.note;
    const [updated] = await db
      .update(appointmentSlotsTable)
      .set(set)
      .where(eq(appointmentSlotsTable.id, params.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Cartão não encontrado" });
      return;
    }
    res.json(UpdateSlotResponse.parse(withAvailable(updated)));
  },
);

/**
 * Atomically reserve a seat on a released, non-full slot.
 * Returns the updated slot, or null if not bookable. Used by the appointments route.
 */
export async function reserveSlotSeat(
  slotId: number,
): Promise<AppointmentSlot | null> {
  const [updated] = await db
    .update(appointmentSlotsTable)
    .set({ bookedCount: sql`${appointmentSlotsTable.bookedCount} + 1` })
    .where(
      and(
        eq(appointmentSlotsTable.id, slotId),
        eq(appointmentSlotsTable.released, true),
        sql`${appointmentSlotsTable.bookedCount} < ${appointmentSlotsTable.capacity}`,
      ),
    )
    .returning();
  return updated ?? null;
}

/**
 * Progressive release: if the just-booked slot is now full, auto-release the
 * next held card (by date then period) so capacity opens up gradually.
 */
export async function maybeReleaseNext(justBooked: AppointmentSlot): Promise<void> {
  if (justBooked.bookedCount < justBooked.capacity) return;
  const [next] = await db
    .select()
    .from(appointmentSlotsTable)
    .where(
      and(
        eq(appointmentSlotsTable.released, false),
        gte(appointmentSlotsTable.date, justBooked.date),
      ),
    )
    .orderBy(asc(appointmentSlotsTable.date))
    .limit(1);
  if (next) {
    await db
      .update(appointmentSlotsTable)
      .set({ released: true })
      .where(eq(appointmentSlotsTable.id, next.id));
  }
}

export default router;
