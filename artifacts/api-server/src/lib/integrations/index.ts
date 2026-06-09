import { sendWhatsapp, whatsappStatus, type IntegrationStatus, type SendResult } from "./whatsapp";
import { elevenlabsStatus } from "./elevenlabs";
import { heygenStatus } from "./heygen";

export * from "./whatsapp";
export * from "./elevenlabs";
export * from "./heygen";

/** Whether a given outbound channel has its credentials configured. */
export function channelConfigured(channel: string): boolean {
  switch (channel) {
    case "whatsapp":
      return whatsappStatus().configured;
    default:
      // sms/email providers not wired yet — treat as not configured.
      return false;
  }
}

/** Dispatch a message through the appropriate channel provider. */
export async function dispatchMessage(input: {
  channel: string;
  to: string;
  body: string;
}): Promise<SendResult> {
  switch (input.channel) {
    case "whatsapp":
      return sendWhatsapp(input.to, input.body);
    default:
      return {
        ok: false,
        error: `Canal "${input.channel}" não configurado`,
      };
  }
}

/** Snapshot of every integration's configuration status. */
export function allIntegrationStatuses(): IntegrationStatus[] {
  return [whatsappStatus(), elevenlabsStatus(), heygenStatus()];
}
