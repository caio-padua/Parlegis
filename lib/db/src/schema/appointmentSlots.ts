import {
  pgTable,
  serial,
  date,
  text,
  integer,
  boolean,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

/**
 * Manager-released appointment cards. Each card is a (date, period) bucket with
 * a capacity. Citizens can only book cards that are released and not yet full.
 * As a period fills, the next held card can be released progressively.
 */
export const appointmentSlotsTable = pgTable(
  "appointment_slots",
  {
    id: serial("id").primaryKey(),
    date: date("date", { mode: "string" }).notNull(),
    period: text("period").notNull(), // manha | tarde
    capacity: integer("capacity").notNull().default(5),
    bookedCount: integer("booked_count").notNull().default(0),
    released: boolean("released").notNull().default(false),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    uniqueDatePeriod: unique("appointment_slots_date_period").on(
      t.date,
      t.period,
    ),
  }),
);

export type AppointmentSlot = typeof appointmentSlotsTable.$inferSelect;
export type InsertAppointmentSlot = typeof appointmentSlotsTable.$inferInsert;
