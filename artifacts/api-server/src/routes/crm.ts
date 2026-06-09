import { Router, type IRouter } from "express";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import {
  ListVotersQueryParams,
  ListVotersResponse,
  CreateVoterBody,
  UpdateVoterParams,
  UpdateVoterBody,
  UpdateVoterResponse,
  DeleteVoterParams,
  ListBirthdaysQueryParams,
  ListBirthdaysResponse,
  ListMessagesResponse,
  CreateMessageBody,
  SendMessageParams,
  SendMessageResponse,
  ListGiftsResponse,
  CreateGiftBody,
  UpdateGiftParams,
  UpdateGiftBody,
  UpdateGiftResponse,
  ListMessageTemplatesResponse,
  CreateMessageTemplateBody,
} from "@workspace/api-zod";
import {
  db,
  votersTable,
  messagesTable,
  giftsTable,
  messageTemplatesTable,
} from "@workspace/db";
import { requirePermission } from "../middlewares/auth";
import { dispatchMessage, channelConfigured } from "../lib/integrations";

const router: IRouter = Router();

const toDateString = (d: Date | null | undefined): string | null =>
  d ? d.toISOString().slice(0, 10) : null;

/* ----------------------------- Voters (CRM) ----------------------------- */

router.get(
  "/admin/voters",
  requirePermission("canManageVoters"),
  async (req, res): Promise<void> => {
    const parsed = ListVotersQueryParams.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const term = parsed.data.search?.trim();
    const base = db.select().from(votersTable);
    const rows = await (term
      ? base.where(
          or(
            ilike(votersTable.name, `%${term}%`),
            ilike(votersTable.neighborhood, `%${term}%`),
            ilike(votersTable.whatsapp, `%${term}%`),
          ),
        )
      : base
    ).orderBy(desc(votersTable.createdAt));
    res.json(ListVotersResponse.parse(rows));
  },
);

// Must be registered before "/admin/voters/:id".
router.get(
  "/admin/voters/birthdays",
  requirePermission("canManageVoters"),
  async (req, res): Promise<void> => {
    const parsed = ListBirthdaysQueryParams.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const days = parsed.data.days ?? 7;
    const rows = await db.select().from(votersTable);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const result = rows
      .filter((v) => v.birthDate)
      .map((v) => {
        const bd = new Date(v.birthDate as string);
        let next = new Date(today.getFullYear(), bd.getUTCMonth(), bd.getUTCDate());
        if (next < today) next = new Date(today.getFullYear() + 1, bd.getUTCMonth(), bd.getUTCDate());
        const daysUntil = Math.round((next.getTime() - today.getTime()) / 86400000);
        return {
          id: v.id,
          name: v.name,
          whatsapp: v.whatsapp,
          birthDate: v.birthDate,
          neighborhood: v.neighborhood,
          daysUntil,
        };
      })
      .filter((v) => v.daysUntil <= days)
      .sort((a, b) => a.daysUntil - b.daysUntil);
    res.json(ListBirthdaysResponse.parse(result));
  },
);

router.post(
  "/admin/voters",
  requirePermission("canManageVoters"),
  async (req, res): Promise<void> => {
    const parsed = CreateVoterBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const { birthDate, ...rest } = parsed.data;
    const [created] = await db
      .insert(votersTable)
      .values({ ...rest, birthDate: toDateString(birthDate) })
      .returning();
    res.status(201).json(UpdateVoterResponse.parse(created));
  },
);

