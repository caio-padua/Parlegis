import { pgTable, serial, text, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

/**
 * Capabilities (permission toggles) that can be granted to gabinete staff.
 * The vereador (role "admin") implicitly has all capabilities.
 */
export const CAPABILITIES = [
  "canManageDemands",
  "canRespondDemands",
  "canManageProjects",
  "canManageNews",
  "canManageAgenda",
  "canManageAppointments",
  "canReleaseScheduleCards",
  "canManageStats",
  "canManageVoters",
  "canMessageVoters",
  "canManageGifts",
  "canManageTeam",
] as const;

export type Capability = (typeof CAPABILITIES)[number];
export type StaffPermissions = Partial<Record<Capability, boolean>>;

/**
 * Staff titles (cargo) within the gabinete hierarchy.
 */
export const CARGOS = [
  "vereador",
  "chefe_gabinete",
  "assessor_parlamentar",
  "assessor_juridico",
  "assessor_comunicacao",
  "assessor_imprensa",
  "atendimento",
] as const;

export type Cargo = (typeof CARGOS)[number];

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  // Nullable so an admin can pre-register a staff member by email; the row is
  // "claimed" (clerk_user_id filled) when that person first signs in via Clerk.
  clerkUserId: text("clerk_user_id").unique(),
  name: text("name"),
  email: text("email"),
  role: text("role").notNull().default("citizen"), // citizen | staff | admin
  cargo: text("cargo").$type<Cargo>(),
  permissions: jsonb("permissions").$type<StaffPermissions>().notNull().default({}),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;
