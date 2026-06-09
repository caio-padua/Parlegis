import { Router, type IRouter } from "express";
import { asc, eq, ne } from "drizzle-orm";
import {
  ListTeamResponse,
  CreateTeamMemberBody,
  UpdateTeamMemberParams,
  UpdateTeamMemberBody,
  ListTeamResponseItem,
} from "@workspace/api-zod";
import { db, usersTable, CARGOS, type Cargo } from "@workspace/db";
import { requirePermission } from "../middlewares/auth";
import { defaultPermissionsFor } from "../lib/permissions";

const router: IRouter = Router();

function isCargo(value: string): value is Cargo {
  return (CARGOS as readonly string[]).includes(value);
}

router.get(
  "/admin/team",
  requirePermission("canManageTeam"),
  async (_req, res): Promise<void> => {
    const rows = await db
      .select()
      .from(usersTable)
      .where(ne(usersTable.role, "citizen"))
      .orderBy(asc(usersTable.id));
    res.json(ListTeamResponse.parse(rows));
  },
);

router.post(
  "/admin/team",
  requirePermission("canManageTeam"),
  async (req, res): Promise<void> => {
    const parsed = CreateTeamMemberBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const { email, name, cargo, ...rest } = parsed.data;
    if (!isCargo(cargo)) {
      res.status(400).json({ error: "Cargo inválido" });
      return;
    }

    const [existing] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (existing) {
      res
        .status(409)
        .json({ error: "Já existe um usuário com este e-mail" });
      return;
    }

    // If no explicit toggles supplied, apply the cargo's default template.
    const supplied = rest.permissions ?? {};
    const permissions =
      Object.keys(supplied).length > 0 ? supplied : defaultPermissionsFor(cargo);

    const [created] = await db
      .insert(usersTable)
      .values({
        email,
        name: name ?? null,
        cargo,
        role: cargo === "vereador" ? "admin" : "staff",
        permissions,
        active: true,
        clerkUserId: null,
      })
      .returning();

    res.status(201).json(ListTeamResponseItem.parse(created));
  },
);

router.patch(
  "/admin/team/:id",
  requirePermission("canManageTeam"),
  async (req, res): Promise<void> => {
    const params = UpdateTeamMemberParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = UpdateTeamMemberBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [target] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, params.data.id));
    if (!target) {
      res.status(404).json({ error: "Membro não encontrado" });
      return;
    }
    if (target.role === "citizen") {
      res.status(400).json({ error: "Usuário não é membro da equipe" });
      return;
    }

    const updates: Partial<typeof usersTable.$inferInsert> = {};
    if (parsed.data.name !== undefined) updates.name = parsed.data.name;
    if (parsed.data.cargo !== undefined) {
      if (!isCargo(parsed.data.cargo)) {
        res.status(400).json({ error: "Cargo inválido" });
        return;
      }
      updates.cargo = parsed.data.cargo;
      updates.role = parsed.data.cargo === "vereador" ? "admin" : "staff";
    }
    if (parsed.data.permissions !== undefined)
      updates.permissions = parsed.data.permissions;
    if (parsed.data.active !== undefined) updates.active = parsed.data.active;

    const [updated] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, params.data.id))
      .returning();

    res.json(ListTeamResponseItem.parse(updated));
  },
);

export default router;
