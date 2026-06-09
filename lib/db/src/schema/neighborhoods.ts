import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const neighborhoodsTable = pgTable("neighborhoods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  region: text("region"),
});

export type Neighborhood = typeof neighborhoodsTable.$inferSelect;
export type InsertNeighborhood = typeof neighborhoodsTable.$inferInsert;