router.patch(
  "/admin/voters/:id",
  requirePermission("canManageVoters"),
  async (req, res): Promise<void> => {
    const params = UpdateVoterParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = UpdateVoterBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const { birthDate, ...rest } = parsed.data;
    const [updated] = await db
      .update(votersTable)
      .set({ ...rest, birthDate: toDateString(birthDate) })
      .where(eq(votersTable.id, params.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Eleitor não encontrado" });
      return;
    }
    res.json(UpdateVoterResponse.parse(updated));
  },
);

router.delete(
  "/admin/voters/:id",
  requirePermission("canManageVoters"),
  async (req, res): Promise<void> => {
    const params = DeleteVoterParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    await db.delete(votersTable).where(eq(votersTable.id, params.data.id));
    res.status(204).send();
  },
);

/* ------------------------------ Messages ------------------------------- */

router.get(
  "/admin/messages",
  requirePermission("canMessageVoters"),
  async (_req, res): Promise<void> => {
    const rows = await db
      .select()
      .from(messagesTable)
      .orderBy(desc(messagesTable.createdAt));
    res.json(ListMessagesResponse.parse(rows));
  },
);

router.post(
  "/admin/messages",
  requirePermission("canMessageVoters"),
  async (req, res): Promise<void> => {
    const parsed = CreateMessageBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [created] = await db
      .insert(messagesTable)
      .values({
        voterId: parsed.data.voterId ?? null,
        recipientName: parsed.data.recipientName,
        recipientContact: parsed.data.recipientContact ?? null,
        channel: parsed.data.channel ?? "whatsapp",
        kind: parsed.data.kind ?? "manual",
        body: parsed.data.body,
        relatedDemandId: parsed.data.relatedDemandId ?? null,
        status: "queued",
      })
      .returning();
    res.status(201).json(SendMessageResponse.parse(created));
  },
);

router.post(
  "/admin/messages/:id/send",
  requirePermission("canMessageVoters"),
  async (req, res): Promise<void> => {
    const params = SendMessageParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const [msg] = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.id, params.data.id));
    if (!msg) {
      res.status(404).json({ error: "Mensagem não encontrada" });
      return;
    }
    const result = await dispatchMessage({
      channel: msg.channel,
      to: msg.recipientContact ?? "",
      body: msg.body,
    });
    const [updated] = await db
      .update(messagesTable)
      .set(
        result.ok
          ? { status: "sent", sentAt: new Date(), error: null }
          : { status: "failed", error: result.error ?? "Falha no envio" },
      )
      .where(eq(messagesTable.id, msg.id))
      .returning();
    res.json(SendMessageResponse.parse(updated));
  },
);

/* -------------------------------- Gifts -------------------------------- */

router.get(
  "/admin/gifts",
  requirePermission("canManageGifts"),
  async (_req, res): Promise<void> => {
    const rows = await db
      .select()
      .from(giftsTable)
      .orderBy(desc(giftsTable.createdAt));
    res.json(ListGiftsResponse.parse(rows));
  },
);

router.post(
  "/admin/gifts",
  requirePermission("canManageGifts"),
  async (req, res): Promise<void> => {
    const parsed = CreateGiftBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const { scheduledFor, ...rest } = parsed.data;
    const [created] = await db
      .insert(giftsTable)
      .values({
        ...rest,
        deliveryType: rest.deliveryType ?? "casa",
        scheduledFor: toDateString(scheduledFor),
        status: "pendente",
      })
      .returning();
    res.status(201).json(UpdateGiftResponse.parse(created));
  },
);

router.patch(
  "/admin/gifts/:id",
  requirePermission("canManageGifts"),
  async (req, res): Promise<void> => {
    const params = UpdateGiftParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = UpdateGiftBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const set: Partial<typeof giftsTable.$inferInsert> = {};
    if (parsed.data.status !== undefined) {
      set.status = parsed.data.status;
      if (parsed.data.status === "entregue") set.deliveredAt = new Date();
    }
    if (parsed.data.deliveryType !== undefined)
      set.deliveryType = parsed.data.deliveryType;
    if (parsed.data.scheduledFor !== undefined)
      set.scheduledFor = toDateString(parsed.data.scheduledFor);
    if (parsed.data.notes !== undefined) set.notes = parsed.data.notes;

    const [updated] = await db
      .update(giftsTable)
      .set(set)
      .where(eq(giftsTable.id, params.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Brinde não encontrado" });
      return;
    }
    res.json(UpdateGiftResponse.parse(updated));
  },
);

/* ---------------------------- Templates -------------------------------- */

router.get(
  "/admin/message-templates",
  requirePermission("canMessageVoters"),
  async (_req, res): Promise<void> => {
    const rows = await db
      .select()
      .from(messageTemplatesTable)
      .orderBy(desc(messageTemplatesTable.createdAt));
    res.json(ListMessageTemplatesResponse.parse(rows));
  },
);

router.post(
  "/admin/message-templates",
  requirePermission("canMessageVoters"),
  async (req, res): Promise<void> => {
    const parsed = CreateMessageTemplateBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [created] = await db
      .insert(messageTemplatesTable)
      .values({
        name: parsed.data.name,
        kind: parsed.data.kind ?? "manual",
        body: parsed.data.body,
      })
      .returning();
    res.status(201).json(created);
  },
);

export { channelConfigured };
export default router;
