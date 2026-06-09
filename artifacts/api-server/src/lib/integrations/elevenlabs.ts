/**
 * ElevenLabs text-to-speech integration.
 * Reads ELEVENLABS_API_KEY from env; degrades gracefully when not configured.
 */
import type { IntegrationStatus } from "./whatsapp";

const REQUIRED = ["ELEVENLABS_API_KEY"] as const;

export function elevenlabsStatus(): IntegrationStatus {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  return { configured: missing.length === 0, provider: "elevenlabs", missing };
}

export interface VoiceResult {
  ok: boolean;
  audioBase64?: string;
  contentType?: string;
  error?: string;
}

export async function synthesizeVoice(
  text: string,
  voiceId?: string,
): Promise<VoiceResult> {
  const status = elevenlabsStatus();
  if (!status.configured) {
    return {
      ok: false,
      error: `ElevenLabs não configurado (faltam: ${status.missing.join(", ")})`,
    };
  }
  const apiKey = process.env.ELEVENLABS_API_KEY as string;
  const voice = voiceId ?? process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";
  try {
    const resp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
        }),
      },
    );
    if (!resp.ok) {
      const t = await resp.text();
      return { ok: false, error: `ElevenLabs ${resp.status}: ${t.slice(0, 200)}` };
    }
    const buf = Buffer.from(await resp.arrayBuffer());
    return { ok: true, audioBase64: buf.toString("base64"), contentType: "audio/mpeg" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erro de rede" };
  }
}
