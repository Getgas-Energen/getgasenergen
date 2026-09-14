/**
 * Kopokopo (K2) M-Pesa STK Push helpers — server only.
 *
 * Required env:
 *   KOPOKOPO_CLIENT_ID, KOPOKOPO_CLIENT_SECRET, KOPOKOPO_TILL_NUMBER, KOPOKOPO_API_KEY
 * Optional env:
 *   KOPOKOPO_BASE_URL (default https://api.kopokopo.com; sandbox: https://sandbox.kopokopo.com)
 *   SITE_URL (default https://getgas.co.ke) — used for the payment callback URL
 */

import { createHmac, timingSafeEqual } from "crypto";

function baseUrl() {
  return (process.env["KOPOKOPO_BASE_URL"] || "https://api.kopokopo.com").replace(/\/+$/, "");
}

export function kopokopoConfigured() {
  return Boolean(
    process.env["KOPOKOPO_CLIENT_ID"] &&
      process.env["KOPOKOPO_CLIENT_SECRET"] &&
      process.env["KOPOKOPO_TILL_NUMBER"],
  );
}

async function accessToken(): Promise<string> {
  const clientId = process.env["KOPOKOPO_CLIENT_ID"];
  const clientSecret = process.env["KOPOKOPO_CLIENT_SECRET"];
  if (!clientId || !clientSecret) throw new Error("Kopokopo credentials are not configured.");

  const res = await fetch(`${baseUrl()}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Kopokopo auth failed [${res.status}]: ${text}`);
  const json = JSON.parse(text) as { access_token?: string };
  if (!json.access_token) throw new Error("Kopokopo auth returned no token.");
  return json.access_token;
}

/** Triggers the M-Pesa prompt on the customer's phone. Returns the K2 request location. */
export async function requestStkPush(args: {
  orderNo: string;
  orderId: string;
  phone: string; // E.164, e.g. +2547...
  amountKes: number;
  firstName: string;
  lastName: string;
  email?: string | null;
}): Promise<{ location: string }> {
  const token = await accessToken();
  const site = (process.env["SITE_URL"] || "https://getgas.co.ke").replace(/\/+$/, "");

  const res = await fetch(`${baseUrl()}/api/v1/incoming_payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      payment_channel: "M-PESA STK Push",
      till_number: process.env["KOPOKOPO_TILL_NUMBER"],
      subscriber: {
        first_name: args.firstName,
        last_name: args.lastName,
        phone_number: args.phone,
        ...(args.email ? { email: args.email } : {}),
      },
      amount: { currency: "KES", value: Math.round(args.amountKes) },
      metadata: { orderNo: args.orderNo, orderId: args.orderId },
      _links: { callback_url: `${site}/api/public/kopokopo-webhook` },
    }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Kopokopo payment request failed [${res.status}]: ${text}`);

  let location = res.headers.get("location") ?? "";
  if (!location) {
    try {
      const json = JSON.parse(text) as { data?: { id?: string } };
      location = json.data?.id ?? "";
    } catch {
      location = "";
    }
  }
  return { location };
}

/** Verifies the X-KopoKopo-Signature HMAC over the raw request body. */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env["KOPOKOPO_API_KEY"];
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(signature.trim().toLowerCase());
  const b = Buffer.from(expected.toLowerCase());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
