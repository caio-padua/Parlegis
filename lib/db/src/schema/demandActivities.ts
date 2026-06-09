import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const demandActivitiesTable = pgTable("demand_activities", {
  id: serial("id").primaryKey(),
  demandId: integer("demand_id").notNull(),
  status: text("status"),
  note: text("note").notNull(),
  authorName: text("author_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type DemandActivity = typeof demandActivitiesTable.$inferSelect;
export type InsertDemandActivity = typeof demandActivitiesTable.$inferInsert;
