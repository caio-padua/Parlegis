import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

export const mandateStatsTable = pgTable("mandate_stats", {
  id: serial("id").primaryKey(),
  requerimentos: integer("requerimentos").notNull().default(0),
  indicacoes: integer("indicacoes").notNull().default(0),
  projetosLei: integer("projetos_lei").notNull().default(0),
  leisAprovadas: integer("leis_aprovadas").notNull().default(0),
  emendas: integer("emendas").notNull().default(0),
  atendimentos: integer("atendimentos").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type MandateStats = typeof mandateStatsTable.$inferSelect;
export type InsertMandateStats = typeof mandateStatsTable.$inferInsert;
