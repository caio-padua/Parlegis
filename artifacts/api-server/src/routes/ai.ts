import { Router, type IRouter } from "express";
import {
  ListIntegrationStatusResponse,
  GenerateVoiceBody,
  GenerateVoiceResponse,
  GenerateVideoBody,
  GenerateVideoResponse,
} from "@workspace/api-zod";
import { requirePermission } from "../middlewares/auth";
import {
  allIntegrationStatuses,
  synthesizeVoice,
  generateAvatarVideo,
} from "../lib/integrations";

const router: IRouter = Router();

router.get(
  "/admin/integrations",
  requirePermission("canMessageVoters"),
  async (_req, res): Promise<void> => {
    res.json(ListIntegrationStatusResponse.parse(allIntegrationStatuses()));
  },
);

router.post(
  "/admin/ai/voice",
  requirePermission("canMessageVoters"),
  async (req, res): Promise<void> => {
    const parsed = GenerateVoiceBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const result = await synthesizeVoice(
      parsed.data.text,
      parsed.data.voiceId ?? undefined,
    );
    res.json(GenerateVoiceResponse.parse(result));
  },
);

router.post(
  "/admin/ai/video",
  requirePermission("canMessageVoters"),
  async (req, res): Promise<void> => {
    const parsed = GenerateVideoBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const result = await generateAvatarVideo(
      parsed.data.script,
      parsed.data.avatarId ?? undefined,
    );
    res.json(GenerateVideoResponse.parse(result));
  },
);

export default router;
