/**
 * Outbound SMS for marketplace order operations.
 *
 * Providers (first configured one wins):
 *   1. Emalify           — EMALIFY_CLIENT_ID, EMALIFY_CLIENT_SECRET, EMALIFY_PROJECT_ID, EMALIFY_SENDER_ID
 *   2. Twilio (gateway)  — TWILIO_API_KEY (connector) + TWILIO_SENDER
 * When none is configured the message is still recorded in sms_log as undelivered,
 * so nothing breaks and staff can see what would have gone out.
 */

export type SmsTemplate =
  | "order_received"
  | "payment_received"
  | "order_confirmed"
  | "order_dispatched"
  | "order_delivered"
  | "order_cancelled";

export interface OrderSmsContext {
  orderNo: string;
  customerName: string;
  totalKes: number;
}

const money = (v: number) => `KES ${Number(v || 0).toLocaleString("en-KE")}`;
const firstName = (name: string) => (name || "there").trim().split(/\s+/)[0];

export function buildOrderMessage(template: SmsTemplate, ctx: OrderSmsContext): string {
  const who = firstName(ctx.customerName);
  switch (template) {
    case "order_received":
      return `Hi ${who}, Getgas Energen received order ${ctx.orderNo} (${money(ctx.totalKes)}). Approve the M-Pesa prompt on your phone to pay. Help: 0702947573`;
    case "payment_received":
      return `Payment received for order ${ctx.orderNo} (${money(ctx.totalKes)}). Thank you, ${who}. We are preparing your items. Getgas Energen`;
    case "order_confirmed":
      return `Hi ${who}, order ${ctx.orderNo} is confirmed and being prepared for delivery. Getgas Energen`;
    case "order_dispatched":
      return `Good news ${who} — order ${ctx.orderNo} has been dispatched for delivery. Our driver will call you. Getgas Energen`;
    case "order_delivered":
      return `Order ${ctx.orderNo} is marked delivered. Thank you for choosing Getgas Energen. Questions? Call 0702947573`;
    case "order_cancelled":
      return `Hi ${who}, order ${ctx.orderNo} has been cancelled. Call 0702947573 if this was not expected. Getgas Energen`;
  }
}

/** Normalise Kenyan numbers to E.164 (+2547...). */
export function normalisePhone(raw: string): string {
  const digits = (raw || "").replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("254")) return `+${digits}`;
  if (digits.startsWith("0")) return `+254${digits.slice(1)}`;
  if (digits.length === 9) return `+254${digits}`;
  return `+${digits}`;
}

async function sendViaAfricasTalking(to: string, body: string) {
  const apiKey = process.env["AFRICASTALKING_API_KEY"];
  const username = process.env["AFRICASTALKING_USERNAME"];
  if (!apiKey || !username) return null;

  const form = new URLSearchParams({ username, to, message: body });
  const sender = process.env["AFRICASTALKING_SENDER_ID"];
  if (sender) form.set("from", sender);

  const host =
    username === "sandbox"
      ? "https://api.sandbox.africastalking.com"
      : "https://api.africastalking.com";

  const res = await fetch(`${host}/version1/messaging`, {
    method: "POST",
    headers: {
      apiKey,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: form.toString(),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`[SMS] Africa's Talking failed [${res.status}]: ${text}`);
    return { provider: "africastalking", delivered: false, error: `${res.status}: ${text}` };
  }
  return { provider: "africastalking", delivered: true, error: null as string | null };
}

async function sendViaTwilio(to: string, body: string) {
  const connectionKey = process.env["TWILIO_API_KEY"];
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const from = process.env["TWILIO_SENDER"];
  const accountSid = process.env["TWILIO_ACCOUNT_SID"];
  if (!connectionKey || !lovableKey || !from || !accountSid) return null;

  const form = new URLSearchParams({ To: to, From: from, Body: body });
  const res = await fetch(
    `https://connector-gateway.lovable.dev/twilio/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": connectionKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    },
  );

  const text = await res.text();
  if (!res.ok) {
    console.error(`[SMS] Twilio failed [${res.status}]: ${text}`);
    return { provider: "twilio", delivered: false, error: `${res.status}: ${text}` };
  }
  return { provider: "twilio", delivered: true, error: null as string | null };
}

/** Sends the SMS and always records the attempt in sms_log. */
export async function sendOrderSms(args: {
  orderId: string | null;
  phone: string;
  template: SmsTemplate;
  ctx: OrderSmsContext;
}) {
  const to = normalisePhone(args.phone);
  const body = buildOrderMessage(args.template, args.ctx);

  let result: { provider: string; delivered: boolean; error: string | null } | null = null;
  try {
    result = (await sendViaAfricasTalking(to, body)) ?? (await sendViaTwilio(to, body));
  } catch (error) {
    result = {
      provider: "unknown",
      delivered: false,
      error: error instanceof Error ? error.message : "send failed",
    };
  }

  if (!result) {
    result = { provider: "none", delivered: false, error: "No SMS provider configured" };
  }

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("sms_log").insert({
      order_id: args.orderId,
      phone: to,
      template: args.template,
      body,
      provider: result.provider,
      delivered: result.delivered,
      error: result.error,
    });
  } catch (error) {
    console.error("[SMS] could not write sms_log", error);
  }

  return result;
}
