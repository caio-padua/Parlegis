import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import type { User } from "@workspace/db";
import { getOrCreateCurrentUser } from "../lib/currentUser";
import { hasCapability, isActiveStaff, type Capability } from "../lib/permissions";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  next();
}

/** Superadmin-only (the vereador / role "admin"). */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const user = await getOrCreateCurrentUser(req);
  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  if (user.role !== "admin" || !user.active) {
    res.status(403).json({ error: "Acesso restrito à equipe do gabinete" });
    return;
  }
  req.currentUser = user;
  next();
}

/** Any active gabinete staff member (vereador, chefe, assessores, atendimento). */
export async function requireStaff(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const user = await getOrCreateCurrentUser(req);
  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  if (!isActiveStaff(user)) {
    res.status(403).json({ error: "Acesso restrito à equipe do gabinete" });
    return;
  }
  req.currentUser = user;
  next();
}

/** Require a specific capability toggle (admin always passes). */
export function requirePermission(cap: Capability) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const user = await getOrCreateCurrentUser(req);
    if (!user) {
      res.status(401).json({ error: "Não autenticado" });
      return;
    }
    if (!hasCapability(user, cap)) {
      res.status(403).json({ error: "Você não tem permissão para esta ação" });
      return;
    }
    req.currentUser = user;
    next();
  };
}
