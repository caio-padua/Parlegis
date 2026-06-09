---
name: Express literal vs param route ordering
description: Static sub-paths must be registered before parameterized routes on the same prefix or they get shadowed.
---

# Register literal sub-paths before `/:param` routes

On a shared prefix, register concrete literal paths BEFORE the parameterized one, e.g. `GET /admin/voters/birthdays` must come before `GET|PATCH|DELETE /admin/voters/:id`. Otherwise Express matches `/:id` first and treats `"birthdays"` as the id (parse-as-number fails or hits the wrong handler).

**Why:** Express matches routes in registration order; a `/:id` route registered first swallows every sibling segment.

**How to apply:** any time you add a fixed action/collection sub-route under a resource that already has `/:id` handlers (this repo's `routes/*.ts` use a single `Router()` per file), put the literal route above the param route in the file.
