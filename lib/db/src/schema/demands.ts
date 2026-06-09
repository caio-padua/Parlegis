import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const demandsTable = pgTable("demands", {
  id: serial("id").primaryKey(),
  protocol: text("protocol").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("recebida"),
  categoryId: integer("category_id"),
  neighborhoodId: integer("neighborhood_id"),
  photoUrl: text("photo_url"),
  citizenClerkUserId: text("citizen_clerk_user_id"),
  citizenName: text("citizen_name").notNull(),
  citizenEmail: text("citizen_email"),
  citizenPhone: text("citizen_phone"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Demand = typeof demandsTable.$inferSelect;
export type InsertDemand = typeof demandsTable.$inferInsert;
