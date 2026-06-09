import { Router, type IRouter } from "express";
import { GetCurrentUserResponse } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";
import { getOrCreateCurrentUser } from "../lib/currentUser";

const router: IRouter = Router();

router.get("/me", requireAuth, async (req, res): Promise<void> => {
  const user = await getOrCreateCurrentUser(req);
  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }
  res.json(GetCurrentUserResponse.parse(user));
});

export default router;
