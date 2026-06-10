import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const SK = process.env.CLERK_SECRET_KEY;
const base = "https://api.clerk.com/v1";
const headers = {
  Authorization: `Bearer ${SK}`,
  "Content-Type": "application/json",
};

async function ensureClerkUser(email: string, password: string) {
  const q = await fetch(
    `${base}/users?email_address=${encodeURIComponent(email)}`,
    { headers },
  );
  const existing = (await q.json()) as Array<{ id: string }>;
  if (Array.isArray(existing)) {
    for (const u of existing) {
      await fetch(`${base}/users/${u.id}`, { method: "DELETE", headers });
    }
  }
  const res = await fetch(`${base}/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email_address: [email],
      password,
      skip_password_checks: true,
    }),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(
      `Clerk create failed for ${email}: ${res.status} ${JSON.stringify(body).slice(0, 400)}`,
    );
  }
  return (body as { id: string }).id;
}

async function ensureDbInvite(
  email: string,
  name: string,
  role: "admin" | "citizen",
  cargo: "vereador" | null,
) {
  await db.delete(usersTable).where(eq(usersTable.email, email));
  await db.insert(usersTable).values({
    clerkUserId: null,
    name,
    email,
    role,
    cargo,
    active: true,
  });
}

async function main() {
  console.log("Creating demo logins...");

  const adminId = await ensureClerkUser("admin@gmail.com", "4000");
  console.log("Clerk admin created:", adminId);
  const eleitorId = await ensureClerkUser("eleitor@gmail.com", "4000");
  console.log("Clerk eleitor created:", eleitorId);

  await ensureDbInvite(
    "admin@gmail.com",
    "Administrador (Vereador)",
    "admin",
    "vereador",
  );
  await ensureDbInvite("eleitor@gmail.com", "Eleitor Demonstração", "citizen", null);

  console.log("Demo logins ready.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
