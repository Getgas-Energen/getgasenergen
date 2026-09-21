/**
 * Outbound SMS for marketplace order operations.
 *
 * Providers (first configured one wins):
 *   1. Emalify v2 app    — EMALIFY_APP_TOKEN, EMALIFY_PARTNER_ID, EMALIFY_SENDER_ID
 *   2. Emalify (legacy)  — EMALIFY_CLIENT_ID, EMALIFY_CLIENT_SECRET, EMALIFY_PROJECT_ID
 *   3. Twilio (gateway)  — TWILIO_API_KEY (connector) + TWILIO_SENDER
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

/** Internal number that receives new-submission alerts. */
export function TEAM_ALERT_PHONE(): string {
  return normalisePhone(process.env["TEAM_ALERT_PHONE"] || "+254702947573");
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

const EMALIFY_HOST = "https://api.emalify.com";

/** Emalify wants MSISDN without the leading plus, e.g. 2547XXXXXXXX. */
const msisdn = (e164: string) => e164.replace(/^\+/, "");

async function emalifyToken(clientId: string, clientSecret: string) {
  const res = await fetch(`${EMALIFY_HOST}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`auth ${res.status}: ${text}`);
  const data = JSON.parse(text) as { access_token?: string };
  if (!data.access_token) throw new Error("no access_token in Emalify auth response");
  return data.access_token;
}

/** Emalify v2 app API: POST /api/services/sendsms/ with the REST API key. */
async function sendViaEmalifyV2(to: string, body: string) {
  const apiKey = process.env["EMALIFY_API_KEY"] ?? process.env["EMALIFY_APP_TOKEN"];
  const partnerId = process.env["EMALIFY_PARTNER_ID"];
  if (!apiKey || !partnerId) return null;

  const payload: Record<string, unknown> = {
    apikey: apiKey,
    partnerID: partnerId,
    mobile: msisdn(to),
    message: body,
    pass_type: "plain",
    clientsmsid: crypto.randomUUID().replace(/-/g, "").slice(0, 20),
  };
  const sender = process.env["EMALIFY_SENDER_ID"];
  if (sender) payload["shortcode"] = sender;

  const res = await fetch("https://api.v2.emalify.com/api/services/sendsms/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let ok = res.ok;
  try {
    const data = JSON.parse(text) as { "response-code"?: number };
    if (typeof data["response-code"] === "number") ok = data["response-code"] === 200;
  } catch {
    // non-JSON response — rely on HTTP status
  }
  if (!ok) {
    console.error(`[SMS] Emalify v2 failed [${res.status}]: ${text}`);
    return { provider: "emalify", delivered: false, error: `${res.status}: ${text}` };
  }
  return { provider: "emalify", delivered: true, error: null as string | null };
}

async function sendViaEmalify(to: string, body: string) {
  const clientId = process.env["EMALIFY_CLIENT_ID"];
  const clientSecret = process.env["EMALIFY_CLIENT_SECRET"];
  const projectId = process.env["EMALIFY_PROJECT_ID"];
  if (!clientId || !clientSecret || !projectId) return null;

  const token = await emalifyToken(clientId, clientSecret);

  const payload: Record<string, unknown> = {
    to: [msisdn(to)],
    message: body,
    messageId: crypto.randomUUID().replace(/-/g, ""),
  };
  const sender = process.env["EMALIFY_SENDER_ID"];
  if (sender) payload["from"] = sender;

  const res = await fetch(`${EMALIFY_HOST}/projects/${projectId}/sms/simple/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    console.error(`[SMS] Emalify failed [${res.status}]: ${text}`);
    return { provider: "emalify", delivered: false, error: `${res.status}: ${text}` };
  }
  return { provider: "emalify", delivered: true, error: null as string | null };
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
    result = (await sendViaEmalifyV2(to, body)) ?? (await sendViaEmalify(to, body)) ?? (await sendViaTwilio(to, body));
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

/** Sends a one-off message (quotes, enquiries) and records it in sms_log. */
export async function sendPlainSms(phone: string, body: string, template: string) {
  const to = normalisePhone(phone);

  let result: { provider: string; delivered: boolean; error: string | null } | null = null;
  try {
    result = (await sendViaEmalifyV2(to, body)) ?? (await sendViaEmalify(to, body)) ?? (await sendViaTwilio(to, body));
  } catch (error) {
    result = {
      provider: "unknown",
      delivered: false,
      error: error instanceof Error ? error.message : "send failed",
    };
  }
  if (!result) result = { provider: "none", delivered: false, error: "No SMS provider configured" };

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("sms_log").insert({
      order_id: null,
      phone: to,
      template,
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
