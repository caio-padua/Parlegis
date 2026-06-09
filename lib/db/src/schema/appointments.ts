import { date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const appointmentsTable = pgTable("appointments", {
  id: serial("id").primaryKey(),
  protocol: text("protocol").notNull().unique(),
  subject: text("subject").notNull(),
  description: text("description"),
  slotId: integer("slot_id"),
  preferredDate: date("preferred_date", { mode: "string" }),
  status: text("status").notNull().default("solicitado"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  citizenClerkUserId: text("citizen_clerk_user_id"),
  citizenName: text("citizen_name").notNull(),
  citizenEmail: text("citizen_email"),
  citizenPhone: text("citizen_phone"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Appointment = typeof appointmentsTable.$inferSelect;
export type InsertAppointment = typeof appointmentsTable.$inferInsert;
