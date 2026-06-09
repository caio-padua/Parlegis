/**
 * HeyGen avatar video integration.
 * Reads HEYGEN_API_KEY from env; degrades gracefully when not configured.
 */
import type { IntegrationStatus } from "./whatsapp";

const REQUIRED = ["HEYGEN_API_KEY"] as const;

export function heygenStatus(): IntegrationStatus {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  return { configured: missing.length === 0, provider: "heygen", missing };
}

export interface VideoResult {
  ok: boolean;
  videoId?: string;
  error?: string;
}

export async function generateAvatarVideo(
  script: string,
  avatarId?: string,
): Promise<VideoResult> {
  const status = heygenStatus();
  if (!status.configured) {
    return {
      ok: false,
      error: `HeyGen não configurado (faltam: ${status.missing.join(", ")})`,
    };
  }
  const apiKey = process.env.HEYGEN_API_KEY as string;
  const avatar = avatarId ?? process.env.HEYGEN_AVATAR_ID ?? "";
  try {
    const resp = await fetch("https://api.heygen.com/v2/video/generate", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: { type: "avatar", avatar_id: avatar },
            voice: { type: "text", input_text: script },
          },
        ],
      }),
    });
    if (!resp.ok) {
      const t = await resp.text();
      return { ok: false, error: `HeyGen ${resp.status}: ${t.slice(0, 200)}` };
    }
    const json = (await resp.json()) as { data?: { video_id?: string } };
    return { ok: true, videoId: json.data?.video_id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erro de rede" };
  }
}
