---
name: JIT user provisioning + first-admin bootstrap (race safety)
description: How to make "first registered user becomes admin" atomic under concurrent requests.
---

# First-admin bootstrap must be atomic

A naive `SELECT count(*)` then `INSERT` to decide `role = count===0 ? admin : citizen` is a TOCTOU race: two concurrent first-time requests can both read count 0 and both become admin.

**Fix:** wrap the provisioning in a DB transaction guarded by a transaction-scoped Postgres advisory lock, re-check existence inside the lock, then insert with `onConflictDoNothing()` and re-select on conflict:

```
await db.transaction(async (tx) => {
  await tx.execute(sql`SELECT pg_advisory_xact_lock(${KEY})`);
  // re-check by clerk id, compute count, insert onConflictDoNothing, fallback select
});
```

**Why:** the advisory lock serializes all first-time provisioning (rare, so no real contention cost) so the count→role decision and the insert happen as one atomic unit; `onConflictDoNothing` + reselect also handles two concurrent requests for the *same* clerk id cleanly.

**How to apply:** any "first user is admin" / singleton-role bootstrap done via JIT provisioning. Architect review flags the count-then-insert pattern as a critical race.
