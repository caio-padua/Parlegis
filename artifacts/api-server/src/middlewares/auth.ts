import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import type { User } from "@workspace/db";
import { getOrCreateCurrentUser } from "../lib/currentUser";

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
  if (user.role !== "admin") {
    res.status(403).json({ error: "Acesso restrito à equipe do gabinete" });
    return;
  }
  req.currentUser = user;
  next();
}
