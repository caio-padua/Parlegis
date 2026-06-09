import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const agendaTable = pgTable("agenda_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  type: text("type").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
});

export type AgendaEvent = typeof agendaTable.$inferSelect;
export type InsertAgendaEvent = typeof agendaTable.$inferInsert;
