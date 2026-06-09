import {
  pgTable,
  serial,
  text,
  date,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

/** Voter / constituent CRM record. */
export const votersTable = pgTable("voters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  whatsapp: text("whatsapp"),
  email: text("email"),
  birthDate: date("birth_date", { mode: "string" }),
  address: text("address"),
  neighborhood: text("neighborhood"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Voter = typeof votersTable.$inferSelect;
export type InsertVoter = typeof votersTable.$inferInsert;

/** Outbound message log (WhatsApp / SMS / e-mail). Queued first, sent later. */
export const messagesTable = pgTable("messages", {
  id: serial("id").primaryKey(),
  voterId: integer("voter_id"),
  recipientName: text("recipient_name").notNull(),
  recipientContact: text("recipient_contact"),
  channel: text("channel").notNull().default("whatsapp"),
  kind: text("kind").notNull().default("manual"), // manual | aniversario | demanda_update | brinde
  body: text("body").notNull(),
  status: text("status").notNull().default("queued"), // queued | sent | failed
  relatedDemandId: integer("related_demand_id"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
});

export type Message = typeof messagesTable.$inferSelect;
export type InsertMessage = typeof messagesTable.$inferInsert;

/** Brindes (gifts) workflow: prepared and delivered to the voter's home or at the gabinete. */
export const giftsTable = pgTable("gifts", {
  id: serial("id").primaryKey(),
  voterId: integer("voter_id").notNull(),
  description: text("description").notNull(),
  deliveryType: text("delivery_type").notNull().default("casa"), // casa | gabinete
  occasion: text("occasion"), // aniversario | outro
  status: text("status").notNull().default("pendente"), // pendente | preparando | entregue | cancelado
  scheduledFor: date("scheduled_for", { mode: "string" }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
});

export type Gift = typeof giftsTable.$inferSelect;
export type InsertGift = typeof giftsTable.$inferInsert;

/** Reusable message templates with {nome}-style placeholders. */
export const messageTemplatesTable = pgTable("message_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  kind: text("kind").notNull().default("manual"),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type MessageTemplate = typeof messageTemplatesTable.$inferSelect;
export type InsertMessageTemplate = typeof messageTemplatesTable.$inferInsert;
