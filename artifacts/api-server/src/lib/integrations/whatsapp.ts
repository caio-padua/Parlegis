/**
 * WhatsApp Cloud API integration.
 * Reads credentials from env; degrades gracefully when not configured.
 * Set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID to enable real sends.
 */

export interface IntegrationStatus {
  configured: boolean;
  provider: string;
  missing: string[];
}

const REQUIRED = ["WHATSAPP_TOKEN", "WHATSAPP_PHONE_ID"] as const;

export function whatsappStatus(): IntegrationStatus {
  const missing = REQUIRED.filter((k) => !process.env[k]);
  return { configured: missing.length === 0, provider: "whatsapp", missing };
}

export function whatsappConfigured(): boolean {
  return whatsappStatus().configured;
}

export interface SendResult {
  ok: boolean;
  error?: string;
}

export async function sendWhatsapp(
  to: string,
  body: string,
): Promise<SendResult> {
  const status = whatsappStatus();
  if (!status.configured) {
    return {
      ok: false,
      error: `WhatsApp não configurado (faltam: ${status.missing.join(", ")})`,
    };
  }
  if (!to) {
    return { ok: false, error: "Destinatário sem número de WhatsApp" };
  }
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const token = process.env.WHATSAPP_TOKEN;
  try {
    const resp = await fetch(
      `https://graph.facebook.com/v20.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to.replace(/\D/g, ""),
          type: "text",
          text: { body },
        }),
      },
    );
    if (!resp.ok) {
      const text = await resp.text();
      return { ok: false, error: `WhatsApp API ${resp.status}: ${text.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erro de rede" };
  }
}
