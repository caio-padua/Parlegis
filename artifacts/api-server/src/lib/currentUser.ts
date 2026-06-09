import type { Request } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { eq, sql } from "drizzle-orm";
import { db, usersTable, type User } from "@workspace/db";

// Advisory lock key used to serialize JIT user provisioning so the
// "first user becomes admin" decision is atomic across concurrent requests.
const PROVISION_LOCK_KEY = 918273;

/**
 * Resolve the DB user for the authenticated Clerk session, provisioning
 * (JIT) on first sight. The very first user to register becomes "admin";
 * everyone after is a "citizen".
 */
export async function getOrCreateCurrentUser(
  req: Request,
): Promise<User | null> {
  const { userId: clerkUserId } = getAuth(req);
  if (!clerkUserId) return null;

  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.clerkUserId, clerkUserId));
  if (existing) return existing;

  let name: string | null = null;
  let email: string | null = null;
  try {
    const cu = await clerkClient.users.getUser(clerkUserId);
    name =
      [cu.firstName, cu.lastName].filter(Boolean).join(" ") ||
      cu.username ||
      null;
    email =
      cu.primaryEmailAddress?.emailAddress ??
      cu.emailAddresses[0]?.emailAddress ??
      null;
  } catch {
    // Clerk lookup is best-effort; provisioning proceeds without profile data.
  }

  // Serialize provisioning with a transaction-scoped advisory lock so the
  // role decision (count === 0 => admin) cannot race between concurrent
  // first-time requests, and a duplicate Clerk id resolves cleanly.
  const provisioned = await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${PROVISION_LOCK_KEY})`);

    const [again] = await tx
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkUserId, clerkUserId));
    if (again) return again;

    const [{ count }] = await tx
      .select({ count: sql<number>`count(*)::int` })
      .from(usersTable);
    const role = count === 0 ? "admin" : "citizen";

    const [created] = await tx
      .insert(usersTable)
      .values({ clerkUserId, name, email, role })
      .onConflictDoNothing()
      .returning();
    if (created) return created;

    const [fallback] = await tx
      .select()
      .from(usersTable)
      .where(eq(usersTable.clerkUserId, clerkUserId));
    return fallback;
  });

  return provisioned ?? null;
}
